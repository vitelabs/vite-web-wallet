import Vue from 'vue';
import closeIcon from 'assets/imgs/confirm_close.svg';
import store from 'pcStore';
import i18n from 'pcI18n';

const STATUS = {
    'CLOSE': 'CLOSE',
    'CANCEL': 'CANCEL',
    'CONFIRMED': 'CONFRIMED'
};
const widthMap = {
    narrow: '380px',
    normal: '515px',
    wide: '681px'
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
            const theme = this[`theme${ this.$store.state.env.theme || 0 }`];
            const baseTheme = {
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
                    width: widthMap[this.Width],
                    'max-height': '85%',
                    display: 'flex',
                    'flex-direction': 'column',
                    'border-radius': '2px',
                    ...theme.wrapper
                },
                title: {
                    'font-size': '14px',
                    height: '50px',
                    'line-height': '50px',
                    'padding': '0 30px',
                    'font-family': 'PingFangSC-Semibold, arial, sans-serif',
                    color: '#ffffff',
                    ...theme.title
                },
                close: {
                    cursor: 'pointer',
                    'box-sizing': 'border-box',
                    display: 'block',
                    float: 'right',
                    padding: '25px 0',
                    width: '20px',
                    height: '20px',
                    background: `url(${ closeIcon })`,
                    'background-repeat': 'no-repeat',
                    'background-position': 'center',
                    'background-size': '20px 20px'
                },
                body: {
                    display: 'flex',
                    'flex-direction': 'column',
                    flex: 1,
                    position: 'relative',
                    'box-sizing': 'border-box',
                    padding: '30px',
                    overflow: 'auto',
                    'font-size': '14px',
                    'line-height': '18px',
                    ...theme.body
                },
                btnGroup: {
                    'font-family': 'PingFangSC-Semibold, arial, sans-serif',
                    padding: '0 30px',
                    display: 'flex',
                    'min-height': '40px',
                    'height': '40px',
                    'box-sizing': 'border-box',
                    'justify-content': 'space-between',
                    'margin-bottom': '30px',
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
                unUse: { color: '#fff' }
            };
            return baseTheme;
        },
        theme0() {
            return {
                wrapper: {
                    background: '#ffffff',
                    'box-shadow': '0 2px 48px 1px rgba(176, 192, 237, 0.42)'
                },
                title: { background: '#4B74FF' },
                body: { color: 'rgba(29,32,36,1)' },
                unUse: { background: 'rgba(191,191,191,1)' }
            };
        },
        theme1() {
            return {
                wrapper: { background: '#151C32' },
                title: { background: '#0F162D' },
                body: { color: '#fff' },
                unUse: { background: '#545F75' }
            };
        }
    },
    methods: {
        __close() {
            try {
                const appEl = document.getElementById('vite-wallet-app');
                appEl.removeChild(this.$el);
            } catch (err) {
                console.warn(err);
            }

            this.$destroy();
        },
        rClick() {
            if (this.BtnUnuse) return;
            if (this.inspector) {
                this.inspector().then(data => {
                    this.promise.resolve({
                        status: STATUS.CONFIRMED,
                        data
                    });
                    this.__close();
                });
            } else {
                this.promise.resolve({
                    status: STATUS.CONFIRMED,
                    data: null
                });
                this.__close();
            }
        },
        lClick() {
            this.promise.reject({
                status: STATUS.CANCEL,
                data: null
            });
            this.__close();
        },
        close() {
            this.promise.reject({
                status: STATUS.CLOSE,
                data: null
            });
            this.__close();
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
