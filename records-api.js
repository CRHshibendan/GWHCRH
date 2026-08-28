// 翎鸣馆自建登录系统 + 观鸟记录 API（Cloudflare Worker + KV）
// 安全设计：
//  - 密码加盐 PBKDF2 哈希存储（Web Crypto，Worker 原生支持），绝不存明文
//  - 会话采用 HMAC 签名 Cookie（无状态）：任何边缘节点本地即可验证，
//    不依赖 KV 读取，彻底规避 KV 最终一致性导致的"刷新就掉登录"
//  - Cookie 带 Domain=lingmingguan.cn，主域与 www 共享登录态
//  - 滑动续期：剩余不足 15 天时访问自动续到 30 天
//  - 登录失败统一报错（不提示"用户不存在"防枚举），简单节流防爆破

const SESSION_TTL = 60 * 60 * 24 * 30; // 30 天（秒）
const RENEW_THRESHOLD = 60 * 60 * 24 * 15; // 剩余少于15天则续期
const PBKDF2_ITERS = 100000;
const COOKIE_DOMAIN = 'lingmingguan.cn';

function json(data, status, extraHeaders) {
    return new Response(JSON.stringify(data), {
        status: status || 200,
        headers: { 'Content-Type': 'application/json', ...(extraHeaders || {}) },
    });
}

function hex(buf) {
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, saltHex) {
    const enc = new TextEncoder();
    const saltBytes = new Uint8Array(saltHex.match(/.{2}/g).map(h => parseInt(h, 16)));
    const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits(
        { name: 'PBKDF2', hash: 'SHA-256', salt: saltBytes, iterations: PBKDF2_ITERS },
        key, 256
    );
    return hex(bits);
}

function randomToken() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return hex(bytes);
}

// 节流：同用户名登录失败 5 次后锁 10 分钟
async function isThrottled(env, name) {
    const key = 'loginfail:' + name;
    const n = parseInt((await env.LINGMING_KV.get(key)) || '0', 10);
    return n >= 5;
}
async function recordFail(env, name) {
    const key = 'loginfail:' + name;
    const n = parseInt((await env.LINGMING_KV.get(key)) || '0', 10) + 1;
    await env.LINGMING_KV.put(key, String(n), { expirationTtl: 600 });
}
async function clearFail(env, name) {
    await env.LINGMING_KV.delete('loginfail:' + name);
}

// ---------- 无状态签名会话 ----------
// token = base64(payload) + '.' + hex(HMAC-SHA256(payload, secret))
// secret 首次生成后存 KV，之后各节点读同一份（secret 不变，无一致性问题）

let _secretCache = null;
async function getSecret(env) {
    if (_secretCache) return _secretCache;
    let s = await env.LINGMING_KV.get('auth_secret');
    if (!s) {
        s = randomToken();
        await env.LINGMING_KV.put('auth_secret', s);
    }
    _secretCache = s;
    return s;
}

async function hmac(secret, msg) {
    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg));
    return hex(sig);
}

async function makeToken(user, env) {
    const payload = btoa(JSON.stringify({ u: user, exp: Math.floor(Date.now() / 1000) + SESSION_TTL }));
    const sig = await hmac(await getSecret(env), payload);
    return payload + '.' + sig;
}

// 验证会话：返回 { user, renew } 或 null（renew=true 表示需要续发 Cookie）
async function getSessionUser(request, env) {
    const cookie = request.headers.get('Cookie') || '';
    const m = cookie.match(/(?:^|;\s*)lm_session=([^;\s]+)/);
    if (!m) return null;
    const parts = m[1].split('.');
    if (parts.length !== 2) return null;
    const [payload, sig] = parts;
    const expect = await hmac(await getSecret(env), payload);
    // 定长比较防时序侧信道
    if (sig.length !== expect.length || !sig.split('').every((c, i) => c === expect[i])) return null;
    let data;
    try { data = JSON.parse(atob(payload)); } catch (e) { return null; }
    if (!data || typeof data.u !== 'string') return null;
    const now = Math.floor(Date.now() / 1000);
    if (data.exp <= now) return null;
    return { user: data.u, renew: data.exp - now < RENEW_THRESHOLD };
}

function sessionCookie(token, maxAge) {
    return 'lm_session=' + token + '; Path=/; Domain=' + COOKIE_DOMAIN +
        '; HttpOnly; Secure; SameSite=Lax; Max-Age=' + maxAge;
}

