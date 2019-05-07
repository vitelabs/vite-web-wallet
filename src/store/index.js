import Vue from 'vue';
import vuex from 'vuex';

import accountStore from './account';
import transListStore from './transList';
import pledgeStore from './pledge';
import SBPStore from './SBP';
import ledgerStore from './ledger';
import envVariableStore from './envVariable';
import exchange from './exchange/index';
import gateInfo from './gateInfo';
import activeAccountStore from './activeAccount';

Vue.use(vuex);

const store = new vuex.Store();

store.registerModule('activeAccount', activeAccountStore);
store.registerModule('account', accountStore);
store.registerModule('transList', transListStore);
store.registerModule('pledge', pledgeStore);
store.registerModule('SBP', SBPStore);
store.registerModule('ledger', ledgerStore);
store.registerModule('env', envVariableStore);
store.registerModule('gateInfo', gateInfo);

for (const moduleName in exchange) {
    store.registerModule(moduleName, exchange[moduleName]);
}

store.dispatch('onNetStatus');
store.dispatch('updateMarketMap');
store.dispatch('startLoopHeight');
store.dispatch('getDefaultTokenList');
store.dispatch('getAllTokens');
store.dispatch('updateGateInfos');

export default store;
