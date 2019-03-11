// import '@babel/polyfill';
require('es6-promise').polyfill();

import 'utils/performance';
import './assets/scss/mixins.scss';

import 'utils/eventEmitter.js';
import 'utils/viteWallet/index.js';

import Vue from 'vue';
Vue.config.devtools = process.env.NODE_ENV === 'dev';
import VueRouter from 'vue-router';

import App from 'pages/index.vue';
import initRouter from 'router/index.js';

import { i18n } from 'i18n';
import store from './store';
import { initPwdConfirm } from 'components/password/index.js';
import { initQuotaConfirm } from 'components/quota/index.js';

import plugin from 'utils/plugins/addPlugin';
import clickOutside from 'utils/plugins/clickOutside';
import { reSave } from 'utils/wallet/index.js';

Vue.use(plugin);
Vue.use(VueRouter);
Vue.use(clickOutside);

// Start loading animate
let element = document.getElementById('loading');
element.className += 'spinner big-spinner';

setTimeout(() => {
    element.className += ' dis';
}, 800);

// Loading finish and App init finish also.
setTimeout(() => {
    reSave();

    const router = initRouter(VueRouter);

    initPwdConfirm(i18n);
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