async function renewCookieHeader(user, env) {
    return sessionCookie(await makeToken(user, env), SESSION_TTL);
}

function validName(name) {
    return typeof name === 'string' && /^[a-zA-Z0-9_\u4e00-\u9fa5]{2,16}$/.test(name);
}
function validPass(pass) {
    return typeof pass === 'string' && pass.length >= 6 && pass.length <= 64;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // ---------- 鸟种页 OG 服务端注入(微信/QQ 爬虫不执行 JS) ----------
        // Cloudflare 会把 /bird.html 307 美化成 /bird,两种路径都要拦
        if (request.method === 'GET' && (path === '/bird.html' || path === '/bird')
            && url.searchParams.get('name')) {
            const og = await birdOgResponse(url, env);
            if (og) return og;
        }

        // ---------- 注册 ----------
        if (request.method === 'POST' && path === '/api/auth/register') {
            const body = await request.json().catch(() => null);
            if (!body || !validName(body.user) || !validPass(body.pass)) {
                return json({ error: 'bad_request', msg: '用户名2-16位(字母数字中文),密码至少6位' }, 400);
            }
            const userKey = 'user:' + body.user;
            if (await env.LINGMING_KV.get(userKey)) {
                return json({ error: 'exists', msg: '这个用户名已被使用' }, 409);
            }
            const salt = randomToken().slice(0, 32);
            const hash = await hashPassword(body.pass, salt);
            await env.LINGMING_KV.put(userKey, JSON.stringify({ salt, hash }));
            // 注册即登录
            const token = await makeToken(body.user, env);
            return json({ ok: true, user: body.user }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_TTL) });
        }

        // ---------- 登录 ----------
        if (request.method === 'POST' && path === '/api/auth/login') {
            const body = await request.json().catch(() => null);
            if (!body || !validName(body.user) || !validPass(body.pass)) {
                return json({ error: 'bad_request', msg: '用户名或密码格式不对' }, 400);
            }
            if (await isThrottled(env, body.user)) {
                return json({ error: 'throttled', msg: '失败次数太多,请10分钟后再试' }, 429);
            }
            const stored = JSON.parse((await env.LINGMING_KV.get('user:' + body.user)) || 'null');
            const ok = stored && (await hashPassword(body.pass, stored.salt)) === stored.hash;
            if (!ok) {
                await recordFail(env, body.user);
                return json({ error: 'invalid', msg: '用户名或密码错误' }, 401);
            }
            await clearFail(env, body.user);
            const token = await makeToken(body.user, env);
            return json({ ok: true, user: body.user }, 200, { 'Set-Cookie': sessionCookie(token, SESSION_TTL) });
        }

        // ---------- 登出 ----------
        if (request.method === 'POST' && path === '/api/auth/logout') {
            return json({ ok: true }, 200, { 'Set-Cookie': sessionCookie('invalid', 0) });
        }

        // ---------- 当前登录态（含滑动续期） ----------
        if (request.method === 'GET' && path === '/api/auth/me') {
            const s = await getSessionUser(request, env);
            if (!s) return json({ user: null });
            if (s.renew) {
                return json({ user: s.user }, 200, { 'Set-Cookie': await renewCookieHeader(s.user, env) });
            }
            return json({ user: s.user });
        }

        // ---------- 以下需要登录 ----------
        const s = await getSessionUser(request, env);
        if (!s) return json({ error: 'unauthorized', msg: '请先登录' }, 401);
        const user = s.user;

        // 观鸟记录:拉取
        if (request.method === 'GET' && path === '/api/records') {
            const records = await env.LINGMING_KV.get('records:' + user, 'json');
            return json({ user: user, records: records || [] });
        }

        // 观鸟记录:打卡/取消
        if (request.method === 'POST' && path === '/api/records') {
            const body = await request.json().catch(() => null);
            if (!body || typeof body.name !== 'string' || body.name.length > 30) {
                return json({ error: 'bad_request' }, 400);
            }
            let records = (await env.LINGMING_KV.get('records:' + user, 'json')) || [];
            if (body.seen) {
                if (!records.includes(body.name)) records.push(body.name);
            } else {
                records = records.filter(n => n !== body.name);
            }
            await env.LINGMING_KV.put('records:' + user, JSON.stringify(records));
            return json({ user: user, records: records });
        }

        return json({ error: 'not_found' }, 404);
    },
};

