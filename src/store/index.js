import fee from './fee';
import limit from './limit';
import mine from './mine.js';
import rate from './rate.js';
import tokens from './tokens';
import depth from './depth.js';
import balance from './balance';
import activeTx from './activeTx';
import latestOrder from './latestOrder';
import dexFundUnreceived from './dexFundUnreceived';
import currentOpenOrders from './currentOpenOrders';
import activeTxPairGetters from './activeTxPairGetters';

export default {
    exchangeFee: fee,
    exchangeMine: mine,
    exchangeRate: rate,
    exchangeDepth: depth,
    exchangeLimit: limit,
    exchangeTokens: tokens,
    exchangeBalance: balance,
    exchangeActiveTx: activeTx,
    exchangeLatestOrder: latestOrder,
    exchangeDexFundUnreceived: dexFundUnreceived,
    exchangeCurrentOpenOrders: currentOpenOrders,
    exchangeActiveTxPairGetters: activeTxPairGetters
};
