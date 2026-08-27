// ===== 鸟图卡 3D 倾斜跟随 + 高光扫光(所有科普详情页共用) =====
// 悬停时卡片随鼠标位置微倾(±6° rotateX/rotateY),
// 表面一道 radial-gradient 高光跟随鼠标;移出后借 CSS 变量过渡平滑回正。
// 配合 tips.css:--rx/--ry 控制倾斜,--gx/--gy 控制高光圆心。
(function () {
    // 触屏/无 hover 设备不启用(点按播放叫声等既有交互不受影响)
    if (window.matchMedia('(hover: none)').matches) return;

    var MAX_TILT = 6; // 最大倾角(度)

    document.querySelectorAll('.tp-bird-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
            var r = card.getBoundingClientRect();
            var px = (e.clientX - r.left) / r.width;   // 0 ~ 1
            var py = (e.clientY - r.top) / r.height;   // 0 ~ 1
            // 鼠标在左半边 → 卡片左缘后仰(绕 Y 轴负转);
            // 鼠标在上半边 → 卡片顶部向后仰(绕 X 轴正转)
            var ry = (px - 0.5) * 2 * MAX_TILT;
            var rx = (0.5 - py) * 2 * MAX_TILT;
            card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
            card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
            // 高光圆心跟随鼠标(百分比)
            card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        });

        card.addEventListener('mouseleave', function () {
            // 归零;由 tips.css 里的变量过渡平滑回正
            card.style.setProperty('--rx', '0deg');
            card.style.setProperty('--ry', '0deg');
        });
    });
})();
