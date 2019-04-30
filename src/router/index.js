import statistics from 'utils/statistics';
import { wallet } from 'utils/wallet';
import routeConfig from './routes';

const loginRoutes = ['walletConversion'];

export default function (VueRouter) {
    // Init router
    const router = new VueRouter({
        mode: process.env.NODE_ENV === 'dev' ? 'hash' : 'history',
        routes: routeConfig.routes
    });

    router.beforeEach((to, from, next) => {
        // Windows APP
        if (!to.name && to.path) {
            const arr = to.path.split('/');
            // [TODO] Recover trade: jump to trade ?
            router.replace({ name: arr[ arr.length - 1 ] || 'wallet' });
            return;
        }

        if (to.name && to.name.indexOf('start') !== -1 && to.name !== 'start') {
            router.replace({ name: 'start' });
            return;
        }

        const activeAcc = wallet.getActiveAccount();
        if (!activeAcc && to.name && to.name !== 'start') {
            router.replace({ name: 'start' });
            return;
        }

        // if (!from.name && to.name !== 'trade') {
        //     router.replace({ name: 'trade' });
        //     return;
        // }

        if (loginRoutes.indexOf(to.name) >= 0 && !wallet.isLogin) {
            (to.name !== 'start') && wallet.setLastPage(to.name);
            router.replace({ name: 'start' });
            return;
        }

        statistics.pageView(to.path);
        next();
    });

    return router;
}
