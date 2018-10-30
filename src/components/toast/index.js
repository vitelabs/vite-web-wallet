import Vue from 'vue';
import toastComponent from './toast.vue';

const Toast = Vue.extend(toastComponent);
let instance = new Toast({
    el: document.createElement('div')
});
document.body.appendChild(instance.$el);

const toastDuration = 2000;

export default function(message, type = 'info', position = 'top') {
    if (!message) {
        return;
    }
    if (instance.show) {
        return instance;
    }

    type = type || 'info';   // info / warning / error
    position = position || 'top';

    instance.type = type;
    instance.message = message;
    instance.position = position;

    Vue.nextTick(() => {
        instance.show = true;
        setTimeout(() => {
            instance.show = false;
        }, toastDuration);
    });
}
