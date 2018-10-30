import Vue from 'vue';
import confirmComponent from './confirm.vue';

const Confirm = Vue.extend(confirmComponent);
let instance = new Confirm({
    el: document.createElement('div')
});
document.body.appendChild(instance.$el);

export default function({
    title, 
    singleBtn = false, 
    closeBtn = {
        show: false,
        click: () => {}
    },
    leftBtn = {
        text: '',
        click: () => {}
    }, 
    rightBtn = {
        text: '',
        click: () => {}
    }
}) {
    instance.title = title;
    instance.singleBtn = singleBtn;
    instance.closeIcon = closeBtn.show;
    instance.close = closeBtn.click;
    instance.leftBtnTxt = leftBtn.text;
    instance.leftBtnClick = leftBtn.click;
    instance.rightBtnTxt = rightBtn.text;
    instance.rightBtnClick = rightBtn.click;

    // Vue.nextTick(() => {
    //     instance.show = true;
    //     setTimeout(() => {
    //         instance.show = false;
    //     }, toastDuration);
    // });
}
