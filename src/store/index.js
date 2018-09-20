import vuex from 'vuex';
import Vue from 'vue';
import accountStore from './account.js';
Vue.use(vuex);
const store = new vuex.Store();
store.registerModule('account', accountStore);
export default store;

