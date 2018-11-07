const vnodes = new Set();
const isEventInDom = function (e, d) {
    const b = d.getBoundingClientRect();
    return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.top && e.clientY <= b.bottom;
};
export default {
    install(Vue) {
        document.addEventListener('click', (e) => {
            vnodes.forEach(v => {
                if (v.$el && !isEventInDom(e, v.$el)) {
                    v.$emit('clickoutside',e);
                }

            });
        });
        Vue.directive('ClickOutside', {
            bind(el, binding, vnode) {
                vnodes.add(vnode.componentInstance);
            },
            unbind(el, binding, vnode) {
                vnodes.delete(vnode.componentInstance);
            }
        });
    }
};