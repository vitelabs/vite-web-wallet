import Vue from 'vue';
import VueRouter from 'vue-router';

import routeConfig from './routes';

const router = new VueRouter({
    mode: 'hash',
    routes: routeConfig.routes
});

router.beforeEach((to, from, next) => {
    next();
});

Vue.use(VueRouter);

export default router;
