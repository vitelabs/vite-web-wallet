// import '@babel/polyfill';
require('es6-promise').polyfill();

import 'utils/performance';
import './assets/scss/mixins.scss';

import Vue from 'vue';
Vue.config.devtools = true;
import VueRouter from 'vue-router';

import App from 'pages/index.vue';
import start from 'pages/start.vue';
import login from 'pages/login/index.vue';

import routes from 'routes/index';


import 'utils/eventEmitter.js';
import 'utils/viteWallet/index.js';

import store from './store';
import statistics from 'utils/statistics';
import { initPwdConfirm } from 'components/password/index.js';
import { initQuotaConfirm } from 'components/quota/index.js';


import plugin from 'utils/plugins/addPlugin';
import Wallet from 'utils/wallet/index.js';
const  wallet = new Wallet();
Vue.use(plugin,{wallet});
Vue.use(VueRouter);
import {i18n} from 'i18n';


document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
// Start loading animate
let element  = document.getElementById('loading');
element.className += 'spinner big-spinner';

setTimeout(() => {
    element.className += ' dis';
}, 800);
// Loading finish, app init finish also.
setTimeout(() => {    
    initPwdConfirm(i18n);
    
    wallet.reSave();
    let { Ledger } = viteWallet;
    Ledger.getDefaultTokenList();
    
    let list = wallet.getList();
    let rootRoute = {
        name: 'index',
        path: '/'
    };
    rootRoute.component = list && list.length ? login : start;
    routes.push(rootRoute);

    const router = new VueRouter({
        mode: process.env.NODE_ENV === 'dev' ? 'hash' : 'history',
        routes
    });

    router.beforeEach((to, from, next) => {
        // windows APP
        if (!to.name && to.path) {
            let arr = to.path.split('/');
            router.replace({
                name: arr[ arr.length - 1 ] || 'index'
            });
            return;
        }

        // if (process.env.NODE_ENV !== 'dev' && !from.name && to.name !== 'index') {
        if (!from.name && to.name !== 'index') {
            router.replace({
                name: 'index'
            });
            return;
        }

        statistics.pageView(to.path);
        next();
    });

    initQuotaConfirm(i18n, router);

    new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        store,
        router,
        i18n
    });
}, 1800);