// ---------- 鸟种页 OG 服务端注入 ----------
// 微信/QQ 爬虫不执行 JS,需在服务端把 bird.html 的 meta 替换为对应鸟种。
// BIRDS 数据与 script.js 保持同步(仅取分享所需字段)。
const BIRDS_OG = [
    ['反嘴鹬', 'Recurvirostra avosetta', 'assets/images/fanzuiyu-main-new.png', '反嘴鹬科,又名反嘴鸻,体长38-45厘米。眼先、前额、头顶至颈上部黑色,形成黑色帽状.'],
    ['凤头麦鸡', 'Vanellus vanellus', 'assets/images/shorebirds/fengtoumaiji-1.png', '鸻形目鸻科,体型中等,腿长,头顶具细长羽冠。头顶至羽冠黑色,脸白色,眼下方有黑斑,喉.'],
    ['斑头秋沙鸭', 'Mergellus albellus', 'assets/images/waterfowl/bantouqiushaya-1.png', '鸭科斑头秋沙鸭属。雄鸟眼先和眼周黑色成块斑状,头部其余部分全白,背黑色,下体白色,体.'],
    ['罗纹鸭', 'Mareca falcata', 'assets/images/waterfowl/luowenya-1.png', '雁形目鸭科,又名葭凫、镰刀鸭。雄鸟头顶至后颈栗色,头侧及冠羽铜绿色,上体浅灰色密布暗.'],
    ['琵嘴鸭', 'Spatula clypeata', 'assets/images/waterfowl/pizuiya-1.png', '雁形目鸭科。雄鸟头颈部墨绿色带金属光泽,翼镜金属绿色,腹部和胁部锈红色,喙大呈铲状.'],
    ['小天鹅', 'Cygnus columbianus', 'assets/images/waterfowl/xiaotianer-1.png', '雁形目鸭科天鹅属。成鸟体长110-135厘米,全身羽毛洁白,喙黑色且基部两侧具黄斑(.'],
    ['中华秋沙鸭', 'Mergus squamatus', 'assets/images/waterfowl/zhonghuaqiushaya-1.png', '雁形目鸭科,无亚种分化,国家一级保护动物。羽冠长而明显成双冠状,嘴长而窄呈红色。雄鸟.'],
    ['花脸鸭', 'Sibirionetta formosa', 'assets/images/waterfowl/hualianya-1.png', '雁形目鸭科,又称黄尖鸭、黑眶鸭、元鸭。雄鸟脸部由黄、绿、黑、白等多种颜色组成花纹,胸.'],
    ['斑嘴鸭', 'Anas zonorhyncha', 'assets/images/waterfowl/banzuiya-1.png', '雁形目鸭科。雄鸟体羽大部棕褐色,嘴蓝黑色、先端黄色,嘴基至耳区有黑褐色贯眼线;翼镜蓝.'],
    ['白琵鹭', 'Platalea leucorodia', 'assets/images/spoonbills/baipilu-1.png', '鹮科琵鹭属大型涉禽。成鸟喙长而直、上下扁平,先端膨大呈琵琶形,喙表面带密集的横向条纹.'],
    ['黑脸琵鹭', 'Platalea minor', 'assets/images/spoonbills/heilianpilu-1.png', '鹈形目鹮科琵鹭属,国家一级保护动物。成鸟体羽白色,喙长直而扁平,先端膨大呈琵琶状;嘴.'],
    ['白腹鹞', 'Circus spilonotus', 'assets/images/raptors/baifuyao-1.png', '鹰科中型猛禽,体长50-60厘米。雄鸟头顶至上背白色具宽阔黑褐色纵纹,上体黑褐色具污.'],
    ['黑翅鸢', 'Elanus caeruleus', 'assets/images/raptors/heichiyuan-1.png', '鹰科黑翅鸢属小型猛禽,体长约33厘米。整体呈灰白色,额、脸部、下体及翼下覆羽白色,眼.'],
    ['红隼', 'Falco tinnunculus', 'assets/images/raptors/hongsun-1.png', '隼属中小型猛禽,体长31-38厘米,翼展69-74厘米。雄鸟头顶、头侧蓝灰色,背部、.'],
    ['海鸥', 'Larus canus', 'assets/images/gulls/haiou.png', '鸻形目鸥科鸥属鸟类,体长37-43厘米。喙鲜红色(冬季橙黄色),初级飞羽具黑色斑纹.'],
    ['斑鱼狗', 'Ceryle rudis', 'assets/images/kingfishers/banyugou-1.png', '翠鸟科鱼狗属,中等体型,体长27-31厘米,通体呈黑白斑杂状,头顶冠羽较短,尾白色具.'],
    ['白头鹤', 'Grus monacha', 'assets/images/others/baitouhe-1.png', '鹤形目鹤科,国家一级保护动物。大中型涉禽,体形较丹顶鹤小,体长90-97厘米,除头部.'],
    ['灰鹤', 'Grus grus', 'assets/images/others/huihe-1.png', '鹤形目鹤科,别名千岁鹤、玄鹤。通体羽色几乎全为灰色,前额和眼先黑色,头顶裸区朱红色.'],
    ['东方白鹳', 'Ciconia boyciana', 'assets/images/others/dongfangbaiguan-1.png', '鹳形目鹳科,国家一级保护动物。体态优美,长而粗壮的喙十分坚硬呈黑色,眼睛周围、眼线和.'],
    ['卷羽鹈鹕', 'Pelecanus crispus', 'assets/images/others/juanyutili-1.png', '鹈形目鹈鹕科,国家一级保护动物。成鸟体羽灰白色,肩、背、翼上覆羽及尾上覆羽具黑色羽轴.'],
    ['草鹭', 'Ardea purpurea', 'assets/images/others/caolu-1.png', '鹳形目鹭科。体形呈纺锤形,额和头顶蓝黑色,枕部有两枚黑色辫状羽;上体灰色,两翼飞羽灰.'],
    ['震旦鸦雀', 'Paradoxornis heudei', 'assets/images/others/zhendanyaque-1.png', '雀形目鸦雀科,别名苇雀,有"鸟中大熊猫"之称。全长15-18厘米,上背黄褐具黑色纵纹.'],
    ['黄鹡鸰', 'Motacilla flava', 'assets/images/others/huangjiling-1.png', '雀形目鹡鸰科。成鸟额、头顶、头侧、枕和后颈蓝灰色,细长眉纹黄白色;上体灰褐绿色,腰泛.'],
    ['栗耳鹀', 'Emberiza fucata', 'assets/images/others/lierwu-1.png', '雀形目鹀科,体重16-27克,体长130-173毫米。繁殖期雄鸟栗色耳羽与灰色顶冠及.'],
    ['珠颈斑鸠', 'Spilopedia chinensis', 'assets/images/others/zhujingbanjiu-1.png', '鸠鸽科副斑鸠属,别名花斑鸠、珍珠鸠。体型中等,体长27-34厘米。颈侧及后颈羽毛基部.'],
];

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// 把 bird.html 的通用 OG meta 替换为指定鸟种的(供微信/QQ/Telegram 抓取)
async function birdOgResponse(url, env) {
    let name = url.searchParams.get('name') || '';
    // 爬虫有时拿到的是编码后地址,尝试解码
    try { name = decodeURIComponent(name); } catch (e) { }
    const bird = BIRDS_OG.find(b => b[0] === name);
    let html;
    try {
        // env.ASSETS = Workers 静态资源绑定,取原始 bird.html(不会递归进 Worker)
        const asset = await env.ASSETS.fetch(new URL('/bird.html', url.origin));
        if (!asset.ok) return null;
        html = await asset.text();
    } catch (e) {
        return null;
    }
    if (!bird) return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

    const [n, latin, img, short] = bird;
    const imgAbs = 'https://lingmingguan.cn/' + img;
    html = html
        .replace(/<meta property="og:title" content="[^"]*">/,
            '<meta property="og:title" content="' + esc(n) + ' · 翎鸣馆鸟类图鉴">')
        .replace(/<meta property="og:description" content="[^"]*">/,
            '<meta property="og:description" content="' + esc(latin) + ' —— ' + esc(short) + '">')
        .replace(/<meta property="og:image" content="[^"]*">/,
            '<meta property="og:image" content="' + imgAbs + '">')
        .replace(/<meta name="description" content="[^"]*">/,
            '<meta name="description" content="' + esc(n) + '(' + esc(latin) + '):' + esc(short) + '">')
        .replace(/<title>[^<]*<\/title>/,
            '<title>' + esc(n) + ' · 翎鸣馆</title>');
    return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
