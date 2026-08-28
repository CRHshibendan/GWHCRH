// 观鸟记录 API：登录用户(经 Cloudflare Access 校验)的打卡数据存 KV
// 安全性：依赖 Cloudflare Access 注入的 Cf-Access-Jwt-Assertion 头部识别用户
// 部署：wrangler.jsonc 已配置 kv_namespaces

// Base64url 解码(解析 JWT payload 用)
function decodeBase64Url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    while (str.length % 4) str += '=';
    const bin = atob(str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}

// 从 Access JWT 提取用户邮箱(仅作身份标识;JWT 真实性由 Access 边缘网关保证,
// 外部流量未经过 Access 时不会携带有效 JWT,workers.dev 域名已关闭)
function getUserEmail(request) {
    const token = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!token) return null;
    try {
        const payload = JSON.parse(decodeBase64Url(token.split('.')[1]));
        return payload.sub || null; // sub = 用户邮箱
    } catch (e) {
        return null;
    }
}

export default {
    async fetch(request, env) {
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'https://lingmingguan.cn',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        };

        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const email = getUserEmail(request);
        if (!email) {
            return new Response(JSON.stringify({ error: 'unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            });
        }

        const url = new URL(request.url);
        const kvKey = 'records:' + email;
        const corsAndJson = { 'Content-Type': 'application/json', ...corsHeaders };

        // GET /api/records → 拉取我的观鸟记录
        if (request.method === 'GET' && url.pathname === '/api/records') {
            const records = await env.LINGMING_KV.get(kvKey, 'json');
            return new Response(JSON.stringify({ records: records || [] }), {
                headers: corsAndJson,
            });
        }

        // POST /api/records → 打卡/取消打卡一种鸟
        // body: { name: '红隼', seen: true/false }
        if (request.method === 'POST' && url.pathname === '/api/records') {
            let body;
            try {
                body = await request.json();
            } catch (e) {
                return new Response(JSON.stringify({ error: 'bad_request' }), {
                    status: 400,
                    headers: corsAndJson,
                });
            }
            if (!body || typeof body.name !== 'string' || body.name.length > 30) {
                return new Response(JSON.stringify({ error: 'bad_request' }), {
                    status: 400,
                    headers: corsAndJson,
                });
            }

            let records = (await env.LINGMING_KV.get(kvKey, 'json')) || [];
            if (body.seen) {
                if (!records.includes(body.name)) records.push(body.name);
            } else {
                records = records.filter(function (n) { return n !== body.name; });
            }
            await env.LINGMING_KV.put(kvKey, JSON.stringify(records));
            return new Response(JSON.stringify({ records }), { headers: corsAndJson });
        }

        return new Response(JSON.stringify({ error: 'not_found' }), {
            status: 404,
            headers: corsAndJson,
        });
    },
};
