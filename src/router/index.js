import Vue from 'vue';
import VueRouter from 'vue-router';

import statistics from 'utils/statistics';
import { wallet } from 'utils/wallet';
import routeConfig from './routes';

const loginRoutes = ['walletConversion'];

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'dev' ? 'hash' : 'history',
    routes: routeConfig.routes
});

router.beforeEach((to, from, next) => {
    // Windows APP
    if (!to.name && to.path) {
        const arr = to.path.split('/');
        router.replace({ name: arr[ arr.length - 1 ] || 'trade' });
        return;
    }

    // Init
    if (!from.name) {
        // To start***, but not start
        if (to.name && to.name.indexOf('start') !== -1 && to.name !== 'start') {
            router.replace({ name: 'start' });
            return;
        }

        const activeAcc = wallet.getActiveAccount();
        // Don't have activeAccount and want to go start*** or trade***
        if (!activeAcc && to.name && [ 'start', 'trade' ].indexOf(to.name) === -1) {
            router.replace({ name: 'start' });
            return;
        }
    }

    // If want to go start, and from isn't start***, record from.
    if (to.name && to.name === 'start' && from.name && from.name.indexOf('start') === -1) {
        wallet.setLastPage(from.name);
    }

    // If must login, but not login, to start.
    if (loginRoutes.indexOf(to.name) >= 0 && !wallet.isLogin) {
        router.replace({ name: 'start' });
        return;
    }

    statistics.pageView(to.path);
    next();
});

Vue.use(VueRouter);

export default router;
