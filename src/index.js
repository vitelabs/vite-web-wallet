// Import '@babel/polyfill';
require('es6-promise').polyfill();

import 'utils/performance';
import 'assets/scss/mixins.scss';
import 'utils/viteClient.js';
import 'utils/wallet';

import Vue from 'vue';

import App from 'pages/index.vue';
import router from 'router/index.js';

import i18n from 'i18n';
import store from './store';

import plugin from 'plugins/addPlugin';
import directives from 'plugins/directives';
import resaveAccKeystore from 'utils/resaveAccKeystore.js';

// $onKeyDown $offKeyDown $validAmount $trim $toast $confirm $statistics $wallet
Vue.use(plugin);
// V-click-outside v-unlock-account
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
    resaveAccKeystore();

    new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        store,
        router,
        i18n
    });
}, 1800);
