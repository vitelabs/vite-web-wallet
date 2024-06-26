import sendTx from '@pc/utils/sendTx';
import signText from '@pc/utils/signText';
import { constant } from '@vite/vitejs';
import i18n from '@pc/i18n';
import { ViteXAPI, viteClient } from '@services/apiServer';


export function bindCode(code: number) {
    return sendTx({
        abi: JSON.stringify(constant.Contracts.DexBindInviteCode.abi),
        description: {
            function: {
                name: {
                    base: i18n.t('assets.invite.receiveInviteTitle', 'en'),
                    zh: i18n.t('assets.invite.receiveInviteTitle', 'en')
                }
            },
            inputs: [
                {
                    name: {
                        base: i18n.t('assets.invite.codeLable'),
                        zh: i18n.t('assets.invite.codeLable')
                    }
                }
            ]
        },
        methodName: 'dexBindInviteCode',
        data: { code }
    });
}

export function genCode() {
    return sendTx({
        abi: JSON.stringify(constant.Contracts.DexCreateNewInviter.abi),
        description: {
            function: {
                name: {
                    base: i18n.t('assets.invite.inviteTitle', 'en'),
                    zh: i18n.t('assets.invite.inviteTitle', 'en')
                }
            },
            inputs: []
        },
        vbExtends: {
            type: 'dexNewInviter',
            cost: '100 VITE'
        },
        methodName: 'dexCreateNewInviter'
    });
}

export function configMarketsAgent({ actionType, agent, tradeTokens, quoteTokens }) {
    return sendTx({
        methodName: 'dexConfigMarketAgents',
        data: { actionType, agent, tradeTokens, quoteTokens }
    });
}

interface IProxyPair {
  symbol: string;
  tradeToken: string;
  tradeTokenSymbol: string;
  quoteToken: string;
  quoteTokenSymbol: string;
}
interface IProxyRelation {
  [key: string]: Array<IProxyPair>;
}

export function getProxyRelation({ address }): Promise<IProxyRelation> {
    return ViteXAPI.request({
        method: 'GET',
        path: 'relation/proxy',
        params: { address }
    });
}
export function getProxyGrantor({ address }): Promise<IProxyRelation> {
    return ViteXAPI.request({
        method: 'GET',
        path: 'relation/grantor',
        params: { address }
    });
}
export function getProxyAblePairs(): Promise<IProxyPair[]> {
    return ViteXAPI.request({ method: 'GET', path: 'proxy/market' });
}


export function stakeForVIP({ actionType }) {
    return sendTx({
        methodName: 'dexStakeForVIP',
        data: { actionType },
        vbExtends: {
            type: 'dexFundPledgeForVip',
            amount: '10000 VITE'
        }
    });
}

export function stakeForSuperVIP({ actionType }) {
    return sendTx({
        methodName: 'dexStakeForSuperVIP',
        data: { actionType }
    });
}

export function stakeForPrincipalSVIP({ principal }) {
    return sendTx({
        methodName: 'dexStakeForPrincipalSVIP',
        data: { principal }
    });
}

export function cancelStakeById({ id }) {
    return sendTx({
        methodName: 'dexCancelStakeById',
        data: { id }
    });
}

export function lockVxForDividend({ actionType, amount }) {
    return sendTx({
        methodName: 'dexLockVxForDividend',
        data: { actionType, amount }
    });
}


// OpenApi: Get Agent Address
export function getAgentAddress({ address }) {
    return ViteXAPI.request({
        method: 'GET',
        path: 'agent/info',
        params: { address }
    });
}

// OpenApi: Create Open Api Key
export async function createOpenApiKey({ address, agentAddress, latestSnapshotHeight }) {
    if (!latestSnapshotHeight) {
        latestSnapshotHeight = await viteClient.request('ledger_getSnapshotChainHeight');
    }
    const block = await viteClient.request('ledger_getSnapshotBlockByHeight', latestSnapshotHeight);

    const result = await signText({ text: `${ agentAddress }_${ block.timestamp }` });

    return ViteXAPI.request({
        method: 'POST',
        path: 'agent/key',
        params: {
            address,
            agentAddress,
            signature: result.signature,
            pubKey: result.publicKey,
            timestamp: block.timestamp
        }
    });
}

// OpenApi: Get package List
export async function getPackageList() {
    return ViteXAPI.request({
        method: 'GET',
        path: 'agent/package'
    });
}

// 升级套餐
export async function upgradePackage({ address, agentAddress, type, packageTime, sendHash }) {
    return ViteXAPI.request({
        method: 'POST',
        path: 'agent/info',
        params: {
            address,
            agentAddress,
            type,
            packageTime,
            sendHash
        }
    });
}

// 删除KEY信息
export async function deleteKey({ address, agentAddress, latestSnapshotHeight }) {
    if (!latestSnapshotHeight) {
        latestSnapshotHeight = await viteClient.request('ledger_getSnapshotChainHeight');
    }

    const block = await viteClient.request('ledger_getSnapshotBlockByHeight', latestSnapshotHeight);
    const result = await signText({ text: `${ agentAddress }_${ block.timestamp }` });
    return ViteXAPI.request({
        method: 'POST',
        path: 'agent/removal',
        params: {
            address,
            agentAddress,
            timestamp: block.timestamp,
            signature: result.signature,
            pubKey: result.publicKey
        }
    });
}
