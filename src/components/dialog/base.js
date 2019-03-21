
import Vue from 'vue';
import component from './base.vue';

const insert = function (props) {
    let slot = props.slot || {};
    const ConfirmComponent = Vue.extend(component, {
        components: slot && { content: slot }
    });
    const componentInstance = new ConfirmComponent({
        el: document.createElement('div'),
        propsData: props,
        slots: {
            default: '<content></content>'
        }
    });
    document.body.appendChild(componentInstance.$el);
    return componentInstance;
};
const STATUS = {
    'CLOSE': 'CLOSE',
    'CANCEL': 'CANCEL',
    'CONFIRMED':'CONFRIMED'
};
export class Dialog extends Promise {
    constructor({ content, showMask, title, sTxt, showClose, lTxt, rTxt, slot}) {
        super(function (res, rej) {
            const close = () => {
                this.destory();
                rej(STATUS.CLOSE);
            };
            const lClick = () => {
                document.body.removeChild(this.instance.$el);
                rej(STATUS.CANCEL);
            };
            const rClick = () => {
                this.destory();
                res({status:STATUS.CONFIRMED});
            };
            this.instance = insert({ content, showMask, title, sTxt, showClose, lTxt, rTxt, slot, rClick, lClick, close });
        });


    }
    destory() {
        this.instance && document.body.removeChild(this.instance);
        this.instance = null;
    }
}