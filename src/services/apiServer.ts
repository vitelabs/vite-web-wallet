import provider from '@vite/vitejs-ws';
import { ViteAPI } from '@vite/vitejs';
import { Client } from 'utils/request';
import { DNSClient, setWatch } from './dnsHostIP';

let currentViteApiUrl = null;
const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

function viteXAPIAfterRes(xhr) {
    const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

    if (code !== 0) {
        return Promise.reject({
            code,
            subCode,
            message: msg || error,
            data
        });
    }

    return Promise.resolve(data || null);
}

export const ViteXAPI = new DNSClient({
    serverKey: 'dexAPI',
    afterResponse: viteXAPIAfterRes,
    baseUrl: `${ process.env.API === 'production' ? '' : '/test' }/api/v1`
});

export const ViteXAPIV2 = new DNSClient({
    serverKey: 'dexAPI',
    afterResponse: viteXAPIAfterRes,
    baseUrl: `${ process.env.API === 'production' ? '' : '/test' }/api/v2`
});

export const RewardAPI = new Client(`${ process.env.rewardApiServer }/`, viteXAPIAfterRes);

currentViteApiUrl = setWatch('gViteAPI', url => {
    setProvider(url);
});

let WS_RPC = new provider(currentViteApiUrl, providerTimeout, providerOptions);

export const viteClient = new ViteAPI(WS_RPC, () => {
    console.log(`gViteAPI Connect to ${ WS_RPC.path }`);
});
export const getProvider = () => WS_RPC;
export const setProvider = url => new Promise((resolve, reject) => {
    if (currentViteApiUrl === url) {
        return;
    }
    WS_RPC.destroy();
    currentViteApiUrl = url;
    WS_RPC = new provider(url, providerTimeout, providerOptions);
    WS_RPC.on('error', err => {
        console.log(err);
    });
    viteClient.setProvider(WS_RPC, () => {
        console.log(`Successfully changed gVite API to ${ url }`);
        resolve(url);
    }, false);
});

const FullNodeContractAddressOld = 'vite_b3b6335ef23ef3826cff125b81efd158dac3c2209748e0601a';
const FullNodeContractAddress = 'vite_8cf2663cc949442db2d3f78f372621733292d1fb0b846f1651';

export const customContracts = {
    FullNodeStake: {
        contractAddress: FullNodeContractAddress,
        abi: { 'inputs': [], 'name': 'stake', 'outputs': [], 'payable': true, 'type': 'function' }
    },
    FullNodeCancelStake: {
        contractAddress: FullNodeContractAddressOld,
        abi: { 'inputs': [{ 'name': 'id', 'type': 'bytes32' }], 'name': 'cancelStake', 'payable': false, 'type': 'function' }
    }
};
viteClient.addTransactionType(customContracts);
