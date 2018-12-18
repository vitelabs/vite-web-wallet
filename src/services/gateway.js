import request from 'utils/request';

// const path = process.env.gatewayServer + '/gw';
// const path = 'http://localhost:8081/gw';
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
