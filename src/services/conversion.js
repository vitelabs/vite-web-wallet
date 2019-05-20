import request from 'utils/request';

const path = '/gw';

export const bind = function ({ pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature }) {
    const _r = window.viteWalletRequest || request;

    return _r({
        path: `${ path }/bind`,
        method: 'POST',
        params: { pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature },
        hostname: process.env.conversionHost,
        timeout: 30000
    });
};

export const balance = function ({ address }) {
    const _r = window.viteWalletRequest || request;

    return _r({
        path: `${ path }/balance`,
        method: 'GET',
        params: { address, token: 'VITE' },
        hostname: process.env.conversionHost,
        timeout: 30000
    });
};
