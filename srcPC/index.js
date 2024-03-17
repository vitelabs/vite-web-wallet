import '@assets/scss/mixins.scss';
import '@utils/performance';
import '@pc/utils/nodeApi';
import '@services/dnsHostIP';
import '@services/apiServer';
import './wallet';

import Vue from 'vue';

import App from '@pc/pages/index.vue';
import router from '@pc/router/index.js';

import i18n from '@pc/i18n';
import store from '@pc/store';

import plugin from '@plugins/addPlugin';
import directives from '@plugins/directives';
import { resaveAccList, resaveLastAcc } from '@pc/utils/store/resave';

// Add fortawesome
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faExclamationCircle,
    faInfoCircle,
    faLightbulb,
    faMoon,
    faArrowRightArrowLeft,
    faWallet,
    faUserNinja
} from '@fortawesome/free-solid-svg-icons';
import {
    faWindows,
    faApple,
    faAppStoreIos,
    faGooglePlay
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Switch from 'ant-design-vue/lib/switch';
import 'ant-design-vue/lib/switch/style/index.css'; // 或者 ant-design-vue/lib/button/style/css 加载 css 文件
import "./index.scss";
// Some init code for desktop app
import * as desktop from './utils/desktop';
Vue.use(Switch);

library.add(faExclamationCircle,
    faInfoCircle,
    faLightbulb,
    faMoon,
    faWindows,
    faApple,
    faAppStoreIos,
    faGooglePlay,
    faArrowRightArrowLeft,
    faWallet,
    faUserNinja);
Vue.component('font-awesome-icon', FontAwesomeIcon);

resaveAccList();
resaveLastAcc();

// $onKeyDown $offKeyDown $trim $toast
Vue.use(plugin);
// V-click-outside
Vue.use(directives);

// ----

// For desktop only
if (window.DESKTOP) {
    desktop.init();
    window.addEventListener('contextmenu',
        e => {
            e.preventDefault();
            window.desktopUtils.popupMenu();
        },
        false);
}

Vue.config.devtools = import.meta.env.DEV;

new Vue({
    el: '#app',
    components: { App },
    template: '<App/>',
    store,
    router,
    i18n
});
