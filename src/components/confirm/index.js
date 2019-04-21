import Vue from 'vue';
import confirmComponent from '../confirm.vue';

const Confirm = Vue.extend(confirmComponent);

export default function ({
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
    let instance = new Confirm({ el: document.createElement('div') });

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
    instance.title = title;
    instance.singleBtn = singleBtn;
    instance.closeIcon = closeBtn.show;
    instance.close = () => {
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

    appEl.appendChild(instance.$el);

    return true;
}
