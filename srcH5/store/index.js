import Vue from 'vue';
import vuex from 'vuex';

import env from './env';
import account from './account';

import market from './market';
import activeTxPair from './activeTxPair';
import fee from 'store/fee';
import limit from 'store/limit';
import mine from 'store/mine.js';
import rate from 'store/rate.js';
import tokens from 'store/tokens';
import depth from 'store/depth.js';
import balance from 'store/balance';
import activeTx from 'store/activeTx';
import latestOrder from 'store/latestOrder';
import dexFundUnreceived from 'store/dexFundUnreceived';
import currentOpenOrders from 'store/currentOpenOrders';
import activeTxPairGetters from 'store/activeTxPairGetters';

const exchange = {
    exchangeMine: mine,
    exchangeRate: rate,
    exchangeDepth: depth,
    exchangeActiveTx: activeTx,
    exchangeActiveTxPair: activeTxPair,
    exchangeBalance: balance,
    exchangeMarket: market,
    exchangeTokens: tokens,
    exchangeCurrentOpenOrders: currentOpenOrders,
    exchangeLimit: limit,
    exchangeFee: fee,
    exchangeLatestOrder: latestOrder,
    exchangeActiveTxPairGetters: activeTxPairGetters,
    exchangeDexFundUnreceived: dexFundUnreceived
};

Vue.use(vuex);

const store = new vuex.Store();

for (const moduleName in exchange) {
    store.registerModule(moduleName, exchange[moduleName]);
}
store.registerModule('env', env);
store.registerModule('account', account);

store.commit('exSetDepthListLimit', 20);
store.dispatch('fetchDefaultTokenList');
store.dispatch('startLoopExchangeRate');

export default store;
