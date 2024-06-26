import '@babel/polyfill';
require('es6-promise').polyfill();

import 'assets/scss/mixins.scss';

import Vue from 'vue';
import i18n from '@pc/i18n';
import store from '@pc/store';

import App from './pages/index.vue';

Vue.config.devtools = true;

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    i18n
});
