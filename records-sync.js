// 观鸟记录云同步：登录后走云端(/api/records, Cookie 会话),未登录退化为 localStorage 本地保存
(function () {
    var CACHE_KEY = 'lingming_records_cache';

    function getLocal() {
        try {
            return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
        } catch (e) { return []; }
    }

    function setLocal(records) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(records));
    }

    window.syncRecords = {
        // 拉取云端记录;未登录返回本地缓存
        fetch: function () {
            return fetch('/api/records', { credentials: 'same-origin' })
                .then(function (res) {
                    if (res.status === 401) throw new Error('need_login');
                    if (!res.ok) throw new Error('server_error');
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
        // 打卡/取消:name 鸟名, seen true=看过。本地立即生效,再异步云同步
        toggle: function (name, seen) {
            var records = getLocal();
            if (seen) {
                if (records.indexOf(name) < 0) records.push(name);
            } else {
                records = records.filter(function (n) { return n !== name; });
            }
            setLocal(records);

            return fetch('/api/records', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, seen: seen }),
            })
            .then(function (res) {
                if (res.status === 401) throw new Error('need_login');
                if (!res.ok) throw new Error('server_error');
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
