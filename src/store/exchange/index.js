import rate from './rate.js';
import depth from './depth.js';
import activeTxPair from './activeTxPair';
import latestTx from './latestTx';
import balance from './balance';

export default {
    exchangeRate: rate,
    exchangeDepth: depth,
    exchangeActiveTxPair: activeTxPair,
    exchangeLatestTx: latestTx,
    exchangeBalance: balance
};
