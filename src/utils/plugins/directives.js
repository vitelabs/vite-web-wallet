import { wallet } from 'utils/walletInstance';

const vnodes = new Set();

const isEventInDom = function (e, d) {
    const b = d.getBoundingClientRect();
    return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
};

export default {
    install(Vue) {
        document.addEventListener('click', (e) => {
            console.log(e.target);
            vnodes.forEach(v => {
                let directives = v && v.data ? v.data.directives || [] : [];
                directives.forEach((d) => {
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
                console.log(binding);
                el.addEventListener('click', (e) => {

                    unlockAccount(vnode, e, binding.expression || '');
                });
            },
            unbind() {
                // el, binding, vnode
                // vnode.removeEventListener();
            }
        });
    }
};


function clickOutside(v, e, funcName) {
    if (!funcName) {
        return;
    }

    let el = v ? v.elm || v.$el : null;
    if (el && !isEventInDom(e, el)) {
        funcName && v.context && v.context[funcName](e);
    }
}

function unlockAccount(v, e, funcName) {
    if (wallet.isLogin) {
        funcName && v.context && v.context[funcName](e);
        return;
    }

    let activeAccount = wallet.getActiveAccount();
    activeAccount && activeAccount.unlockAccount();
}