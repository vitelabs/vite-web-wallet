import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';
import { wallet } from 'utils/wallet';
import getTokenIcon from 'utils/getTokenIcon';

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

            let msg = code === -1 || !this.$i18n.messages.zh.errCode[Math.abs(code)]
                ? message || this.$t('hint.err') : this.$t(`errCode.${ Math.abs(code) }`);
            if (code) {
                msg = `${ Math.abs(code) === 32002 ? errMsg : msg } (${ code })`;
            }
            toast(msg, type, position);
        };

        Vue.prototype.$confirm = confirm;

        Vue.prototype.$statistics = statistics;

        Vue.prototype.$wallet = wallet;

        // ----------filters

        Vue.filter('id2icon', function (value) {
            return getTokenIcon(value);
        });
    }
};
