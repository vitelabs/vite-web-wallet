const vnodes = new Set();
const isEventInDom = function (e, d) {
    const b = d.getBoundingClientRect();
    return e.clientX >= b.left && e.clientX <= b.right && e.clientY >= b.bottom && e.clientY <= b.top;
};
function evalInContext(js, context) {
    //# Return the results of the in-line anonymous function we .call with the passed context
    return function () { return eval(js); }.call(context);
}
module.exports = {
    install(Vue) {
        document.addEventListener('click', (e) => {
            console.log(9999);
            vnodes.forEach(v => {
                console.log(10000);
                if (v.context.$el && !isEventInDom(e, v.context.$el)) {
                    const d = v.data.directives.find(v => {
                        return v.name === 'click-outside';
                    });
                    if (d) {
                        // with(v.context){
                        //     eval(d.expression);
                        // } //
                        evalInContext(d.expression,v.context);// todo how to eval in v.context????
                    }
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