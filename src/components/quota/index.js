import Vue from 'vue';
import quotaComponent from './quota.vue';

const QuotaComponent = Vue.extend(quotaComponent);
let instance;

export function initQuotaConfirm(i18n, router) {
    instance = new QuotaComponent({
        el: document.createElement('div'),
        i18n,
        router
    });
}

export function quotaConfirm({
    showMask = true,
    operate,
    cancel = () => {}
}) {
    const _close = cb => {
        try {
            document.body.removeChild(instance.$el);
        } catch (err) {
            console.warn(err);
        }
        cb && cb();
    };

    instance.showMask = showMask;
    instance.operate = operate;
    instance.cancel = () => {
        _close();
        cancel && cancel();
    };
    instance.submit = () => {
        _close();
    };

    document.body.appendChild(instance.$el);

    return true;
}
