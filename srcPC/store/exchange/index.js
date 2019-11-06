import commonStore from 'store/index';

import market from './market';
import latestTx from './latestTx';
import activeTxPair from './activeTxPair';

export default {
    ...commonStore,
    exchangeMarket: market,
    exchangeLatestTx: latestTx,
    exchangeActiveTxPair: activeTxPair
};
