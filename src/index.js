import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import './assets/scss/mixins.scss';

import App from 'pages/index.vue';
import start from 'pages/start.vue';
import login from 'pages/login/index.vue';

import routes from 'routes/index';
import i18nConfig from 'i18n';

import 'utils/eventEmitter.js';
import './utils/viteWallet/index.js';

import store from './store';

Vue.use(VueRouter);
Vue.use(VueI18n);

const i18n = new VueI18n(i18nConfig);

let rootRoute = {
    name: 'index',
    path: '/'
};

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

let { Wallet } = viteWallet;
let list = Wallet.getList();
rootRoute.component = list && list.length ? login : start;
routes.push(rootRoute);

const router = new VueRouter({
    // mode: 'history',
    routes
});
// router.beforeEach((to, from, next) => {
//     // console.log(to.name);
//     // console.log(from.name);
//     if (!from.name && to.name !== 'index') {
//         router.replace({
//             name: 'index'
//         });
//         return;
//     }
//     next();
// });

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router,
    i18n
});
