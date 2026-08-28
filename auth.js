// 翎鸣馆登录系统前端：自动在导航栏注入登录入口 + 登录/注册弹窗
// 依赖后端 records-api.js 提供的 /api/auth/* 接口
(function () {
    var state = { user: null, ready: false };

    // ---------- 样式 ----------
    var css = document.createElement('style');
    css.textContent = [
        '.lm-auth-btn{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:var(--text,#1d1d1f);background:var(--btn-bg,rgba(0,0,0,.05));border:1px solid var(--btn-border,rgba(0,0,0,.10));border-radius:999px;padding:8px 18px;cursor:pointer;font-family:inherit;transition:background .25s ease,border-color .25s ease,transform .25s ease;text-decoration:none;}',
        '.lm-auth-btn:hover{background:var(--btn-bg-hover,rgba(0,0,0,.09));border-color:var(--btn-border-hover,rgba(0,0,0,.16));transform:scale(1.04);}',
        '.lm-auth-btn.logged{background:var(--chip-bg,#d8ffea);color:var(--green,#1d7a4a);border-color:transparent;}',
        '.lm-mask{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.35);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .3s ease;}',
        '.lm-mask.show{opacity:1;pointer-events:auto;}',
        '.lm-modal{width:100%;max-width:340px;background:var(--card,#fff);border-radius:22px;padding:32px 28px 28px;box-shadow:0 24px 64px rgba(0,0,0,.25);transform:scale(.92);transition:transform .3s cubic-bezier(.34,1.56,.64,1);}',
        '.lm-mask.show .lm-modal{transform:scale(1);}',
        '.lm-modal h3{font-size:20px;font-weight:700;color:var(--text,#1d1d1f);margin:0 0 4px;}',
        '.lm-modal .sub{font-size:13px;color:var(--text-dim,#86868b);margin:0 0 20px;}',
        '.lm-tabs{display:flex;gap:6px;background:var(--btn-bg,rgba(0,0,0,.05));border-radius:999px;padding:4px;margin-bottom:18px;}',
        '.lm-tab{flex:1;text-align:center;font-size:13.5px;font-weight:600;padding:8px 0;border-radius:999px;cursor:pointer;color:var(--text-dim,#86868b);transition:all .2s ease;font-family:inherit;border:none;background:transparent;}',
        '.lm-tab.on{background:var(--card,#fff);color:var(--text,#1d1d1f);box-shadow:0 2px 8px rgba(0,0,0,.10);}',
        '.lm-field{width:100%;box-sizing:border-box;font-size:15px;font-family:inherit;color:var(--text,#1d1d1f);background:var(--btn-bg,rgba(0,0,0,.04));border:1px solid var(--btn-border,rgba(0,0,0,.10));border-radius:12px;padding:12px 16px;margin-bottom:12px;outline:none;transition:border-color .2s ease;}',
        '.lm-field:focus{border-color:var(--green,#1d7a4a);}',
        '.lm-submit{width:100%;font-size:15px;font-weight:600;font-family:inherit;color:#fff;background:#1d7a4a;border:none;border-radius:12px;padding:12px 0;cursor:pointer;transition:background .2s ease,transform .2s ease;}',
        '.lm-submit:hover{background:#16603b;}',
        '.lm-submit:active{transform:scale(.98);}',
        '.lm-submit:disabled{opacity:.6;cursor:wait;}',
        '.lm-err{font-size:13px;color:#d92d20;min-height:18px;margin:2px 0 8px;text-align:center;}',
        '.lm-ok{font-size:13px;color:var(--green,#1d7a4a);text-align:center;margin:14px 0 0;}',
    ].join('\n');
    document.head.appendChild(css);

    // ---------- 弹窗 DOM ----------
    var mask = document.createElement('div');
    mask.className = 'lm-mask';
    mask.innerHTML =
        '<div class="lm-modal">' +
            '<h3 id="lmTitle">欢迎回到翎鸣馆</h3>' +
            '<p class="sub">登录后观鸟记录自动云同步</p>' +
            '<div class="lm-tabs">' +
                '<button class="lm-tab on" id="lmTabLogin">登录</button>' +
                '<button class="lm-tab" id="lmTabReg">注册</button>' +
            '</div>' +
            '<input class="lm-field" id="lmUser" placeholder="用户名" maxlength="16" autocomplete="username">' +
            '<input class="lm-field" id="lmPass" type="password" placeholder="密码(至少6位)" maxlength="64" autocomplete="current-password">' +
            '<p class="lm-err" id="lmErr"></p>' +
            '<button class="lm-submit" id="lmSubmit">登录</button>' +
        '</div>';
    document.body.appendChild(mask);

    var mode = 'login';
    var $ = function (id) { return document.getElementById(id); };

    function setMode(m) {
        mode = m;
        $('lmTabLogin').classList.toggle('on', m === 'login');
        $('lmTabReg').classList.toggle('on', m === 'reg');
        $('lmTitle').textContent = m === 'login' ? '欢迎回到翎鸣馆' : '创建翎鸣馆账号';
        $('lmSubmit').textContent = m === 'login' ? '登录' : '注册并登录';
        $('lmErr').textContent = '';
    }
    $('lmTabLogin').onclick = function () { setMode('login'); };
    $('lmTabReg').onclick = function () { setMode('reg'); };

    function open() { $('lmErr').textContent = ''; mask.classList.add('show'); setTimeout(function () { $('lmUser').focus(); }, 250); }
    function close() { mask.classList.remove('show'); }
    mask.addEventListener('click', function (e) { if (e.target === mask) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    $('lmSubmit').onclick = function () {
        var user = $('lmUser').value.trim();
        var pass = $('lmPass').value;
        $('lmErr').textContent = '';
        var btn = $('lmSubmit');
        btn.disabled = true;
        var ep = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
        fetch(ep, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: user, pass: pass }),
        })
        .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, d: d }; }); })
        .then(function (r) {
            btn.disabled = false;
            if (!r.ok) { $('lmErr').textContent = (r.d && r.d.msg) || '出错了,稍后再试'; return; }
            close();
            $('lmPass').value = '';
            state.user = r.d.user;
            renderNav();
            // 通知全站刷新登录态(打卡按钮等)
            window.dispatchEvent(new CustomEvent('lm-auth-change', { detail: { user: r.d.user } }));
        })
        .catch(function () { btn.disabled = false; $('lmErr').textContent = '网络异常,请重试'; });
    };
    $('lmPass').addEventListener('keydown', function (e) { if (e.key === 'Enter') $('lmSubmit').click(); });

    // ---------- 导航栏按钮 ----------
    function renderNav() {
        var btn = document.getElementById('lmNavBtn');
        if (!btn) return;
        if (state.user) {
            btn.textContent = '👤 ' + state.user;
            btn.classList.add('logged');
            btn.title = '点击退出登录';
        } else {
            btn.textContent = '登录';
            btn.classList.remove('logged');
            btn.title = '登录/注册';
        }
    }

    function init() {
        // 找到导航里的主题按钮,把登录按钮插到它前面(index.html 与 bird.html 通用)
        var themeLi = document.getElementById('themeToggle');
        var anchor = themeLi ? (themeLi.closest('li') || themeLi) : null;
        var btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'lm-auth-btn';
        btn.id = 'lmNavBtn';
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (state.user) {
                if (confirm('退出登录?本机的观鸟记录会保留,下次登录可从云端恢复。')) {
                    fetch('/api/auth/logout', { method: 'POST' }).then(function () {
                        state.user = null;
                        renderNav();
                        window.dispatchEvent(new CustomEvent('lm-auth-change', { detail: { user: null } }));
                    });
                }
            } else {
                open();
            }
        });
        if (anchor && anchor.parentNode) {
            var li = document.createElement('li');
            li.appendChild(btn);
            anchor.parentNode.insertBefore(li, anchor);
        } else {
            document.body.insertBefore(btn, document.body.firstChild);
        }

        // 查询当前登录态
        fetch('/api/auth/me')
            .then(function (res) { return res.json(); })
            .then(function (d) { state.user = d.user || null; renderNav(); })
            .catch(function () { renderNav(); });
    }

    window.lmAuth = { open: open, getUser: function () { return state.user; } };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
