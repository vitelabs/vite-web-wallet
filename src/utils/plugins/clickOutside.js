const vnodes = new Set();

const isEventInDom = function (e, d) {
    const b = d.getBoundingClientRect();
    return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
};

export default {
    install(Vue) {
        document.addEventListener('click', (e) => {
            vnodes.forEach(v => {
                let funcName = '';
                let directives = v && v.data ? v.data.directives || [] : [];
                directives.forEach((d) => {
                    if (d.rawName === 'v-click-outside') {
                        funcName = d.expression || '';
                    }
                });

                if (!funcName) {
                    return;
                }

                let el = v ? v.elm || v.$el : null;
                if (el && !isEventInDom(e, el)) {
                    funcName && v.context && v.context[funcName](e);
                }
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
    }
};