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
    operate,
    cancel = () => {},
    submit = () => {}
}) {
    const _close = cb => {
        try {
            document.body.removeChild(cancelInstance.$el);
        } catch (err) {
            console.warn(err);
        }
        cb && cb();
    };

    cancelInstance.showMask = showMask;
    cancelInstance.operate = operate;
    cancelInstance.cancel = () => {
        _close();
        cancel && cancel();
    };
    cancelInstance.submit = () => {
        _close();
        submit && submit();
    };

    document.body.appendChild(cancelInstance.$el);

    return true;
}


function quotaConfirmPow({
    showMask = true,
    closeBtnClick = () => {},
    rightBtnClick = () => {}
}) {
    const _close = cb => {
        try {
            document.body.removeChild(powInstance.$el);
        } catch (err) {
            console.warn(err);
        }
        cb && cb();
    };

    powInstance.showMask = showMask;
    powInstance.leftBtnClick = () => {
        _close();
    };
    powInstance.closeBtnClick = () => {
        _close();
        closeBtnClick && closeBtnClick();
    };
    powInstance.rightBtnClick = () => {
        _close();
        rightBtnClick && rightBtnClick();
    };

    document.body.appendChild(powInstance.$el);
}
