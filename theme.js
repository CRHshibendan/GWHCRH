// 主题共享逻辑:所有页面通用(暗色模式一键切换 + 记住偏好)
// 用法:<script src="theme.js"></script> 然后调用 initTheme({toggle:'themeToggle', navClass:'nav'})
var LMG_THEME_KEY = 'lmg-theme';

function lmgApplyTheme(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
}

// 初始:记住的偏好 > 跟随系统
(function () {
    var saved = null;
    try { saved = localStorage.getItem(LMG_THEME_KEY); } catch (e) {}
    lmgApplyTheme(saved === 'dark' ? 'dark' : (saved === 'light' ? 'light' :
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')));
})();

// 绑定切换按钮(页面加载后调用)
function initThemeToggle(btnId) {
    var toggle = document.getElementById(btnId);
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
        e.preventDefault();
        var toDark = !document.body.classList.contains('dark');
        lmgApplyTheme(toDark ? 'dark' : 'light');
        try { localStorage.setItem(LMG_THEME_KEY, toDark ? 'dark' : 'light'); } catch (e) {}
    });
}
