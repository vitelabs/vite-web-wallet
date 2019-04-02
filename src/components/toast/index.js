import Vue from 'vue';
import toastComponent from './toast.vue';

const Toast = Vue.extend(toastComponent);
let instance;

const toastDuration = 2000;

export default function (message, duration = toastDuration, type = 'info', position = 'top') {
    if (!message) {
        return;
    }

    if (instance && instance.show) {
        return instance;
    }

    if (!instance) {
        instance = new Toast({ el: document.createElement('div') });
        const appEl = document.getElementById('vite-wallet-app');
        appEl.appendChild(instance.$el);
    }

    // Info / warning / error
    type = type || 'info';
    position = position || 'top';

    instance.type = type;
    instance.message = message;
    instance.position = position;

    Vue.nextTick(() => {
        instance.show = true;
        setTimeout(() => {
            instance.show = false;
        }, duration);
    });
}
