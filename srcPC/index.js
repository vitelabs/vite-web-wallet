import '@babel/polyfill';
require('es6-promise').polyfill();

import 'assets/scss/mixins.scss';
import 'utils/performance';
import 'services/dnsHostIP';
import 'services/apiServer';
import './wallet';

import Vue from 'vue';

import App from 'pcPages/index.vue';
import router from 'pcRouter/index.js';

import i18n from 'pcI18n';
import store from 'pcStore';

import plugin from 'plugins/addPlugin';
import directives from 'plugins/directives';
import { resaveAccList, resaveLastAcc } from 'pcUtils/store/resave';

resaveAccList();
resaveLastAcc();

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
