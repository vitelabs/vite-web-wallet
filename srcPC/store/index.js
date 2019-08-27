import Vue from 'vue';
import vuex from 'vuex';

import accountStore from './account';
import transListStore from './transList';
import pledgeStore from './pledge';
import SBPStore from './SBP';
import ledgerStore from './ledger';
import envVariableStore from './envVariable';
import gateInfo from './gateInfo';
import walletStore from './wallet';
import uiConfig from './uiConfig';
import exchange from './exchange/index';

Vue.use(vuex);

const store = new vuex.Store();

store.registerModule('wallet', walletStore);
store.registerModule('account', accountStore);
store.registerModule('transList', transListStore);
store.registerModule('pledge', pledgeStore);
store.registerModule('SBP', SBPStore);
store.registerModule('ledger', ledgerStore);
store.registerModule('env', envVariableStore);
store.registerModule('gateInfo', gateInfo);
store.registerModule('uiConfig', uiConfig);

for (const moduleName in exchange) {
    store.registerModule(moduleName, exchange[moduleName]);
}

store.dispatch('onNetStatus');
store.dispatch('updateMarketMap');
store.dispatch('getMarketsClosed');
store.dispatch('getDefaultTokenList');
store.dispatch('getAllTokens');
store.dispatch('updateGateInfos');
store.dispatch('fetchTokenInfoFromGithub');
store.dispatch('exFetchLimitAmounts');
store.dispatch('fetchUiConfig');

export default store;
