import Vue from 'vue';
import i18n from 'i18n';
import powProcessComponent from './powProcess.vue';

const PowProcessComponent = Vue.extend(powProcessComponent);

export function powProcess({
    accountBlock,
    startTime,
    difficulty,
    cancel = () => {},
    isShowCancel = false
}) {
    let powProcessInstance = new PowProcessComponent({
        el: document.createElement('div'),
        i18n
    });

    const _close = cb => {
        try {
            document.body.removeChild(powProcessInstance.$el);
        } catch (err) {
            console.warn(err);
        }
        powProcessInstance = null;
        cb && cb();
    };

    powProcessInstance.cancel = () => {
        cancel && cancel();
        _close();
    };
    powProcessInstance.isShowCancel = isShowCancel;
    document.body.appendChild(powProcessInstance.$el);

    return powProcessInstance.startPowTx(accountBlock, startTime, difficulty);
}
