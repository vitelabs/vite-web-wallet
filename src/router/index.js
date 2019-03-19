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
            let arr = to.path.split('/');
            router.replace({
                name: arr[ arr.length - 1 ] || 'exchange'
            });
            return;
        }

        if (!from.name && to.name !== 'exchange') {
            router.replace({
                name: 'exchange'
            });
            return;
        }

        if (loginRoutes.indexOf(to.name) >= 0 && !wallet.isLogin) {
            (to.name !== 'start') && wallet.setLastPage(to.name);
            router.replace({
                name: 'start'
            });
            return;
        }

        statistics.pageView(to.path);
        next();
    });

    return router;
}

