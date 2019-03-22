import { wallet } from 'utils/wallet';

const vnodes = new Set();

const isEventInDom = function (e, d) {
    const b = d.getBoundingClientRect();

    return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
};

export default {
    install(Vue) {
        document.addEventListener('click', e => {
            vnodes.forEach(v => {
                const directives = v && v.data ? v.data.directives || [] : [];
                directives.forEach(d => {
                    if (d.rawName === 'v-click-outside') {
                        clickOutside(v, e, d.expression || '');
                    }
                });
            });
        });

        Vue.directive('ClickOutside', {
            bind(el, binding, vnode) {
                vnodes.add(vnode);
            },
            unbind(el, binding, vnode) {
                vnodes.delete(vnode);
            }
        });

        Vue.directive('UnlockAccount', {
            bind(el, binding, vnode) {
                el.addEventListener('click', e => {
                    const isLogin = unlockAccount(vnode, e, binding.expression || '');
                    if (!isLogin) {
                        return;
                    }
                    vnode.data.on && vnode.data.on.unlocked();
                });
            },
            unbind() {
                // El, binding, vnode
                // vnode.removeEventListener();
            }
        });
    }
};


function clickOutside(v, e, funcName) {
    if (!funcName) {
        return;
    }

    const el = v ? v.elm || v.$el : null;
    if (el && !isEventInDom(e, el)) {
        funcName && v.context && v.context[funcName](e);
    }
}

function unlockAccount(v, e, funcName) {
    if (wallet.isLogin) {
        funcName && v.context && v.context[funcName](e);

        return true;
    }

    const activeAccount = wallet.getActiveAccount();
    activeAccount && activeAccount.unlockAccount();

    return false;
}
