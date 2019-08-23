import Vue from 'vue';
import store from 'h5Store';
import i18n from 'h5I18n';

export function insertTo(component, propsDefault = {}, ele) {
    const vueComp = Vue.extend(component);
    const componentInstance = new vueComp({
        el: document.createElement('div'),
        propsData: propsDefault,
        store,
        i18n
    });
    const appEl = ele || document.getElementById('vite-wallet-app');
    appEl.appendChild(componentInstance.$el);
    const remove = () => {
        componentInstance.$el && appEl.removeChild(componentInstance.$el);
        componentInstance.$destroy();
    };
    componentInstance.destroyInstance = remove;
    return componentInstance;
}
