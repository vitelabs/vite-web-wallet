import Vue from 'vue';
import i18n from 'pcI18n';
import powProcessComponent from './powProcess.vue';

const PowProcessComponent = Vue.extend(powProcessComponent);

export function powProcess({
    cancel = () => {},
    isShowCancel = true
}) {
    let powProcessInstance = new PowProcessComponent({
        el: document.createElement('div'),
        i18n
    });
    const appEl = document.getElementById('vite-wallet-app');

    const _close = cb => {
        try {
            appEl.removeChild(powProcessInstance.$el);
        } catch (err) {
            console.warn(err);
        }
        powProcessInstance.$destroy();
        powProcessInstance = null;
        cb && cb();
    };

    powProcessInstance.cancel = () => {
        cancel && cancel();
        _close();
    };
    powProcessInstance.isShowCancel = isShowCancel;
    appEl.appendChild(powProcessInstance.$el);

    powProcessInstance.startCount();
    return powProcessInstance;
}
