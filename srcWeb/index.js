import '@babel/polyfill';
require('es6-promise').polyfill();

import 'assets/scss/mixins.scss';
import 'utils/performance';
import 'utils/viteClient.js';
import './wallet';

import Vue from 'vue';

import App from './pages/index.vue';
import router from './router/index.js';

import i18n from 'i18n';
import store from 'store';

import plugin from 'plugins/addPlugin';
import directives from 'plugins/directives';
import { resaveAccList, resaveLastAcc } from 'utils/store/resave';

resaveAccList();
resaveLastAcc();

// $onKeyDown $offKeyDown $trim $toast
Vue.use(plugin);
// V-click-outside
Vue.use(directives);

Vue.config.devtools = process.env.NODE_ENV !== 'production';

// Start loading animate
const element = document.getElementById('loading');
element.className += 'spinner big-spinner';

setTimeout(() => {
    element.className += ' dis';
}, 800);

// Loading finish and App init finish also.
setTimeout(() => {
    new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        store,
        router,
        i18n
    });
}, 1800);
