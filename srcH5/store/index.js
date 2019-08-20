import Vue from 'vue';
import vuex from 'vuex';

import rate from 'store/exchange/rate.js';
import depth from 'store/exchange/depth.js';
import activeTxPair from 'store/exchange/activeTxPair';
import activeTx from 'store/exchange/activeTx';
import balance from 'store/exchange/balance';
import tokens from 'store/exchange/tokens';
import currentOpenOrders from 'store/exchange/currentOpenOrders';
import limit from 'store/exchange/limit';
import fee from 'store/exchange/fee';
import latestOrder from 'store/exchange/latestOrder';
import tokenDecimalsLimit from 'store/exchange/tokenDecimalsLimit';
import dexFundUnreceived from 'store/exchange/dexFundUnreceived';
import market from './market';
import env from './env';
import account from './account';
import ledger from 'store/ledger';

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

export default store;
