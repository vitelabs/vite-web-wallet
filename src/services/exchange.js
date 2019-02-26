import request from 'utils/request';
import { wallet } from 'utils/walletInstance';
import { utils,constant } from '@vite/vitejs';

const privToAddr = utils.address.privToAddr;
const path = '/api/v1';

export const klineMinute = function ({
    fdate, tdate, ftoken, ttoken
}) {
    return request({
        path: path + '/kline/minute',
        method: 'GET',
        params: {
            fdate, tdate, ftoken, ttoken
        }
    });
};

export const klineHour = function ({
    fdate, tdate, ftoken, ttoken
}) {
    return request({
        path: path + '/kline/hour',
        method: 'GET',
        params: {
            fdate, tdate, ftoken, ttoken
        }
    });
};

export const depthBuy = function ({
    ftoken, ttoken
}) {
    return request({
        path: path + '/depth/buy',
        method: 'GET',
        params: {
            ftoken, ttoken
        }
    });
};

export const depthSell = function ({
    ftoken, ttoken
}) {
    return request({
        path: path + '/depth/sell',
        method: 'GET',
        params: {
            ftoken, ttoken
        }
    });
};

export const order = function ({
    address, fdate, tdate, ftoken, ttoken, orderSide, pageNo, pageSize, status
}) {
    return request({
        path: path + '/order/query',
        method: 'GET',
        params: {
            address, fdate, tdate, ftoken, ttoken, orderSide, pageNo, pageSize, status
        }
    });
};

export const orderDetail = function({
    orderId, ftoken, ttoken,pageNo,pageSize
}) {
    return request({
        path: path + '/tx/details',
        method: 'GET',
        params: {
            orderId, ftoken, ttoken,pageNo,pageSize
        }
    });
};

export const latestTx = function ({
    ftoken, ttoken
}) {
    return request({
        path: path + '/tx/latest',
        method: 'GET',
        params: {
            ftoken, ttoken
        }
    });
};

export const rate = function() {
    return request({
        path: path + '/rate/usd2cny'
    });
};

export const rateUstd = function() {
    return request({
        path: path + '/rate/ustd'
    });
};

export const rateFiat = function() {
    return request({
        path: path + '/rate/fiat'
    });
};

export const rateToken = function({
    tokenIdList
}) {
    return request({
        path: path + '/rate/assign',
        params: {
            tokens: tokenIdList
        }
    });
};

export const defaultPair = function({
    toTokenId
}) {
    return request({
        path: path + '/pair/default',
        method: 'GET',
        params: {
            token: toTokenId
        }
    });
};


export const assignPair = function({
    pairs = []
}) {
    let pairsStr = pairs.join(',');

    return request({
        path: path + '/pair/assign',
        method: 'GET',
        params: {
            pairs: pairsStr
        }
    });
};

export const pairSearch = function({
    key, ttoken
}) {
    return request({
        path: path + '/pair/search',
        method: 'GET',
        params: {
            key, ttoken
        }
    });
};

export const tokenDetail = function({
    tokenId
}) {
    return request({
        path: path + '/token/detail',
        method: 'GET',
        params: {
            token: tokenId
        }
    });
};

export const baseToken = function() {
    return request({
        path: path + '/token/base',
        method: 'GET'
    });
};

export const tokenMap = function({
    tokenId
}) {
    return request({
        path: path + '/token/search',
        method: 'GET',
        params: {
            key: tokenId
        }
    });
};
export async function chargeDetail({tokenId,address}){
    return await request({
        path: path + '/fund/record',
        method: 'GET',
        params: { pageSize:100,
            pageNo:1,
            tokenId,
            address}
    });
}
export const deposit=async function({tokenId,amount}){
    // const abi=utils.abi.encodeFunctionCall({'type':'function','name':'DexFundUserDeposit', 'inputs':[]},[]);
    return await wallet.getActiveAccount().callContract({toAddress:'vite_000000000000000000000000000000000000000617d47459a8', abi:{'type':'function','name':'DexFundUserDeposit', 'inputs':[]}, tokenId, amount,params:[]});
};

export const withdraw=async function({tokenId,amount}){
    // const abi=utils.abi.encodeFunctionCall({'type':'function','name':'DexFundUserDeposit', 'inputs':[]},[]);
    return await wallet.getActiveAccount().callContract({toAddress:'vite_000000000000000000000000000000000000000617d47459a8', abi:{'type':'function','name':'DexFundUserWithdraw', 'inputs':[{'name':'token','type':'tokenId'},{'name':'amount','type':'uint256'}]}, params:[tokenId, amount],tokenId,amount:'0'});
};

export const cancelOrder =async function({orderId,tradeToken,side,quoteToken}){
    
    return await wallet.getActiveAccount().callContract({
        tokenId:tradeToken,
        toAddress:constant.contract.DexTrade_Addr,
        abi:{'type':'function','name':'DexTradeCancelOrder', 'inputs':[{'name':'orderId','type':'bytes'}, {'name':'tradeToken','type':'tokenId'}, {'name':',quoteToken','type':'tokenId'}, {'name':'side', 'type':'bool'}]},
        params:[`0x${Buffer.from(orderId,'base64').toString('hex')}`,tradeToken,quoteToken,side]});

};

export const newOrder = function({
    tradeToken, quoteToken, side, price, quantity
}) {
    let orderId = getOrderId();
    return wallet.getActiveAccount().callContract({
        toAddress:'vite_000000000000000000000000000000000000000617d47459a8',
        abi: {'type':'function','name':'DexFundNewOrder', 'inputs':[{'name':'orderId','type':'bytes'}, {'name':'tradeToken','type':'tokenId'}, {'name':'quoteToken','type':'tokenId'}, {'name':'side', 'type':'bool'}, {'name':'orderType', 'type':'uint32'}, {'name':'price', 'type':'string'}, {'name':'quantity', 'type':'uint256'}]}, 
        params: ['0x'+orderId, tradeToken, quoteToken, side, 0, price, quantity],
        tokenId: tradeToken
    });
};



function getOrderId() {
    return privToAddr.newHexAddr().addr;
}
