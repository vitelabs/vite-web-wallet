import { StatusMap, getCurrHDAcc, getActiveAcc } from 'wallet';
import { pwdConfirm } from 'components/password/index.js';

const vnodes = new Map();

const isEventInDom = function (e, d) {
    const b = d.getBoundingClientRect();
    return (
        e.clientX >= b.left
    && e.clientX <= b.right
    && e.clientY >= b.top
    && e.clientY <= b.bottom
    );
};

export default {
    install(Vue) {
    // add args for binds to support including user selfdefined elements;
        document.addEventListener('click', e => {
            vnodes.forEach((binding, key) => {
                const directives = key && key.data ? key.data.directives || [] : [];
                directives.forEach(d => {
                    if (d.name === 'click-outside') {
                        let includeEls = [];
                        if (binding.arg) {
                            includeEls = (binding.arg.includeEls || []).slice(0);
                        }
                        if (binding.modifiers && binding.modifiers.includeChildrens) {
                            const iter = document.createNodeIterator(key.elm,
                                NodeFilter.SHOW_ELEMENT,
                                null,
                                false);
                            let cur = null;
                            while ((cur = iter.nextNode())) {
                                includeEls.push(cur);
                            }
                        }
                        clickOutside(key, e, d.expression || '', includeEls);
                    }
                });
            });
        });

        Vue.directive('ClickOutside', {
            bind(el, binding, vnode) {
                vnodes.set(vnode, binding);
            },
            unbind(el, binding, vnode) {
                vnodes.delete(vnode);
            }
        });

        Vue.directive('UnlockAccount', {
            bind(el, binding, vnode) {
                el.addEventListener('click', e => {
                    const funcName = binding.expression || '';

                    const currHDACC = getCurrHDAcc();

                    if (currHDACC.status === StatusMap.UNLOCK) {
                        funcName && vnode.context && vnode.context[funcName](e);
                        vnode.data.on && vnode.data.on.unlocked && vnode.data.on.unlocked();
                        return;
                    }

                    const activeAccount = getActiveAcc();
                    if (activeAccount) {
                        pwdConfirm({ type: 'unlockAccount' });
                        return;
                    }

                    vnode.data.on
            && vnode.data.on.noactiveacc
            && vnode.data.on.noactiveacc();
                });
            },
            unbind() {
                // El, binding, vnode
                // vnode.removeEventListener();
            }
        });
    }
};

function clickOutside(v, e, funcName, includeEls = []) {
    if (!funcName) {
        return;
    }
    const el = v ? v.elm || v.$el : null;
    if (
        el
    && !isEventInDom(e, el)
    && includeEls.every(el => !isEventInDom(e, el))
    ) {
        funcName && v.context && v.context[funcName](e);
    }
}
