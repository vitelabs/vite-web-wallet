import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';
import wallet from 'utils/wallet';

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
            beforeCreate: function () {
                this.$onEnterKey = (cb) => {
                    window.document.onkeydown = e => {
                        e = e || window.event;
                        let code = e.keyCode || e.which;
                        if (!code || code !== 13) {
                            return;
                        }
                        cb && cb();
                    };
                };
                this.$offEnterKey = () => {
                    window.document.onkeydown = null;
                };
            },
            destroyed: function () {
                this.$offEnterKey();
            }
        });


        Vue.prototype.$wallet = wallet;
        Vue.prototype.$validAmount = (amount = '') => {
            return /(^(\d+)$)|(^(\d+[.]\d{1,8})$)/g.test(amount);
        };
        Vue.prototype.$trim = (msg = '') => {
            return msg.replace(/(^\s*)|(\s*$)/g, '');
        };

        Vue.prototype.$toast = toast;
        Vue.prototype.$confirm = confirm;
        Vue.prototype.$statistics = statistics;
    }
};