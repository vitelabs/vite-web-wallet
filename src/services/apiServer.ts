import provider from '@vite/vitejs-ws';
import { ViteAPI } from '@vite/vitejs';
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
export const viteClient = new ViteAPI(WS_RPC, () => {
    console.log('Connect success');
});

const SwitchConfigAbi = { 'type': 'function', 'name': 'SwitchConfig', 'inputs': [ { 'name': 'switchType', 'type': 'uint8' }, { 'name': 'enable', 'type': 'bool' } ] };
const LockVxForDividendAbi = { 'type': 'function', 'name': 'LockVxForDividend', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] };
const StakeForVIPAbi = { 'type': 'function', 'name': 'StakeForVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
const StakeForSuperVIPAbi = { 'type': 'function', 'name': 'StakeForSVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };
const StakeForPrincipalSVIPAbi = { 'type': 'function', 'name': 'StakeForPrincipalSVIP', 'inputs': [{ 'name': 'principal', 'type': 'address' }] };
const CancelStakeByIdAbi = { 'type': 'function', 'name': 'CancelStakeById', 'inputs': [{ 'name': 'id', 'type': 'bytes32' }] };
const StakeForQuotaAbi = { 'type': 'function', 'name': 'StakeForQuota', 'inputs': [{ 'name': 'beneficiary', 'type': 'address' }] };
const CancelQuotaStakingAbi = { 'type': 'function', 'name': 'CancelQuotaStaking', 'inputs': [{ 'name': 'id', 'type': 'bytes32' }] };
const StakeForMiningAbi = { 'type': 'function', 'name': 'StakeForMining', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'amount', 'type': 'uint256' } ] };

export const abiList = {
    StakeForQuota: {
        abi: StakeForQuotaAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000003f6af7459b9'
    },
    CancelQuotaStaking: {
        abi: CancelQuotaStakingAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000003f6af7459b9'
    },
    StakeForMining: {
        abi: StakeForMiningAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    },
    StakeForVIP: {
        abi: StakeForVIPAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    },
    StakeForSuperVip: {
        abi: StakeForSuperVIPAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    },
    StakeForPrincipalSVIP: {
        abi: StakeForPrincipalSVIPAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    },
    CancelStakeById: {
        abi: CancelStakeByIdAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    },
    LockVxForDividend: {
        abi: LockVxForDividendAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    },
    SwitchConfig: {
        abi: SwitchConfigAbi,
        contractAddr: 'vite_0000000000000000000000000000000000000006e82b8ba657'
    }
};
