// import '@babel/polyfill';
require('es6-promise').polyfill();

import 'utils/performance';
import './assets/scss/mixins.scss';

import Vue from 'vue';
import VueRouter from 'vue-router';

import App from 'pages/index.vue';
import routeConfig from 'routes';

import 'utils/eventEmitter.js';
import 'utils/viteWallet/index.js';

import { i18n } from 'i18n';
import store from './store';
import statistics from 'utils/statistics';
import { initPwdConfirm } from 'components/password/index.js';
import { initQuotaConfirm } from 'components/quota/index.js';

import plugin from 'utils/plugins/addPlugin';
import clickOutside from 'utils/plugins/clickOutside';
import { reSave } from 'utils/wallet/index.js';

Vue.use(plugin);
Vue.use(VueRouter);
Vue.use(clickOutside);

// Start loading animate
let element  = document.getElementById('loading');
element.className += 'spinner big-spinner';

setTimeout(() => {
    element.className += ' dis';
}, 800);

// Loading finish and App init finish also.
setTimeout(() => {
    reSave();

    // Init router
    const router = new VueRouter({
        mode: process.env.NODE_ENV === 'dev' ? 'hash' : 'history',
        routes: routeConfig.routes
    });
    router.beforeEach((to, from, next) => {
        // Windows APP
        if (!to.name && to.path) {
            let arr = to.path.split('/');
            router.replace({
                name: arr[ arr.length - 1 ] || 'index'
            });
            return;
        }

        if (!from.name && to.name !== 'index') {
            router.replace({
                name: 'index'
            });
            return;
        }

        statistics.pageView(to.path);
        next();
    });

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
