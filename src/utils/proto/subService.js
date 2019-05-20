import { depth, defaultPair, assignPair, latestTx, order } from 'services/trade';

export function depthWs({ ftoken, ttoken }) {
    const key = `market.${ ftoken }-${ ttoken }.depth.latest`;
    return key;
}

export const defaultPairWs = function ({ ttoken }) {
    const key = `market.${ ttoken }.details.latest`;
    return key;
};

export const assignPairWs = function ({ ftoken, ttoken }) {
    const key = `market.${ ftoken }-${ ttoken }.detail.latest`;
    return key;
};

export const latestTxWs = function ({ ftoken, ttoken }) {
    const key = `market.${ ftoken }-${ ttoken }.trade.latest`;
    return key;
};

export const latestOrderWs = function ({ address }) {
    const key = `order.${ address }.latest`;
    return key;
};

export const orderQueryHistoryWs = function ({ ftoken, ttoken, address }) {
    const key = `market.${ ftoken }-${ ttoken }.order.${ address }.history`;
    return key;
};

export const orderQueryCurrentWs = function ({ ftoken, ttoken, address }) {
    const key = `market.${ ftoken }-${ ttoken }.order.${ address }.current`;
    return key;
};

export const klineWs = function ({ ftoken, ttoken, resolution }) {
    const key = `market.${ ftoken }-${ ttoken }.kline.${ resolution }`;
    return key;
};


export const httpServicesMap = {
    depth,
    defaultPair,
    assignPair,
    latestTx,
    orderQueryHistory: ({ ftoken, ttoken, address }) => order({
        address,
        ttoken,
        ftoken,
        pageNo: 1,
        pageSize: 30,
        status: 0,
        paging: 0
    }),
    orderQueryCurrent: ({ ftoken, ttoken, address }) => order({
        address,
        ttoken,
        ftoken,
        pageNo: 1,
        pageSize: 30,
        status: 1,
        paging: 0
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
