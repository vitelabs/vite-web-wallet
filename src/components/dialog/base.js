
import Vue from 'vue';
import component from './base.vue';
import mixin from './mixin';

export const getDialog = function (component) {
    return function dialog({ content, showMask, title, sTxt, showClose, lTxt, rTxt }) {
        const insert = function (props) {
            component.mixins = component.mixins || [];
            component.mixins.push(mixin);
            const ConfirmComponent = Vue.extend(component);
            const componentInstance = new ConfirmComponent({
                el: document.createElement('div'),
                propsData: props
            });
            document.body.appendChild(componentInstance.$el);
            return componentInstance.$el;
        };
        return new Promise(function (resolve, reject) {
            debugger;
            const destory = () => {
                document.body.removeChild(instance);
            };
            const instance = insert({ content, showMask, title, sTxt, showClose, lTxt, rTxt, promise: { reject, resolve }, destory });
        });
    };
};
export const dialog = getDialog(component);
