import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';
import { wallet } from 'utils/wallet';
import routeConfig from 'router/routes';

const loginRoutes = routeConfig.loginRoutes;

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
        Vue.mixin({
            created() {
                this.$router && this.$router.beforeEach((to, from, next) => {
                    if (loginRoutes.indexOf(to.name) >= 0 && !this.$wallet.isLogin) {
                        (to.name !== 'login') && this.$wallet.setLastPage(to.name);
                        this.$router.push({
                            name: 'start'
                        });
                    }
                    next();
                });
            },
            destroyed: function () {
                this.$offEnterKey();
            }
        });

        Vue.prototype.$onEnterKey = function(cb) {
            window.document.onkeydown = e => {
                e = e || window.event;
                let code = e.keyCode || e.which;
                if (!code || code !== 13) {
                    return;
                }
                cb && cb();
            };
        };

        Vue.prototype.$offEnterKey = function() {
            window.document.onkeydown = null;
        };

        Vue.prototype.$wallet = new wallet();

        Vue.prototype.$validAmount = (amount = '', decimals) => {
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
    }
};