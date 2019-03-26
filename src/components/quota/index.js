import Vue from 'vue';
import quotaCancelComponent from './cancel.vue';
import quotaPowComponent from './pow.vue';

const QuotaCancelComponent = Vue.extend(quotaCancelComponent);
const QuotaPowComponent = Vue.extend(quotaPowComponent);
let cancelInstance;
let powInstance;

export function initQuotaConfirm(i18n, router) {
    cancelInstance = new QuotaCancelComponent({
        el: document.createElement('div'),
        i18n,
        router
    });
    powInstance = new QuotaPowComponent({
        el: document.createElement('div'),
        i18n,
        router
    });
}

export function quotaConfirm(pow = false, config) {
    if (!pow) {
        quotaConfirmCancel(config);
        return;
    }
    quotaConfirmPow(config);
}

function quotaConfirmCancel({
    showMask = true,
    operate
}) {
    cancelInstance.showMask = showMask;
    cancelInstance.operate = operate;
    cancelInstance.cancel = () => {
        _close(null, cancelInstance.$el);
    };
    cancelInstance.submit = () => {
        _close(null, cancelInstance.$el);
    };

    document.body.appendChild(cancelInstance.$el);
}


function quotaConfirmPow({
    showMask = true,
    closeBtnClick = () => {},
    rightBtnClick = () => {}
}) {
    powInstance.showMask = showMask;
    powInstance.leftBtnClick = () => {
        _close(null, powInstance.$el);
    };
    powInstance.closeBtnClick = () => {
        _close(null, powInstance.$el);
        closeBtnClick && closeBtnClick();
    };
    powInstance.rightBtnClick = () => {
        _close(null, powInstance.$el);
        rightBtnClick && rightBtnClick();
    };

    document.body.appendChild(powInstance.$el);
}

const _close = (cb, el) => {
    try {
        document.body.removeChild(el);
    } catch (err) {
        console.warn(err);
    }
    cb && cb();
};
