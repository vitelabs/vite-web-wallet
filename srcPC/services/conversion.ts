import { ConversionAPI, BridgeAPI } from 'pcServices/apiServer';

export const bind = function ({
    pub_key,
    eth_tx_hash,
    eth_addr,
    vite_addr,
    value,
    signature
}) {
    return ConversionAPI.request({
        path: '/bind',
        method: 'POST',
        params: { pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature },
        timeout: 30000
    });
};

export const balance = function ({ address }) {
    return ConversionAPI.request({
        path: '/balance',
        method: 'GET',
        params: { address, token: 'VITE' },
        timeout: 30000
    });
};

export const getTxs = function (params: {
    fromAddress: string;
    fromNet: string;
}): Promise<{
    id: string;
    idx: number;
    amount: string;
    fromAddress: string;
    toAddress: string;
    fromHash: string;
    fromHashConfirmationNums: number;
    toHash: string;
    toHashConfirmationNums: number;
    fee: string;
    time: string;
}[]> {
    // return Promise.resolve([
    //     {
    //         id: '',
    //         idx: 23,
    //         amount: '100',
    //         fromAddress: 'dsfasdfasdfsa',
    //         toAddress: 'fasdfas',
    //         fromHash: 'fasdfasdf',
    //         fromHashConfirmationNums: 34,
    //         toHash: 'fsdfasdfas',
    //         toHashConfirmationNums: 34,
    //         fee: '23',
    //         time: '232332',
    //         token: 'VITE'
    //     }
    // ]);
    return BridgeAPI.request({
        path: '/txs',
        method: 'GET',
        params: params,
        timeout: 30000
    });
};

export const getTx = function (params: {
    from: string;
    to: string;
    id: string;
}): Promise<{
    id: string;
    idx: number;
    amount: string;
    fromAddress: string;
    toAddress: string;
    fromHash: string;
    toHash: string;
}> {
    return BridgeAPI.request({
        path: '/tx',
        method: 'GET',
        params: params,
        timeout: 30000
    });
};
