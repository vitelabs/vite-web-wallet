import toast from 'components/toast/index.js';
import { getTokenIcon } from 'utils/tokenParser';

document.addEventListener('drop', e => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', e => {
    e.preventDefault();
    e.stopPropagation();
});

export default {
    install(Vue) {
        Vue.prototype.$onKeyDown = function (_code, cb) {
            const lastEvent = window.document.onkeydown;
            window.document.onkeydown = e => {
                e = e || window.event;
                const code = e.keyCode || e.which;
                if (!code || code !== _code) {
                    return;
                }
                e.preventDefault();
                if (cb) {
                    return cb();
                }
                return false;
            };
            return lastEvent;
        };

        Vue.prototype.$offKeyDown = function () {
            window.document.onkeydown = null;
        };

        Vue.prototype.$trim = (msg = '') => msg.replace(/(^\s*)|(\s*$)/g, '');

        Vue.prototype.$toast = function (message, err, type, position) {
            if (!err) {
                toast(message, type, position);
                return ;
            }

            const error = err && err.error ? err.error : err || null;
            const code = error ? error.code || -1 : -1;
            const errMsg = error ? error.message || error.msg || '' : '';

            // Show quota confirm, don't neet toast
            if (code === '1000001') {
                return;
            }
            if (code === 11011 || code === 11012 || code === 11020) {// wc 拒绝，断开
                return;
            }

            if (!this || !this.$t) {
                return;
            }

            let msg = code === -1 || !this.$i18n.messages.zh.errCode[Math.abs(code)]
                ? message || this.$t('hint.err') : this.$t(`errCode.${ Math.abs(code) }`);
            if (Math.abs(code) === 32002) {
                msg = `${ errMsg } (${ code })`;
            }
            if (code > 0) {
                msg = `${ msg } (${ code })`;
            }
            toast(msg, type, position);
        };

        // ----------filters

        Vue.filter('id2icon', function (value) {
            return getTokenIcon(value);
        });
    }
};
