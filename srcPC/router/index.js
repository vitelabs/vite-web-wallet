import Vue from 'vue';
import VueRouter from 'vue-router';

import i18n from 'pcI18n';
import store from 'pcStore';
import openUrl from 'utils/openUrl';
import statistics from 'utils/statistics';
import { getExplorerLink } from 'utils/getLink';
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
        router.replace({ name: arr[arr.length - 1] || 'tradeCenter' });
        return;
    }

    // Go to explorer.
    if (to.name === 'viteExplorer') {
        openUrl(getExplorerLink(i18n.locale));
        return;
    }
    if (to.name === 'viteScanExplorer') {
        openUrl('https://vitescan.io');
        return;
    }

    // CreateAccount only use in development.
    if (to.name === 'create') {
        if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev') {
            next();
            return;
        }
        router.replace({ name: 'notFound' });
        return;
    }
    const currHDAcc = getCurrHDAcc();
    if (
        !currHDAcc
        && to.name
        && [ 'bridgeMain', 'bridgeHistory' ].indexOf(to.name) !== -1
    ) {
        router.replace({ name: 'startLogin' });
        return;
    }
    // Init
    if (!from.name) {
        // Don't have currHDAcc and want to go start*** or trade***
        if (
            !currHDAcc
            && to.name
            && [ 'startLogin', 'tradeCenter' ].indexOf(to.name) === -1
        ) {
            router.replace({ name: 'startLogin' });
            return;
        }
    }

    // If want to go tradeTxPairManage, but not from tradeOperator or don't have from, use tradeOperator instead it.
    if (
        (!from.name || from.name !== 'tradeOperator')
        && to.name === 'tradeTxPairManage'
    ) {
        router.replace({ name: 'tradeOperator' });
        return;
    }

    // If want to go startLogin, and from isn't start***, record from.
    if (
        to.name
        && to.name === 'startLogin'
        && from.name
        && from.name.indexOf('start') === -1
    ) {
        store.commit('setLastPage', from.name);
    }

    // If must login, but not login, to startLogin.
    if (
        loginRoutes.indexOf(to.name) >= 0
        && currHDAcc.status === StatusMap.LOCK
    ) {
        router.replace({ name: 'startLogin' });
        return;
    }

    statistics.pageView(to.path);
    next();
});

Vue.use(VueRouter);

export default router;
