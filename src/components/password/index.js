import Vue from 'vue';
import pwdComponent from './password.vue';

const PwdComponent = Vue.extend(pwdComponent);
let instance = new PwdComponent({
    el: document.createElement('div')
});

export default function({
    showMask = true,
    title, 
    singleBtn = false, 
    closeBtn = {
        show: false,
        click: () => {}
    },
    leftBtn = {
        text: '',
        click: () => {}
    }, 
    rightBtn = {
        text: '',
        click: () => {}
    },
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
    instance.singleBtn = singleBtn;
    instance.closeIcon = closeBtn.show;
    instance.close = ()=>{
        _close(closeBtn ? closeBtn.click : null);
    };
    instance.leftBtnTxt = leftBtn.text;
    instance.leftBtnClick = () => {
        _close(leftBtn ? leftBtn.click : null);
    };
    instance.rightBtnTxt = rightBtn.text;
    instance.rightBtnClick = () => {
        _close(rightBtn ? rightBtn.click : null);
    };
    instance.content = content || '';

    document.body.appendChild(instance.$el);
    return true;
}
