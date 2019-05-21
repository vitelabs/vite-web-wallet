import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';
import { wallet } from 'utils/wallet';

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
                cb && cb();
            };
            return lastEvent;
        };

        Vue.prototype.$offKeyDown = function () {
            window.document.onkeydown = null;
        };

        Vue.prototype.$validAmount = (amount = '', decimals = 8) => {
            const limit = decimals >= 8 ? 8 : decimals;
            const decimalNum = decimals ? new RegExp(`^\\d+[.]\\d{1,${ limit }}$`) : null;

            const isInt = new RegExp('^(\\d+)$').test(amount);
            const isPoint = new RegExp('^\\d+[.]\\d+$').test(amount);

            if (!isInt && !isPoint) {
                return 1;
            }

            if (isPoint && !(decimalNum && decimalNum.test(amount))) {
                return 2;
            }

            return 0;
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

            let msg = code === -1 || !this.$i18n.messages.zh.errCode[Math.abs(code)]
                ? message || this.$i18n.messages.en.hint.err : this.$i18n.messages.en.errCode[Math.abs(code)];
            if (code > 0) {
                msg = `${ Math.abs(code) === 32002 ? errMsg : msg } (${ code })`;
            }
            toast(msg, type, position);
        };

        Vue.prototype.$confirm = confirm;

        Vue.prototype.$statistics = statistics;

        Vue.prototype.$wallet = wallet;
    }
};
