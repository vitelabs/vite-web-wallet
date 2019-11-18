import { ViteXAPI, ViteXAPIV2 } from 'services/apiServer';

export const limit = function () {
    return ViteXAPI.request({
        path: '/limit',
        method: 'GET'
    });
};

export const klineHistory = function ({ startTime, endTime, symbol, interval }) {
    return ViteXAPI.request({
        path: '/klines',
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

export const depth = function ({ symbol, step, limit = 100 }) {
    return ViteXAPI.request({
        path: '/depth',
        method: 'GET',
        params: { symbol, step, limit }
    });
};

export const order = function ({ address, total, startTime, endTime, tradeTokenSymbol, quoteTokenSymbol, side, offset, limit, status }) {
    return ViteXAPI.request({
        path: '/orders',
        method: 'GET',
        params: { address, startTime, endTime, total, tradeTokenSymbol, quoteTokenSymbol, side, offset, limit, status }
    });
};

export const orderDetail = function ({ orderId, symbol, offset, limit, side }) {
    return ViteXAPI.request({
        path: '/trades',
        method: 'GET',
        params: { orderId, symbol, offset, limit, side }
    });
};

export const latestTx = function ({ symbol }) {
    return ViteXAPI.request({
        path: '/trades',
        method: 'GET',
        params: {
            symbol,
            limit: 100
        }
    });
};

export const rate = function () {
    return ViteXAPI.request({ path: '/rate/usd-cny' });
};

export const rateToken = function ({ tokenIdList = [] }) {
    const tokenIds = tokenIdList.join(',');

    return ViteXAPI.request({
        path: '/exchange-rate',
        params: { tokenIds }
    });
};

export const defaultPair = function ({ quoteTokenCategory }) {
    return ViteXAPIV2.request({
        path: '/ticker/24hr',
        method: 'GET',
        params: { quoteTokenCategory }
    });
};

export const assignPair = function ({ symbols = [] }) {
    return ViteXAPIV2.request({
        path: '/ticker/24hr',
        method: 'GET',
        params: { symbols: symbols.join(',') }
    });
};

export function getMarketsByTradeToken({ tradeTokenSymbol }) {
    return ViteXAPIV2.request({
        method: 'GET',
        path: 'ticker/24hr',
        params: { tradeTokenSymbol }
    });
}

export function getMarketsByQuoteToken({ quoteTokenSymbol }) {
    return ViteXAPIV2.request({
        method: 'GET',
        path: 'ticker/24hr',
        params: { quoteTokenSymbol }
    });
}

export const marketsReserve = function ({ quoteTokenSymbol }) {
    return ViteXAPI.request({
        path: '/token/unmapped',
        method: 'GET',
        params: { quoteTokenSymbol }
    });
};

export const tokenDetail = function ({ tokenId }) {
    return ViteXAPI.request({
        path: '/token/detail',
        method: 'GET',
        params: { tokenId }
    });
};

export const baseToken = function () {
    return ViteXAPI.request({
        path: '/tokens',
        method: 'GET',
        params: { category: 'quote' }
    });
};

export const tokenMap = function ({ symbol }) {
    return ViteXAPI.request({
        path: '/token/mapped',
        method: 'GET',
        params: { quoteTokenSymbol: symbol }
    });
};

export function chargeDetail({ tokenId, address }) {
    return ViteXAPI.request({
        path: '/deposit-withdraw',
        method: 'GET',
        params: {
            pageSize: 100,
            pageNo: 1,
            tokenId,
            address
        }
    });
}

export function tokenInfoFromGithub({ tokenSymbol, platformSymbol = 'VITE', tokenAddress }:{tokenSymbol?:string, platformSymbol:string, tokenAddress?:string} = { platformSymbol: 'VITE' }) {
    return ViteXAPI.request({
        path: '/cryptocurrency/info/query',
        method: 'POST',
        params: { tokenSymbol, platformSymbol, tokenAddress }
    });
}

export function tokenRateFromCMC({ tokenSymbol, platformSymbol = 'VITE', tokenAddress }:{tokenSymbol?:string, platformSymbol:string, tokenAddress?:string} = { platformSymbol: 'VITE' }) {
    return ViteXAPI.request({
        path: '/cryptocurrency/rate/query',
        method: 'POST',
        params: { tokenSymbol, platformSymbol, tokenAddress }
    });
}

export function miningTrade({ address, offset, limit = 30 }) {
    return ViteXAPI.request({
        path: '/mining/trade',
        method: 'GET',
        params: { address, offset, limit }
    });
}

export function tradeFee({ address }) {
    return ViteXAPI.request({
        path: '/trade/fee',
        method: 'GET',
        params: { address }
    });
}

export function miningPledge({ address, offset, limit = 30 }) {
    return ViteXAPI.request({
        path: '/mining/pledge',
        method: 'GET',
        params: { address, offset, limit }
    });
}

export function dividend({ address, offset, limit = 30 }) {
    return ViteXAPI.request({
        path: '/dividend',
        method: 'GET',
        params: { address, offset, limit }
    });
}

export function marketsClosed() {
    return ViteXAPI.request({
        path: '/markets/closed',
        method: 'GET'
    });
}

export function operator(operatorId) {
    return ViteXAPI.request({
        path: '/operator',
        method: 'GET',
        params: {
            operatorId,
            offset: 0,
            limit: 100
        }
    });
}

export function operatorTokens(operatorId) {
    return ViteXAPI.request({
        path: '/operator/tokens',
        method: 'GET',
        params: {
            operatorId,
            offset: 0,
            limit: 100
        }
    });
}

export function operatorMarkets({ operatorId, tradeToken, offset, limit = 30 }) {
    return ViteXAPI.request({
        path: '/operator/markets',
        method: 'GET',
        params: { operatorId, tradeToken, offset, limit }
    });
}

export function operatorIncome({ operatorId, tradeToken, quoteToken, offset, limit = 30 }) {
    return ViteXAPI.request({
        path: '/operator/income',
        method: 'GET',
        params: { operatorId, tradeToken, quoteToken, offset, limit }
    });
}

export function operatorTradepair({ tradeToken, quoteToken }) {
    return ViteXAPI.request({
        path: '/operator/tradepair',
        method: 'GET',
        params: { tradeToken, quoteToken }
    });
}

interface IInviterInfo {
    miningTotal: bnStr;
    inviteCount: number;
    inviteCode: number;
    inviteeList: string[];
    inviteeInfo: {
        inviteCode: number;
        inviter: string;
    };
}
export function getInviteInfo(address: string): Promise<IInviterInfo> {
    return ViteXAPI.request({ method: 'GET', path: 'inviter', params: { address } });
}

interface IInviteMiningDetail {
    miningTotal: string;
    total: string;
    miningList: [
        {
            date: number;
            feeAmount: string;
            miningToken: string;
            miningAmount: string;
            status: number;
        }
    ];
}
export function getInviteMiningDetail({
    address,
    offset,
    limit
}): Promise<IInviteMiningDetail> {
    return ViteXAPI.request({
        method: 'GET',
        path: 'mining/invite',
        params: { address, offset, limit }
    });
}

interface IOrderMiningDetail {
    miningTotal: string;
    total: string;
    miningList: [
        {
            date: number;
            miningAmount: string;
            miningRatio: string;
            cycleKey: number;
        }
    ];
}

export function getOrderMining({
    address,
    offset,
    limit
}): Promise<IOrderMiningDetail> {
    return ViteXAPI.request({
        method: 'GET',
        path: 'mining/order/address',
        params: { address, offset, limit }
    });
}

export function getOrderMiningEstimate({ address }) {
    return ViteXAPI.request({
        method: 'GET',
        path: 'mining/order/estimate',
        params: { address }
    });
}

export function getOrderMiningDetails({ address, cycleKey }) {
    return ViteXAPI.request({
        method: 'GET',
        path: 'mining/order/details',
        params: { address, cycleKey }
    });
}

export function getMiningSetting() {
    return ViteXAPI.request({
        method: 'GET',
        path: 'mining/setting'
    });
}
