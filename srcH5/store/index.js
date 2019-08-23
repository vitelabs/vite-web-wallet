import Vue from 'vue';
import vuex from 'vuex';

import env from './env';
import account from './account';
import activeTxPair from './activeTxPair';
import ledger from 'store/ledger';
import balance from 'store/exchange/balance';
import dexFundUnreceived from 'store/exchange/dexFundUnreceived';
import fee from 'store/exchange/fee';
import currentOpenOrders from 'store/exchange/currentOpenOrders';
import latestOrder from 'store/exchange/latestOrder';
import activeTx from 'store/exchange/activeTx';
import rate from 'store/exchange/rate.js';
import depth from 'store/exchange/depth.js';
import market from './market';
import tokens from 'store/exchange/tokens';
import tokenDecimalsLimit from 'store/exchange/tokenDecimalsLimit';
import limit from 'store/exchange/limit';

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
store.registerModule('ledger', ledger);

store.dispatch('startLoopExchangeBalance');

export default store;
