import Vue from 'vue';
import pwdComponent from './password.vue';

const PwdComponent = Vue.extend(pwdComponent);
let i18n;

export function initPwdConfirm(_i18n) {
    i18n = _i18n;
}

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
        i18n
    });

    const _close = cb => {
        try {
            document.body.removeChild(instance.$el);
        } catch (err) {
            console.warn(err);
        }
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

    document.body.appendChild(instance.$el);

    return true;
}
