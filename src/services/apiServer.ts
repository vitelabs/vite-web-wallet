import provider from '@vite/vitejs-ws';
import { client } from '@vite/vitejs';
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

const url = setWatch('gViteAPI', url => {
    WS_RPC.disconnect();
    viteClient.setProvider(new provider(url), () => {
        console.log('reconnect cussess');
    }, false);
});

const WS_RPC = new provider(url);
export const viteClient = new client(WS_RPC, () => {
    console.log('Connect success');
});

const superVipAbi = { 'type': 'function', 'name': 'StakeForSVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
const StakeForPrincipalSVIPAbi = { 'type': 'function', 'name': 'StakeForPrincipalSVIP', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'principal', 'type': 'address' } ] };
const StakeForVIPAbi = { 'type': 'function', 'name': 'StakeForVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
const autoLockAbi = { 'type': 'function', 'name': 'SwitchConfig', 'inputs': [ { 'name': 'switchType', 'type': 'uint8' }, { 'name': 'enable', 'type': 'bool' } ] };
const lockVXAbi = { 'type': 'function', 'name': 'LockVxForDividend', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] };

viteClient.addTxType({
    SwitchConfig: {
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657',
        abi: autoLockAbi
    },
    LockVxForDividend: {
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657',
        abi: lockVXAbi
    },
    StakeForVIP: {
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657',
        abi: StakeForVIPAbi
    },
    StakeForSVIP: {
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657',
        abi: superVipAbi
    },
    StakeForPrincipalSVIP: {
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657',
        abi: StakeForPrincipalSVIPAbi
    }
});
