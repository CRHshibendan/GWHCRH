// 观鸟记录云同步：依赖 Cloudflare Access 登录(身份由 Access JWT 识别)
// 未登录(Access 未启用/未登录)时自动退化为 localStorage 本地保存
(function () {
    var CACHE_KEY = 'lingming_records_cache';

    // 读取本地缓存
    function getLocal() {
        try {
            return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
        } catch (e) { return []; }
    }

    function setLocal(records) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(records));
    }

    // 拉取云端记录(未登录/接口不可用时用本地)
    window.syncRecords = {
        fetch: function () {
            return fetch('/api/records', { credentials: 'include' })
                .then(function (res) {
                    if (!res.ok) throw new Error('unauthorized');
                    return res.json();
                })
                .then(function (data) {
                    setLocal(data.records || []);
                    return { records: data.records || [], cloud: true };
                })
                .catch(function () {
                    return { records: getLocal(), cloud: false };
                });
        },
        // 打卡/取消:name 鸟名, seen true=看过
        toggle: function (name, seen) {
            // 先本地立即生效(体验优先)
            var records = getLocal();
            if (seen) {
                if (records.indexOf(name) < 0) records.push(name);
            } else {
                records = records.filter(function (n) { return n !== name; });
            }
            setLocal(records);

            // 再尝试云同步
            return fetch('/api/records', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, seen: seen }),
            })
            .then(function (res) {
                if (!res.ok) throw new Error('unauthorized');
                return res.json();
            })
            .then(function (data) {
                setLocal(data.records || []);
                return { records: data.records || [], cloud: true };
            })
            .catch(function () {
                return { records: records, cloud: false };
            });
        },
        has: function (name) {
            return getLocal().indexOf(name) >= 0;
        },
    };
})();
