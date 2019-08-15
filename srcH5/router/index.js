import Vue from 'vue';
import VueRouter from 'vue-router';

import routeConfig from './routes';

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'dev' ? 'hash' : 'history',
    // mode: 'hash',
    routes: routeConfig.routes
});

router.beforeEach((to, from, next) => {
    console.log(to && to.name, from && from.name);
    next();
});

Vue.use(VueRouter);

export default router;
