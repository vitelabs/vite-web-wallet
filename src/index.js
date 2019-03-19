// import '@babel/polyfill';
require('es6-promise').polyfill();

import 'utils/performance';
import 'assets/scss/mixins.scss';
import 'utils/viteClient.js';

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import App from 'pages/index.vue';
import initRouter from 'router/index.js';

import i18nConf from 'i18n';
import store from './store';

import plugin from 'plugins/addPlugin';
import directives from 'plugins/directives';
import resaveAccKeystore from 'utils/resaveAccKeystore.js';

import { initPwdConfirm } from 'components/password/index.js';
import { initQuotaConfirm } from 'components/quota/index.js';

// $onKeyDown $offKeyDown $validAmount $trim $toast $confirm $statistics $wallet
Vue.use(plugin);
// v-click-outside v-unlock-account
Vue.use(directives);
Vue.use(VueRouter);
Vue.use(VueI18n);

const i18n = new VueI18n( i18nConf );

Vue.config.devtools = process.env.NODE_ENV !== 'production';

// Start loading animate
let element = document.getElementById('loading');
element.className += 'spinner big-spinner';

setTimeout(() => {
    element.className += ' dis';
}, 800);

// Loading finish and App init finish also.
setTimeout(() => {
    resaveAccKeystore();

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
