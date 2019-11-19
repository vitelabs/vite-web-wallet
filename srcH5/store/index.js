import Vue from 'vue';
import vuex from 'vuex';

import commonStore from 'store/index';

import env from './env';
import bridge from './bridge';
import account from './account';

import market from './market';
import activeTxPair from './activeTxPair';
import favoriteTxPair from './favoriteTxPair';

const exchange = {
    ...commonStore,
    exchangeMarket: market,
    exchangeActiveTxPair: activeTxPair,
    favoriteTxPair
};

Vue.use(vuex);

const store = new vuex.Store();

for (const moduleName in exchange) {
    store.registerModule(moduleName, exchange[moduleName]);
}
store.registerModule('env', env);
store.registerModule('account', account);
store.registerModule('bridge', bridge);

store.commit('exSetDepthListLimit', 20);
store.dispatch('setBridgeVersion');
store.dispatch('fetchDefaultTokenList');
store.dispatch('startLoopExchangeRate');
store.dispatch('getMiningSettingInfo');

export default store;
