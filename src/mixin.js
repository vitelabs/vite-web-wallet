import Vue from 'vue';
import toast from 'components/toast/index.js';
import confirm from 'components/confirm/index.js';
import statistics from 'utils/statistics';

Vue.mixin({
    beforeCreate: function() {
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

        this.$toast = toast;
        this.$confirm = confirm;
        this.$statistics = statistics;
    },
    destroyed: function () {
        this.$offEnterKey();
    }
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
