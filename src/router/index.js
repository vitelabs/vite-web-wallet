import Vue from 'vue';
import VueRouter from 'vue-router';

import store from 'store';
import statistics from 'utils/statistics';
import { getCurrHDAcc, StatusMap } from 'wallet';
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
        router.replace({ name: arr[ arr.length - 1 ] || 'tradeCenter' });
        return;
    }

    const currHDAcc = getCurrHDAcc();

    // Init
    if (!from.name) {
        // To start***, but not start
        if (to.name && to.name.indexOf('start') !== -1 && to.name !== 'start') {
            router.replace({ name: 'start' });
            return;
        }

        // Don't have currHDAcc and want to go start*** or trade***
        if (!currHDAcc && to.name && [ 'start', 'tradeCenter' ].indexOf(to.name) === -1) {
            router.replace({ name: 'start' });
            return;
        }
    }

    if ((!from.name || from.name !== 'tradeOperator') && to.name === 'tradeTxPairManage') {
        router.replace({ name: 'tradeOperator' });
        return;
    }


    // If want to go start, and from isn't start***, record from.
    if (to.name && to.name === 'start' && from.name && from.name.indexOf('start') === -1) {
        store.commit('setLastPage', from.name);
    }

    // If must login, but not login, to start.
    if (loginRoutes.indexOf(to.name) >= 0 && currHDAcc.status === StatusMap.LOCK) {
        router.replace({ name: 'start' });
        return;
    }

    statistics.pageView(to.path);
    next();
});

Vue.use(VueRouter);

export default router;
