import Vue from 'vue';
import powProcessComponent from './powProcess.vue';

const PowProcessComponent = Vue.extend(powProcessComponent);
let powProcessInstance;

export function initPowProcess(i18n) {
    powProcessInstance = new PowProcessComponent({
        el: document.createElement('div'),
        i18n
    });
}

export function powProcess({
    accountBlock,
    startTime,
    difficulty,
    cancel = () => {},
    isShowCancel = false
}) {
    const _close = cb => {
        try {
            document.body.removeChild(powProcessInstance.$el);
        } catch (err) {
            console.warn(err);
        }
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
