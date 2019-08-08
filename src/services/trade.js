import request from 'utils/request';

const version = 'v1';
const path = `${ process.env.dexApiServer }${ version }`;

export const limit = function () {
    return request({
        path: `${ path }/limit`,
        method: 'GET'
    });
};

export const klineHistory = function ({ startTime, endTime, symbol, interval }) {
    return request({
        path: `${ path }/klines`,
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

export const depth = function ({ symbol, step }) {
    return request({
        path: `${ path }/depth`,
        method: 'GET',
        params: { symbol, step }
    });
};

export const order = function ({ address, total, startTime, endTime, tradeTokenSymbol, quoteTokenSymbol, side, offset, limit, status }) {
    return request({
        path: `${ path }/orders`,
        method: 'GET',
        params: { address, startTime, endTime, total, tradeTokenSymbol, quoteTokenSymbol, side, offset, limit, status }
    });
};

export const orderDetail = function ({ orderId, symbol, offset, limit, side }) {
    return request({
        path: `${ path }/trades`,
        method: 'GET',
        params: { orderId, symbol, offset, limit, side }
    });
};

export const latestTx = function ({ symbol }) {
    return request({
        path: `${ path }/trades`,
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

export const rateToken = function ({ tokenIdList = [] }) {
    const tokenIds = tokenIdList.join(',');

    return request({
        path: `${ path }/exchange-rate`,
        params: { tokenIds }
    });
};

export const defaultPair = function ({ quoteTokenCategory }) {
    return request({
        path: `${ path }/ticker/24hr`,
        method: 'GET',
        params: { quoteTokenCategory }
    });
};

export const assignPair = function ({ symbols = [] }) {
    return request({
        path: `${ path }/ticker/24hr`,
        method: 'GET',
        params: { symbols: symbols.join(',') }
    });
};

export const marketsReserve = function ({ quoteTokenSymbol }) {
    return request({
        path: `${ path }/token/unmapped`,
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
        path: `${ path }/token/mapped`,
        method: 'GET',
        params: { quoteTokenSymbol: symbol }
    });
};

export async function chargeDetail({ tokenId, address }) {
    return await request({
        path: `${ path }/deposit-withdraw`,
        method: 'GET',
        params: {
            pageSize: 100,
            pageNo: 1,
            tokenId,
            address
        }
    });
}

export async function tokenInfoFromGithub({ tokenSymbol, platformSymbol = 'VITE', tokenAddress } = { tokenSymbol, platformSymbol: 'VITE', tokenAddress }) {
    return await request({
        path: `${ path }/cryptocurrency/info/query`,
        method: 'POST',
        params: { tokenSymbol, platformSymbol, tokenAddress }
    });
}

export async function tokenRateFromCMC({ tokenSymbol, platformSymbol = 'VITE', tokenAddress } = { tokenSymbol, platformSymbol: 'VITE', tokenAddress }) {
    return await request({
        path: `${ path }/cryptocurrency/rate/query`,
        method: 'POST',
        params: { tokenSymbol, platformSymbol, tokenAddress }
    });
}

export function miningTrade({ address, offset, limit = 30 }) {
    return request({
        path: `${ path }/mining/trade`,
        method: 'GET',
        params: { address, offset, limit }
    });
}

export function miningPledge({ address, offset, limit = 30 }) {
    return request({
        path: `${ path }/mining/pledge`,
        method: 'GET',
        params: { address, offset, limit }
    });
}

export function dividend({ address, offset, limit = 30 }) {
    return request({
        path: `${ path }/dividend`,
        method: 'GET',
        params: { address, offset, limit }
    });
}

export function marketsClosed() {
    return request({
        path: `${ path }/markets/closed`,
        method: 'GET'
    });
}

export function operator(operatorId) {
    return request({
        path: `${ path }/operator`,
        method: 'GET',
        params: {
            operatorId,
            offset: 0,
            limit: 100
        }
    });
}

export function operatorTokens(operatorId) {
    return request({
        path: `${ path }/operator/tokens`,
        method: 'GET',
        params: {
            operatorId,
            offset: 0,
            limit: 100
        }
    });
}

export function operatorMarkets({ operatorId, tradeToken, offset, limit = 30 }) {
    return request({
        path: `${ path }/operator/markets`,
        method: 'GET',
        params: { operatorId, tradeToken, offset, limit }
    });
}

export function operatorIncome({ operatorId, tradeToken, quoteToken, offset, limit = 30 }) {
    return request({
        path: `${ path }/operator/income`,
        method: 'GET',
        params: { operatorId, tradeToken, quoteToken, offset, limit }
    });
}

export function operatorTradepair({ tradeToken, quoteToken }) {
    return request({
        path: `${ path }/operator/tradepair`,
        method: 'GET',
        params: { tradeToken, quoteToken }
    });
}
