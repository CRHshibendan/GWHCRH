// 翎鸣馆分享按钮：低调融入导航栏,分享成功后小动画反馈
// - 图标平时半透明融入背景,悬停才点亮(找得到但不抢戏)
// - 优先 Web Share API(手机原生分享面板),降级复制链接
// - 成功动画:纸飞机/链接飞出 + 顶部浮出"链接已复制"胶囊
(function () {
    var css = document.createElement('style');
    css.textContent = [
        // 按钮:幽灵样式,与导航融为一体
        '.lm-share-btn{display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;color:inherit;opacity:.42;transition:opacity .25s ease,background .25s ease,transform .25s ease;cursor:pointer;border:none;background:transparent;}',
        '.lm-share-btn:hover{opacity:1;background:rgba(29,122,74,.10);transform:translateY(-1px);}',
        '.lm-share-btn svg{width:16px;height:16px;}',
        '.lm-share-btn.done{opacity:1;color:#1d7a4a;background:rgba(29,122,74,.12);}',
        // 成功后按钮内图标对勾
        '.lm-share-btn .tick{display:none;width:15px;height:15px;}',
        '.lm-share-btn.done .tick{display:block;}',
        '.lm-share-btn.done .share-ico{display:none;}',
        // 复制成功动画:小卡片从按钮飞出(链接已复制的具象化)
        '.lm-fly{position:fixed;z-index:9998;pointer-events:none;font-size:12px;font-weight:600;color:#1d7a4a;background:#d8ffea;border:1px solid rgba(29,122,74,.25);border-radius:8px;padding:5px 10px;box-shadow:0 6px 18px rgba(29,122,74,.18);animation:lmFlyUp 1.15s cubic-bezier(.22,.9,.32,1) both;}',
        '@keyframes lmFlyUp{',
        '0%{opacity:0;transform:translate(-50%,0) scale(.7);}',
        '18%{opacity:1;transform:translate(-50%,-14px) scale(1);}',
        '70%{opacity:1;transform:translate(-50%,-26px) scale(1);}',
        '100%{opacity:0;transform:translate(-50%,-44px) scale(.92);}',
        '}',
        // 按钮对勾画入
        '.lm-share-btn .tick path{stroke-dasharray:24;stroke-dashoffset:24;}',
        '.lm-share-btn.done .tick path{animation:lmTickDraw .45s cubic-bezier(.34,1.56,.64,1) .05s forwards;}',
        '@keyframes lmTickDraw{to{stroke-dashoffset:0;}}',
    ].join('\n');
    document.head.appendChild(css);

    var ICON_SHARE = '<svg class="share-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>';
    var ICON_TICK = '<svg class="tick" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

    function pageMeta() {
        var ogTitle = document.head.querySelector('meta[property="og:title"]');
        var ogDesc = document.head.querySelector('meta[property="og:description"]');
        return {
            title: (ogTitle && ogTitle.content) || document.title,
            text: (ogDesc && ogDesc.content) || ''
        };
    }

    function flyCard(btn, msg) {
        var r = btn.getBoundingClientRect();
        var el = document.createElement('div');
        el.className = 'lm-fly';
        el.textContent = msg;
        el.style.left = (r.left + r.width / 2) + 'px';
        el.style.top = (r.top - 6) + 'px';
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 1200);
    }

    function successFx(btn, msg) {
        btn.classList.add('done');
        flyCard(btn, msg);
        setTimeout(function () { btn.classList.remove('done'); }, 2200);
    }

    function legacyCopy(text, btn) {
        // iOS Safari 兼容:临时可编辑区
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;left:-9999px;top:0;';
        document.body.appendChild(ta);
        ta.focus(); ta.select();
        try { document.execCommand('copy'); successFx(btn, '✓ 链接已复制'); }
        catch (e) { flyCard(btn, '复制失败,请手动复制'); }
        ta.remove();
    }

    function doShare(btn) {
        var meta = pageMeta();
        var url = location.href;
        if (navigator.share) {
            navigator.share({ title: meta.title, text: meta.text, url: url })
                .then(function () { successFx(btn, '✓ 已分享'); })
                .catch(function () { /* 用户取消,无动画 */ });
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url)
                .then(function () { successFx(btn, '✓ 链接已复制'); })
                .catch(function () { legacyCopy(url, btn); });
        } else {
            legacyCopy(url, btn);
        }
    }

    function init() {
        // 插到登录按钮(或主题按钮)旁边
        var anchor = document.getElementById('lmNavBtn') || document.getElementById('themeToggle');
        if (!anchor) return;
        var host = anchor.closest('li') || anchor;
        var btn = document.createElement('button');
        btn.className = 'lm-share-btn';
        btn.title = '分享这一页';
        btn.setAttribute('aria-label', '分享这一页');
        btn.innerHTML = ICON_SHARE + ICON_TICK;
        btn.addEventListener('click', function () { doShare(btn); });
        if (host.parentNode) {
            if (host.closest('li')) {
                // 首页等 ul/li 导航:包一层 li 保持结构一致
                var li = document.createElement('li');
                li.appendChild(btn);
                host.parentNode.insertBefore(li, host);
            } else {
                // 鸟种页等纯 a 导航:直接插入,避免裸 li 渲染出列表圆点
                host.parentNode.insertBefore(btn, host);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 50); });
    } else {
        setTimeout(init, 50);
    }
})();
