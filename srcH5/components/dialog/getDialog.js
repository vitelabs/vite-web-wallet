import Vue from 'vue';
import closeIcon from 'h5Assets/imgs/confirm_close.svg';
import store from 'h5Store';
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
    i18n,
    props: {
        width: {}, // wide narrow normal
        showMask: {},
        title: {},
        showClose: {},
        lTxt: {},
        rTxt: {},
        sTxt: {},
        btnUnuse: {},
        content: {},
        promise: {
            type: Object,
            default: () => null
        }
    },
    computed: {
        Width() {
            return getValue.call(this, 'width', 'normal');
        },
        Title() {
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
                container: {
                    'background': this.ShowMask ? 'rgba(0, 0, 0, 0.4)' : '--',
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    overflow: 'auto',
                    display: 'flex',
                    'justify-content': 'center',
                    'align-items': 'center',
                    'z-index': 100
                },
                wrapper: {
                    width: '85%',
                    'max-width': '270px',
                    'max-height': '85%',
                    display: 'flex',
                    'flex-direction': 'column',
                    background: '#ffffff',
                    'border-radius': '2px'
                },
                title: {
                    'font-size': '14px',
                    height: '50px',
                    'line-height': '50px',
                    'text-align': 'center',
                    'padding': '0 16px',
                    color: 'rgba(36,39,43,1)',
                    'font-family': 'PingFangSC, arial, sans-serif',
                    'font-weight': '600'
                },
                close: {
                    cursor: 'pointer',
                    'box-sizing': 'border-box',
                    display: 'block',
                    float: 'right',
                    padding: '25px 0',
                    width: '18px',
                    height: '18px',
                    background: `url(${ closeIcon })`,
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': '18px 18px'
                },
                body: {
                    display: 'flex',
                    'flex-direction': 'column',
                    flex: 1,
                    position: 'relative',
                    'box-sizing': 'border-box',
                    padding: '0 16px 20px',
                    overflow: 'auto',
                    'font-size': '14px',
                    color: 'rgba(29,32,36,1)',
                    'line-height': '18px'
                },
                btnGroup: {
                    'font-family': 'PingFangSC, arial, sans-serif',
                    'font-weight': 600,
                    padding: '0 16px',
                    display: 'flex',
                    'min-height': '40px',
                    'height': '40px',
                    'box-sizing': 'border-box',
                    'justify-content': 'space-between',
                    'margin-bottom': '20px',
                    'font-size': '14px'
                },
                lBtn: { 'margin-right': '20px' },
                btn: {
                    cursor: 'pointer',
                    'flex-grow': 1,
                    'white-space': 'nowrap',
                    color: '#ffffff',
                    background: '#007AFF',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center'
                },
                left: {
                    border: '1px solid rgba(0,122,255,1)',
                    'border-radius': '2px',
                    color: '#007aff',
                    'margin-right': '20px'
                },
                unUse: {
                    background: '#efefef',
                    color: '#666'
                }
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
        let instance = null;
        const insert = function (props) {
            component.mixins = component.mixins || [];
            component.mixins.push(mixin);
            const ConfirmComponent = Vue.extend(component);
            const componentInstance = new ConfirmComponent({
                el: document.createElement('div'),
                propsData: props,
                store
            });
            instance = componentInstance;
            const appEl = document.getElementById('vite-wallet-app');
            appEl.appendChild(componentInstance.$el);
            return componentInstance.$el;
        };
        const p = new Promise(function (resolve, reject) {
            insert({
                ...propsDefault,
                ...props,
                promise: {
                    resolve,
                    reject
                }
            });
        });
        p.compInstance = instance;
        return p;
    };
}
