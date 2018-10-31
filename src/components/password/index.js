import Vue from 'vue';
import pwdComponent from './password.vue';

const PwdComponent = Vue.extend(pwdComponent);
let instance = new PwdComponent({
    el: document.createElement('div')
});

export default function({
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
        submit && submit(_close);
    };
    instance.content = content || '';

    document.body.appendChild(instance.$el);
    return true;
}
