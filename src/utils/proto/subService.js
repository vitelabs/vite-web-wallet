import { depth, defaultPair, assignPair, latestTx, order } from 'services/trade';

export function depthWs({ symbol }) {
    const key = `market.${ symbol }.depth`;
    return key;
}

export const defaultPairWs = function ({ quoteTokenCategory }) {
    const key = `market.quoteTokenCategory.${ quoteTokenCategory }.tickers`;
    return key;
};

export const assignPairWs = function ({ symbol }) {
    const key = `market.${ symbol }.tickers`;
    return key;
};

export const latestTxWs = function ({ symbol }) {
    const key = `market.${ symbol }.trade`;
    return key;
};

export const latestOrderWs = function ({ address }) {
    const key = `order.${ address }`;
    return key;
};

export const orderQueryHistoryWs = function ({ symbol, address }) {
    const key = `market.${ symbol }.order.${ address }.history`;
    return key;
};

export const orderQueryCurrentWs = function ({ symbol, address }) {
    const key = `market.${ symbol }.order.${ address }.open`;
    return key;
};

export const klineWs = function ({ symbol, resolution }) {
    const key = `market.${ symbol }.kline.${ resolution }`;
    return key;
};


export const httpServicesMap = {
    depth,
    defaultPair,
    assignPair,
    latestTx,
    orderQueryHistory: ({ quoteTokenSymbol, tradeTokenSymbol, address }) => order({
        address,
        quoteTokenSymbol,
        tradeTokenSymbol,
        offset: 0,
        limit: 30
    }),
    orderQueryCurrent: ({ quoteTokenSymbol, tradeTokenSymbol, address }) => order({
        address,
        quoteTokenSymbol,
        tradeTokenSymbol,
        offset: 0,
        limit: 30,
        status: 1
    })
};
export const wsServicesMap = {
    depth: depthWs,
    defaultPair: defaultPairWs,
    assignPair: assignPairWs,
    latestTx: latestTxWs,
    latestOrder: latestOrderWs,
    orderQueryHistory: orderQueryHistoryWs,
    orderQueryCurrent: orderQueryCurrentWs,
    kline: klineWs
};
