!function (e) {
    const t = {};function n(i) {
        if (t[i]) return t[i].exports;const o = t[i] = { i: i, l: !1, exports: {} };return e[i].call(o.exports, o, o.exports, n), o.l = !0, o.exports;
    }n.m = e, n.c = t, n.d = function (e, t, i) {
        n.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
    }, n.r = function (e) {
        'undefined' !== typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, { value: 'Module' }), Object.defineProperty(e, '__esModule', { value: !0 });
    }, n.t = function (e, t) {
        if (1 & t && (e = n(e)), 8 & t) return e;if (4 & t && 'object' === typeof e && e && e.__esModule) return e;const i = Object.create(null);if (n.r(i), Object.defineProperty(i, 'default', { enumerable: !0, value: e }), 2 & t && 'string' !== typeof e) for (const o in e)n.d(i, o, function (t) {
            return e[t];
        }.bind(null, o));return i;
    }, n.n = function (e) {
        const t = e && e.__esModule ? function () {
            return e.default;
        } : function () {
            return e;
        };return n.d(t, 'a', t), t;
    }, n.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, n.p = '', n(n.s = 2);
}([ function (e, t) {
    const n = {}, i = location.search.slice(1);if (i.length > 0) {
        i.split('&').forEach(e => {
            const t = e.split('=');t.length > 1 && (n[t[0]] = t[1]);
        });
    }e.exports = n;
}, function (e, t) {
    t.inViteApp = function () {
        return navigator.userAgent.indexOf('vite') > -1 || !!window.webkit || window._dsbridge || window._dsf || -1 != navigator.userAgent.indexOf('_dsbridge');
    };
}, function (e, t, n) {
    const i = n(0), { inViteApp: o } = n(1);i.vitex_invite_code || (i.vitex_invite_code = ''), document.getElementById('code_span').innerHTML = i.vitex_invite_code, o() ? location.href = `/webview/vitex_invite_inner?vitex_invite_code=${ i.vitex_invite_code }` : location.href = 'https://app.vitex.net';
} ]);
