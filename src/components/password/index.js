import Vue from 'vue';
import i18n from 'i18n';
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
        i18n
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
