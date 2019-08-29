import '@babel/polyfill';
require('es6-promise').polyfill();

import 'assets/scss/mixins.scss';
import 'utils/performance';
import 'utils/viteClient';
import 'h5Utils/envFromURL';
import { bridge } from 'h5Utils/bridge';

import Vue from 'vue';

import App from 'h5Pages/index.vue';
import router from 'h5Router/index.js';

import i18n from 'h5I18n';
import store from 'h5Store';

import plugin from 'plugins/addPlugin';
import directives from 'plugins/directives';

// $onKeyDown $offKeyDown $trim $toast
Vue.use(plugin);
// V-click-outside
Vue.use(directives);

Vue.config.devtools = process.env.NODE_ENV !== 'production';

bridge['app.language'](lang => {
    i18n.locale = lang.startsWith('zh') ? 'zh' : 'en';
});

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router,
    i18n
});
