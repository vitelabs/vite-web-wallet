import rate from './rate.js';
import depth from './depth.js';
import activeTxPair from './activeTxPair';
import activeTx from './activeTx';
import latestTx from './latestTx';
import balance from './balance';

export default {
    exchangeRate: rate,
    exchangeDepth: depth,
    exchangeActiveTx: activeTx,
    exchangeActiveTxPair: activeTxPair,
    exchangeLatestTx: latestTx,
    exchangeBalance: balance
};
