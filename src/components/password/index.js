import Vue from 'vue';
import pwdComponent from './password.vue';

const PwdComponent = Vue.extend(pwdComponent);
let instance;

export function initPwdConfirm (i18n) {
    instance = new PwdComponent({
        el: document.createElement('div'),
        i18n
    });
}

export function pwdConfirm ({
    showMask = true,
    title, 
    cancel = () => {},
    submit = () => {},
    content = ''
}) {
    let _close = (cb) => {
        try {
            document.body.removeChild(instance.$el);
        } catch(err) {
            console.warn(err);
        }
        cb && cb();
    };
    
    instance.showMask = showMask;
    instance.title = title;
    instance.cancel = ()=>{
        _close();
        cancel && cancel();
    };
    instance.submit = () => {
        _close();
        submit && submit();
    };
    instance.content = content || '';
    
    document.body.appendChild(instance.$el);
    return true;
}
