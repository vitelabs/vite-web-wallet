import Vue from 'vue';
import VueRouter from 'vue-router';
import statistics from 'utils/statistics';

import routeConfig from './routes';

const router = new VueRouter({
    mode: 'hash',
    routes: routeConfig.routes
});

router.beforeEach((to, from, next) => {
    statistics.pageView(`H5${ to.path }`);
    next();
});

Vue.use(VueRouter);

export default router;
