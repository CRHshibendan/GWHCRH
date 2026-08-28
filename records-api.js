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
