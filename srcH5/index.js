import '@babel/polyfill';
require('es6-promise').polyfill();
// import eruda from 'eruda';
// eruda.init();

import 'assets/scss/mixins.scss';
import 'h5Assets/scss/mixins.scss';
import 'h5Utils/avoidScroll';
import 'utils/performance';
import 'utils/dnsHostIp';
import 'utils/viteClient';
import 'h5Utils/envFromURL';
import { bridge } from 'h5Utils/bridge';
import statistics from 'utils/statistics';

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

bridge['app.language']().then(lang => {
    console.log('get lang', lang);
    i18n.locale = lang.startsWith('zh') ? 'zh' : 'en';
});

statistics.event('H5-Start');
new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router,
    i18n
});
