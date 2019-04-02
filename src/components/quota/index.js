import Vue from 'vue';
import i18n from 'i18n';
import quotaCancelComponent from './cancel.vue';

const QuotaCancelComponent = Vue.extend(quotaCancelComponent);
let cancelInstance;

export function initQuotaConfirm(router) {
    cancelInstance = new QuotaCancelComponent({
        el: document.createElement('div'),
        i18n,
        router
    });
}

export function quotaConfirm({
    showMask = true,
    operate
}) {
    cancelInstance.showMask = showMask;
    cancelInstance.operate = operate;
    cancelInstance.cancel = () => {
        _close(null, cancelInstance.$el);
    };
    cancelInstance.submit = () => {
        _close(null, cancelInstance.$el);
    };

    const appEl = document.getElementById('vite-wallet-app');
    appEl.appendChild(cancelInstance.$el);
}

const _close = (cb, el) => {
    try {
        const appEl = document.getElementById('vite-wallet-app');
        appEl.removeChild(el);
    } catch (err) {
        console.warn(err);
    }
    cb && cb();
};
