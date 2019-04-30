
import Vue from 'vue';
import closeIcon from 'assets/imgs/confirm_close.svg';
import store from 'src/store';
import i18n from 'i18n';
const STATUS = {
    'CLOSE': 'CLOSE',
    'CANCEL': 'CANCEL',
    'CONFIRMED': 'CONFRIMED'
};
const getValue = function (key, defaultValue) {
    const dkey = `d${ key.slice(0, 1).toUpperCase() }${ key.slice(1) }`;
    if (this[key] !== undefined) return this[key];
    if (this[dkey] !== undefined) return this[dkey];
    return defaultValue;
};
const mixin = {
    store,
    i18n,
    props: {
        showMask: { },
        title: { },
        showClose: { },
        lTxt: { },
        rTxt: { },
        sTxt: { },
        btnUnuse: { },
        content: { },
        promise: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        Title() {
            console.log(this);
            return getValue.call(this, 'title', '');
        },
        ShowClose() {
            return getValue.call(this, 'showClose', true);
        },
        BtnUnuse() {
            return getValue.call(this, 'btnUnuse', false);
        },
        STxt() {
            return getValue.call(this, 'sTxt', '');
        },
        RTxt() {
            return getValue.call(this, 'rTxt', '');
        },
        LTxt() {
            return getValue.call(this, 'lTxt', '');
        },
        Content() {
            return getValue.call(this, 'content', '');
        },
        ShowMask() {
            return getValue.call(this, 'showMask', true);
        },
        ShowBottom() {
            return this.RTxt || this.LTxt || this.STxt;
        },
        s() {
            return {
                container: { 'background': this.ShowMask ? 'rgba(0, 0, 0, 0.6)' : '--', position: 'fixed', top: 0, bottom: 0, right: 0, left: 0, overflow: 'auto', display: 'flex', 'justify-content': 'center', 'align-items': 'center', 'z-index': 100 },
                wrapper: { width: '90%', 'max-width': '515px', 'max-height': '85%', display: 'flex', 'flex-direction': 'column', background: '#ffffff', 'box-shadow': '0 2px 48px 1px rgba(176, 192, 237, 0.42)', 'border-radius': '2px', 'padding-bottom': '30px' },
                title: { background: '#268eff', height: '60px', 'line-height': '60px', 'padding-left': '30px', 'font-size': '16px', color: '#ffffff' },
                close: { cursor: 'pointer', 'box-sizing': 'border-box', display: 'block', float: 'right', padding: '30px', width: '20px', height: '20px', background: `url(${ closeIcon })`, 'background-repeat': 'no-repeat', 'background-position': 'center', 'background-size': '20px 20px' },
                body: { position: 'relative', 'box-sizing': 'border-box', padding: '30px', overflow: 'auto', 'font-size': '18px', color: '#1d2024', 'line-height': '26px' },
                btnGroup: { padding: '0 30px', display: 'flex', 'height': '40px', 'box-sizing': 'border-box', 'justify-content': 'space-between' },
                lBtn: { 'margin-right': '20px' },
                btn: { cursor: 'pointer', 'flex-grow': 1, 'white-space': 'nowrap', color: '#ffffff', background: '#007AFF', 'display': 'flex', 'align-items': 'center', 'justify-content': 'center' },
                left: { border: '1px solid #007aff', 'border-radius': '2px', color: '#007aff', 'margin-right': '20px' },
                unUse: { background: '#efefef', color: '#666' }
            };
        }
    },
    methods: {
        rClick() {
            if (this.BtnUnuse) return;
            if (this.inspector) {
                this.inspector().then(data => {
                    this.promise.resolve({
                        status: STATUS.CONFIRMED,
                        data
                    });
                    const appEl = document.getElementById('vite-wallet-app');
                    appEl.removeChild(this.$el);
                    this.$destroy();
                });
            } else {
                this.promise.resolve({
                    status: STATUS.CONFIRMED,
                    data: null
                });
                const appEl = document.getElementById('vite-wallet-app');
                appEl.removeChild(this.$el);
                this.$destroy();
            }
        },
        lClick() {
            this.promise.reject({
                status: STATUS.CANCEL,
                data: null
            });
            const appEl = document.getElementById('vite-wallet-app');
            appEl.removeChild(this.$el);
            this.$destroy();
        },
        close() {
            this.promise.reject({
                status: STATUS.CLOSE,
                data: null
            });
            const appEl = document.getElementById('vite-wallet-app');
            appEl.removeChild(this.$el);

            this.$destroy();
        }
    }
};

export default function (component, propsDefault = {}) {
    return function dialog(props = {}) {
        const insert = function (props) {
            component.mixins = component.mixins || [];
            component.mixins.push(mixin);
            const ConfirmComponent = Vue.extend(component);
            const componentInstance = new ConfirmComponent({
                el: document.createElement('div'),
                propsData: props
            });
            const appEl = document.getElementById('vite-wallet-app');
            appEl.appendChild(componentInstance.$el);
            return componentInstance.$el;
        };
        return new Promise(function (resolve, reject) {
            insert({ ...propsDefault, ...props, promise: { resolve, reject } });
        });
    };
}

