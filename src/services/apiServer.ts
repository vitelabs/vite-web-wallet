import provider from '@vite/vitejs-ws';
import { ViteAPI } from '@vite/vitejs';
import { Client } from 'utils/request';
import { DNSClient, setWatch } from './dnsHostIP';

function viteXAPIAfterRes(xhr) {
    const { code, msg, data, error, subCode } = JSON.parse(xhr.responseText);

    if (code !== 0) {
        return Promise.reject({
            code,
            subCode,
            message: msg || error
        });
    }

    return Promise.resolve(data || null);
}

export const ViteXAPI = new DNSClient({
    serverKey: 'dexAPI',
    afterResponse: viteXAPIAfterRes,
    baseUrl: `${ process.env.NODE_ENV === 'production' ? '' : '/test' }/api/v1`
});

export const ViteXAPIV2 = new DNSClient({
    serverKey: 'dexAPI',
    afterResponse: viteXAPIAfterRes,
    baseUrl: `${ process.env.NODE_ENV === 'production' ? '' : '/test' }/api/v2`
});

export const RewardAPI = new Client('api/', viteXAPIAfterRes);

const url = setWatch('gViteAPI', url => {
    WS_RPC.disconnect();
    viteClient.setProvider(new provider(url), () => {
        console.log('reconnect cussess');
    }, false);
});

const WS_RPC = new provider(url);
export const viteClient = new ViteAPI(WS_RPC, () => {
    console.log('Connect success');
});

const FullNodeContractAddress = 'vite_a11faa6b72487054ac5fd85415e6e9dc871cae44def1923cb4';
export const customContracts = {
    FullNodeStake: {
        contractAddress: FullNodeContractAddress,
        abi: { 'inputs': [], 'name': 'stake', 'outputs': [], 'payable': true, 'type': 'function' }
    },
    FullNodeCancelStake: {
        contractAddress: FullNodeContractAddress,
        abi: { 'inputs': [{ 'name': 'id', 'type': 'bytes32' }], 'name': 'cancelStake', 'payable': false, 'type': 'function' }
    }
};
viteClient.addTransactionType(customContracts);
