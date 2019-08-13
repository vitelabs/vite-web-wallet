import '@babel/polyfill';
require('es6-promise').polyfill();

import 'assets/scss/mixins.scss';
import 'utils/performance';
import 'utils/viteClient.js';

import Vue from 'vue';

import App from './pages/index.vue';
import router from './router/index.js';

import i18n from 'i18n';
import store from 'store';

import plugin from 'plugins/addPlugin';
import directives from 'plugins/directives';

// $onKeyDown $offKeyDown $trim $toast
Vue.use(plugin);
// V-click-outside
Vue.use(directives);

Vue.config.devtools = process.env.NODE_ENV !== 'production';

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router,
    i18n
});
