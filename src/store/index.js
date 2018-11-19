import vuex from 'vuex';
import Vue from 'vue';

import accountStore from './account.js';
import transListStore from './transList';
import pledgeStore from './pledge';
import SBPStore from './SBP';

Vue.use(vuex);

const store = new vuex.Store();

store.registerModule('account', accountStore);
store.registerModule('transList', transListStore);
store.registerModule('pledge', pledgeStore);
store.registerModule('SBP', SBPStore);

export default store;
