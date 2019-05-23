import request from 'utils/request';

const path = `${ process.env.dexApiServer }v1`;

// [TODO] symbol e.g. CSTT-47E_VITE.
export const klineHistory = function ({ startTime, endTime, symbol, interval }) {
    return request({
        path: `${ path }/market/kline`,
        method: 'GET',
        params: {
            startTime,
            endTime,
            limit: 1500,
            interval,
            symbol
        }
    });
};

export const depth = function ({ symbol }) {
    return request({
        path: `${ path }/market/depth`,
        method: 'GET',
        params: { symbol }
    });
};

export const order = function ({ address, startTime, endTime, tradeTokenSymbol, quoteTokenSymbol, side, offset, limit, status }) {
    return request({
        path: `${ path }/orders`,
        method: 'GET',
        params: { address, startTime, endTime, tradeTokenSymbol, quoteTokenSymbol, side, offset, limit, status }
    });
};

export const orderDetail = function ({ orderId, symbol, offset, limit, side }) {
    return request({
        path: `${ path }/market/trade`,
        method: 'GET',
        params: { orderId, symbol, offset, limit, side }
    });
};

export const latestTx = function ({ symbol }) {
    return request({
        path: `${ path }/market/trade`,
        method: 'GET',
        params: {
            symbol,
            limit: 100
        }
    });
};

export const rate = function () {
    return request({ path: `${ path }/rate/usd-cny` });
};

// [TODO]
export const rateFiat = function () {
    return request({ path: `${ path }/rate/fiat` });
};

export const rateToken = function ({ tokenIdList = [] }) {
    const tokenIds = tokenIdList.join(',');

    return request({
        path: `${ path }/exchange-rate`,
        params: { tokenIds }
    });
};

export const defaultPair = function ({ quoteTokenSymbol }) {
    return request({
        path: `${ path }/market/tickers`,
        method: 'GET',
        params: { quoteTokenSymbol }
    });
};

export const assignPair = function ({ symbols = [] }) {
    return request({
        path: `${ path }/market/tickers`,
        method: 'GET',
        params: { symbols: symbols.join(',') }
    });
};

export const marketsReserve = function ({ quoteTokenSymbol }) {
    return request({
        path: `${ path }/tokens/unmapped`,
        method: 'GET',
        params: { quoteTokenSymbol }
    });
};

export const tokenDetail = function ({ tokenId }) {
    return request({
        path: `${ path }/token/detail`,
        method: 'GET',
        params: { tokenId }
    });
};

export const baseToken = function () {
    return request({
        path: `${ path }/tokens`,
        method: 'GET',
        params: { category: 'quote' }
    });
};

export const tokenMap = function ({ symbol }) {
    return request({
        path: `${ path }/tokens/mapped`,
        method: 'GET',
        params: { quoteTokenSymbol: symbol }
    });
};

export async function chargeDetail({ tokenId, address }) {
    return await request({
        path: `${ path }/fund/record`,
        method: 'GET',
        params: {
            pageSize: 100,
            pageNo: 1,
            tokenId,
            address
        }
    });
}
