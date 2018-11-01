import Vue from 'vue';
import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

export default function(wallet) {
    Vue.mixin({
        beforeCreate: function() {
            this.$wallet = wallet;
            
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
    
            this.$validAmount = (amount = '') => {
                return /(^(\d+)$)|(^(\d+[.]\d{1,8})$)/g.test(amount);
            };
            this.$trim = (msg = '') => {
                return msg.replace(/(^\s*)|(\s*$)/g,'');
            };

            this.$toast = toast;
            this.$confirm = confirm;

            this.$statistics = statistics;
        },
        destroyed: function () {
            this.$offEnterKey();
        }
    });
}
