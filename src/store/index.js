import vuex from 'vuex';
import Vue from 'vue';
import accountStore from './account.js';
import transListStore from './transList';

Vue.use(vuex);

const store = new vuex.Store();

store.registerModule('account', accountStore);
store.registerModule('transList', transListStore);

store.dispatch('getDefaultTokenList');

export default store;
