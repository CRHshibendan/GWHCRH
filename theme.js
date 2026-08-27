// 主题共享逻辑:所有页面通用(暗色模式一键切换 + 记住偏好 + 圆形扩散动画)
// 用法:<script src="theme.js"></script> 然后调用 initThemeToggle('themeToggle')
var LMG_THEME_KEY = 'lmg-theme';

function lmgApplyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
}

// 初始:记住的偏好 > 跟随系统(无动画)
(function () {
    var saved = null;
    try { saved = localStorage.getItem(LMG_THEME_KEY); } catch (e) {}
    lmgApplyTheme(saved === 'dark' ? 'dark' : (saved === 'light' ? 'light' :
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')));
})();

// ===== 圆形扩散切换动画 =====
// 从按钮位置生成一个圆形遮罩,半径撑到页面最远角+过冲回弹,
// 用 View Transitions API(Chromium 111+/Safari 18+)实现像素级圆扩散;
// 不支持的浏览器退化为直接切换(无动画但功能正常)。
function lmgAnimateToggle(btn, toDark) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduce) {
        lmgApplyTheme(toDark ? 'dark' : 'light');
        return;
    }

    // 按钮中心坐标
    var r = btn.getBoundingClientRect();
    var cx = r.left + r.width / 2;
    var cy = r.top + r.height / 2;

    // 撑满视口最远角所需半径
    var maxR = Math.hypot(
        Math.max(cx, window.innerWidth - cx),
        Math.max(cy, window.innerHeight - cy)
    );

    var transition = document.startViewTransition(function () {
        lmgApplyTheme(toDark ? 'dark' : 'light');
    });

    transition.ready.then(function () {
        var radii = [
            // 过冲:冲到边缘外 ~7% 再弹回(maxR * 1.07)
            maxR * 1.07, maxR
        ];
        document.documentElement.animate(
            {
                clipPath: [
                    'circle(0px at ' + cx + 'px ' + cy + 'px)',
                    'circle(' + radii[0] + 'px at ' + cx + 'px ' + cy + 'px)',
                    'circle(' + radii[1] + 'px at ' + cx + 'px ' + cy + 'px)'
                ]
            },
            {
                // 2400ms 慢速蔓延
                duration: 2400,
                easing: 'cubic-bezier(0.16, 0.8, 0.3, 1)',
                pseudoElement: '::view-transition-new(root)'
            }
        );
    });
}

// 绑定切换按钮(页面加载后调用)
function initThemeToggle(btnId) {
    var toggle = document.getElementById(btnId);
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var toDark = !document.body.classList.contains('dark');
        try { localStorage.setItem(LMG_THEME_KEY, toDark ? 'dark' : 'light'); } catch (e) {}
        lmgAnimateToggle(toggle, toDark);
    });
}
