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

import market from './market';
import latestTx from './latestTx';
import activeTxPair from './activeTxPair';

export default {
    exchangeFee: fee,
    exchangeRate: rate,
    exchangeDepth: depth,
    exchangeLimit: limit,
    exchangeMarket: market,
    exchangeTokens: tokens,
    exchangeBalance: balance,
    exchangeLatestTx: latestTx,
    exchangeActiveTx: activeTx,
    exchangeLatestOrder: latestOrder,
    exchangeActiveTxPair: activeTxPair,
    exchangeCurrentOpenOrders: currentOpenOrders,
    exchangeDexFundUnreceived: dexFundUnreceived,
    exchangeTokenDecimalsLimit: tokenDecimalsLimit
};
