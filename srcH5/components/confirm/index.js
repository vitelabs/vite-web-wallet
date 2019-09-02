import Vue from 'vue';
import confirmComponent from './confirm.vue';

const Confirm = Vue.extend(confirmComponent);

export default function ({
    size,
    type = '',
    showMask = true,
    title,
    content = '',
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
    }
}) {
    const el = document.createElement('div');
    el.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, false);

    let instance = new Confirm({ el });

    const appEl = document.body;
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
    instance.type = type || '';
    instance.size = size || '';
    instance.title = title;
    instance.content = content;
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

    appEl.appendChild(instance.$el);

    return true;
}
