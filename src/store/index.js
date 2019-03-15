import vuex from 'vuex';
import Vue from 'vue';

import accountStore from './account';
import transListStore from './transList';
import pledgeStore from './pledge';
import SBPStore from './SBP';
import exchange from './exchange/index';

Vue.use(vuex);

const store = new vuex.Store();

store.registerModule('account', accountStore);
store.registerModule('transList', transListStore);
store.registerModule('pledge', pledgeStore);
store.registerModule('SBP', SBPStore);

for (let moduleName in exchange) {
    store.registerModule(moduleName, exchange[moduleName]);
}
store.dispatch('updateMarketMap');

export default store;
