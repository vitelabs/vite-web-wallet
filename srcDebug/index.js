import '@babel/polyfill';
require('es6-promise').polyfill();

import 'assets/scss/mixins.scss';

import Vue from 'vue';
import i18n from 'pcI18n';
import store from 'pcStore';

import App from './pages/index.vue';

Vue.config.devtools = true;

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    i18n
});
