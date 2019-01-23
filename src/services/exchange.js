import request from 'utils/request';

const path = '/api/v1';

export const klineMinute = function ({
    fDate, tDate, ftoken, ttoken
}) {
    return request({
        path: path + '/kline/minute',
        method: 'GET',
        params: {
            fDate, tDate, fToken: ftoken, tToken: ttoken
        }
    });
};

export const klineHour = function ({
    fDate, tDate, ftoken, ttoken
}) {
    return request({
        path: path + '/kline/hour',
        method: 'GET',
        params: {
            fDate, tDate, fToken: ftoken, tToken: ttoken
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
            fToken: ftoken, tToken: ttoken
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
            fToken: ftoken, tToken: ttoken
        }
    });
};

export const order = function ({
    address, fDate, tDate, ftoken, ttoken, orderSide, pageNo, pageSize, status
}) {
    return request({
        path: path + '/order/query',
        method: 'GET',
        params: {
            address, fDate, tDate, fToken: ftoken, tToken: ttoken, orderSide, pageNo, pageSize, status
        }
    });
};

export const orderDetail = function({
    orderId
}) {
    return request({
        path: path + '/tx/details',
        method: 'GET',
        params: {
            orderId
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
            fToken: ftoken, 
            tToken: ttoken
        }
    });
};

export const rate = function() {
    return request({
        path: path + '/coin/rate'
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
    pairs
}) {
    return request({
        path: path + '/pair/assign',
        method: 'GET',
        params: {
            pairs
        }
    });
};

export const pairSearch = function({
    fromTokenShow
}) {
    return request({
        path: path + '/pair/search',
        method: 'GET',
        params: {
            key: fromTokenShow
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
        path: path + '/token/mapping',
        method: 'GET',
        params: {
            token: tokenId
        }
    });
};
