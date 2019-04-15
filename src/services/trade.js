import request from 'utils/request';
import { wallet } from 'utils/wallet';
import { privToAddr, constant } from '@vite/vitejs';

const path = `${ process.env.dexApiServer }v1`;
const ViteId = constant.Vite_TokenId;

export const klineHistory = function ({ from, to, ftoken, ttoken, resolution }) {
    return request({
        path: `${ path }/kline/history`,
        method: 'GET',
        params: {
            from,
            to,
            resolution,
            symbol: `${ ftoken },${ ttoken }`
        }
    });
};

export const depth = function ({ ftoken, ttoken }) {
    return request({
        path: `${ path }/depth`,
        method: 'GET',
        params: { ftoken, ttoken }
    });
};

export const order = function ({ address, fdate, tdate, ftoken, ttoken, orderSide, pageNo, pageSize, status, paging = 1 }) {
    return request({
        path: `${ path }/order/query`,
        method: 'GET',
        params: { address, fdate, tdate, ftoken, ttoken, orderSide, pageNo, pageSize, status, paging }
    });
};

export const orderDetail = function ({ orderId, ftoken, ttoken, pageNo, pageSize, type = 0 }) {
    return request({
        path: `${ path }/tx/details`,
        method: 'GET',
        params: { orderId, ftoken, ttoken, pageNo, pageSize, type }
    });
};

export const latestTx = function ({ ftoken, ttoken }) {
    return request({
        path: `${ path }/tx/latest`,
        method: 'GET',
        params: { ftoken, ttoken }
    });
};

export const rate = function () {
    return request({ path: `${ path }/rate/usd2cny` });
};

export const rateUstd = function () {
    return request({ path: `${ path }/rate/ustd` });
};

export const rateFiat = function () {
    return request({ path: `${ path }/rate/fiat` });
};

export const rateToken = function ({ tokenIdList = [] }) {
    const tokensStr = tokenIdList.join(',');

    return request({
        path: `${ path }/rate/assign`,
        params: { tokens: tokensStr }
    });
};

export const defaultPair = function ({ ttoken }) {
    return request({
        path: `${ path }/pair/default`,
        method: 'GET',
        params: { token: ttoken }
    });
};

export const assignPair = function ({ pairs = [] }) {
    const pairsStr = pairs.join(',');

    return request({
        path: `${ path }/pair/assign`,
        method: 'GET',
        params: { pairs: pairsStr }
    });
};

export const pairSearch = function ({ key, ttoken }) {
    return request({
        path: `${ path }/pair/search`,
        method: 'GET',
        params: { key, ttoken }
    });
};

export const marketsReserve = function ({ token }) {
    return request({
        path: `${ path }/markets/reserve`,
        method: 'GET',
        params: { token }
    });
};

export const tokenDetail = function ({ tokenId }) {
    return request({
        path: `${ path }/token/detail`,
        method: 'GET',
        params: { token: tokenId }
    });
};

export const tokenList = function () {
    return request({
        path: `${ path }/token/list`,
        method: 'GET'
    });
};

export const baseToken = function () {
    return request({
        path: `${ path }/token/base`,
        method: 'GET'
    });
};

export const tokenMap = function ({ tokenId }) {
    return request({
        path: `${ path }/token/mapping`,
        method: 'GET',
        params: { token: tokenId }
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

export const deposit = async function ({ tokenId, amount }) {
    return await wallet.getActiveAccount().callContract({
        toAddress: constant.DexFund_Addr,
        abi: constant.DexFundUserDeposit_Abi,
        tokenId,
        amount,
        params: []
    });
};

export const withdraw = async function ({ tokenId, amount }) {
    return await wallet.getActiveAccount().callContract({
        toAddress: constant.DexFund_Addr,
        abi: constant.DexFundUserWithdraw_Abi,
        params: [ tokenId, amount ],
        tokenId,
        amount: '0'
    });
};

export const cancelOrder = async function ({ orderId, tradeToken, side, quoteToken }) {
    return await wallet.getActiveAccount().callContract({
        tokenId: tradeToken,
        toAddress: constant.DexTrade_Addr,
        abi: constant.DexTradeCancelOrder_Abi,
        params: [ `0x${ Buffer.from(orderId, 'base64').toString('hex') }`, tradeToken, quoteToken, side ]
    });
};

export const newOrder = function ({ tradeToken, quoteToken, side, price, quantity }) {
    const orderId = getOrderId();

    return wallet.getActiveAccount().callContract({
        toAddress: constant.DexFund_Addr,
        abi: constant.DexFundNewOrder_Abi,
        params: [ `0x${ orderId }`, tradeToken, quoteToken, side, 0, price, quantity ],
        tokenId: tradeToken
    });
};

export const newMarket = function ({ tokenId = ViteId, amount, tradeToken, quoteToken }) {
    return wallet.getActiveAccount().callContract({
        toAddress: constant.DexFund_Addr,
        abi: constant.DexFundNewMarket_Abi,
        params: [ tradeToken, quoteToken ],
        tokenId,
        amount
    });
};


function getOrderId() {
    return privToAddr.newHexAddr().addr;
}
