import 'utils/performance';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueI18n from 'vue-i18n';

import './assets/scss/mixins.scss';

import App from 'pages/index.vue';
import start from 'pages/start.vue';
import login from 'pages/login/index.vue';

import routes from 'routes/index';
import i18nConfig from 'i18n';

import 'utils/eventEmitter.js';
import 'utils/viteWallet/index.js';

import store from './store';
import statistics from 'utils/statistics';

Vue.use(VueRouter);
Vue.use(VueI18n);

Vue.mixin({
    created: function() {
        this.$onEnterKey = (cb) => {
            window.document.onkeydown = e => {
                e = e || window.event;
                let code = e.keyCode || e.which;
                if (!code || code !== 13) {
                    return;
                }
                cb && cb();
            };
        };

        this.$offEnterKey = () => {
            window.document.onkeydown = null;      
        };
    },
    destroyed: function () {
        this.$offEnterKey();
    }
});

const i18n = new VueI18n(i18nConfig);

let rootRoute = {
    name: 'index',
    path: '/'
};

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
});
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

let { Wallet } = viteWallet;
let list = Wallet.getList();
rootRoute.component = list && list.length ? login : start;
routes.push(rootRoute);

const router = new VueRouter({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    if (!from.name && to.name !== 'index') {
        router.replace({
            name: 'index'
        });
        return;
    }

    statistics.pageView(to.path);
    next();
});

let element  = document.getElementById('loading');
element.className += 'spinner big-spinner';

setTimeout(() => {
    element.className += ' dis';
}, 800);

setTimeout(() => {
    // console.log(window.viteWalletStorage);
    new Vue({
        el: '#app',
        components: { App },
        template: '<App/>',
        store,
        router,
        i18n
    });
}, 1800);
