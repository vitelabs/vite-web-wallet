
// Import Vue from 'vue';
// import component from './confirm';

// Const insert = function (props) {
// let slot = props.slot || {};
// const ConfirmComponent = Vue.extend(component, {
// components: slot && { content: slot }
// });
// const componentInstance = new ConfirmComponent({
// el: document.createElement('div'),
// propsData: props,
// slots: {
// default: '<content></content>'
// }
// });
// document.body.appendChild(componentInstance.$el);
// return componentInstance;
// };
// const REJ_REASON = {
// 'CLOSE': 'CLOSE',
// 'CANCEL': 'CANCEL'
// };
// export class Confirm extends Promise {
// constructor({ content, showMask, title, sTxt, showClose, lTxt, rTxt, slot }) {
// super(function (res, rej) {
// const close = () => {
// this.destory();
// rej(REJ_REASON.CLOSE);
// };
// const lClick = () => {
// document.body.removeChild(this.instance.$el);
// rej();
// };
// const rClick = () => {
// this.destory();
// res();
// };
// });
// this.instance = insert({ content, showMask, title, sTxt, showClose, lTxt, rTxt, slot, rClick, lClick, close });

// }
// destory() {
// this.instance && document.body.removeChild(this.instance);
// this.instance = null;
// }
// }
