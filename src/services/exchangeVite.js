import request from 'utils/request';

const path = '/gw';

export const bind = function({
    pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature
}) {
    return request({
        path: path + '/bind',
        method: 'POST',
        params: {
            pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature
        }
    });
};