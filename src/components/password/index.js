import Vue from 'vue';
import i18n from 'pcI18n';
import store from 'store';
import { constant } from 'utils/store';
import pwdComponent from './password.vue';

const PwdComponent = Vue.extend(pwdComponent);

export function pwdConfirm({
    type = 'normal',
    showMask = true,
    title,
    cancel = () => { },
    submit = () => { },
    content = '',
    cancelTxt,
    submitTxt,
    exchange = false
}, isShowPWD = true) {
    let instance = new PwdComponent({
        el: document.createElement('div'),
        i18n,
        store
    });

    const appEl = document.getElementById('vite-wallet-app');
    const _close = cb => {
        try {
            appEl.removeChild(instance.$el);
        } catch (err) {
            console.warn(err);
        }
        instance.$destroy();
        instance = null;
        cb && cb();
    };

    instance.showMask = showMask;
    instance.isShowPWD = isShowPWD;
    instance.title = title;
    instance.exchange = exchange;
    instance.type = type;

    instance.cancel = () => {
        _close();
        cancel && cancel();
    };
    instance.submit = () => {
        _close();
        submit && submit();
    };

    instance.content = content || '';
    instance.cancelTxt = cancelTxt || '';
    instance.submitTxt = submitTxt || '';

    appEl.appendChild(instance.$el);

    return true;
}

export function initPwd({
    showMask = true,
    title,
    submit = () => {},
    cancel = () => {},
    content = '',
    submitTxt = '',
    cancelTxt = '',
    exchange = false
}, isConfirm = false) {
    const currHDAcc = store.state.wallet.currHDAcc;
    const accInfo = currHDAcc ? currHDAcc.getAccInfo() : null;
    const isHoldPWD = accInfo ? !!accInfo[constant.HoldPwdKey] : false;
    const isHide = (!isConfirm && isHoldPWD) || currHDAcc.isBifrost;

    if (isHide) {
        submit && submit();
        return true;
    }

    pwdConfirm({ showMask, title, submit, content, cancel, cancelTxt, submitTxt, exchange }, !isHoldPWD);
    return false;
}
