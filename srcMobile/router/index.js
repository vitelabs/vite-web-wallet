import Vue from 'vue';
import VueRouter from 'vue-router';

import routeConfig from './routes';

const router = new VueRouter({
    mode: process.env.NODE_ENV === 'dev' ? 'hash' : 'history',
    routes: routeConfig.routes
});

Vue.use(VueRouter);

export default router;
