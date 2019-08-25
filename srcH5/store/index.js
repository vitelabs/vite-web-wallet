import Vue from 'vue';
import vuex from 'vuex';

import env from './env';
import market from './market';
import account from './account';
import activeTxPair from './activeTxPair';

import fee from 'store/fee';
import limit from 'store/limit';
import rate from 'store/rate.js';
import tokens from 'store/tokens';
import depth from 'store/depth.js';
import balance from 'store/balance';
import activeTx from 'store/activeTx';
import latestOrder from 'store/latestOrder';
import dexFundUnreceived from 'store/dexFundUnreceived';
import currentOpenOrders from 'store/currentOpenOrders';
import tokenDecimalsLimit from 'store/tokenDecimalsLimit';

const exchange = {
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
    exchangeTokenDecimalsLimit: tokenDecimalsLimit,
    exchangeDexFundUnreceived: dexFundUnreceived
};

Vue.use(vuex);

const store = new vuex.Store();

for (const moduleName in exchange) {
    store.registerModule(moduleName, exchange[moduleName]);
}
store.registerModule('env', env);
store.registerModule('account', account);

store.dispatch('fetchDefaultTokenList');
store.dispatch('startLoopExchangeRate');
store.dispatch('startLoopExchangeBalance');
store.dispatch('exFetchLatestOrder');

export default store;
