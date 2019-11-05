import { ConversionAPI } from 'pcServices/apiServer';

export const bind = function ({ pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature }) {
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
