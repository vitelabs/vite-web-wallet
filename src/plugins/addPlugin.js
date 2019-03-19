import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';
import { wallet } from 'utils/wallet';

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

export default {
    install(Vue) {
        Vue.prototype.$onKeyDown = function(_code, cb) {
            window.document.onkeydown = e => {
                e = e || window.event;
                let code = e.keyCode || e.which;
                if (!code || code !== _code) {
                    return;
                }
                cb && cb();
            };
        };

        Vue.prototype.$offKeyDown = function() {
            window.document.onkeydown = null;
        };

        Vue.prototype.$validAmount = (amount = '', decimals = 8) => {
            let limit = decimals >= 8 ? 8 : decimals;
            let decimalNum = decimals ? new RegExp(`^\\d+[.]\\d{1,${limit}}$`) : null;
            let num = new RegExp('^(\\d+)$');
            return num.test(amount) || ( decimalNum && decimalNum.test(amount) );
        };

        Vue.prototype.$trim = (msg = '') => {
            return msg.replace(/(^\s*)|(\s*$)/g, '');
        };

        Vue.prototype.$toast = function(mesage, err, type, position) {
            if (!err) {
                toast(mesage, type, position);
                return ;
            }

            let code  = err && err.error ? err.error.code || -1 : 
                err ? err.code : -1;
            
            let msg = code === -1 || !this.$i18n.messages.zh.errCode[Math.abs(code)] ? 
                mesage || this.$t('hint.err') : this.$t(`errCode.${Math.abs(code)}`);
            toast(msg, type, position);
        };

        Vue.prototype.$confirm = confirm;

        Vue.prototype.$statistics = statistics;

        Vue.prototype.$wallet = wallet;
    }
};
