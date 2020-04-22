import sendTx from 'pcUtils/sendTx';
import signText from 'pcUtils/signText';
import { constant } from '@vite/vitejs';
import i18n from 'pcI18n';
import { ViteXAPI } from 'services/apiServer';
import { getCurrHDAcc } from 'wallet';


export function bindCode(code: number) {
    return sendTx({
        abi: JSON.stringify(constant.Contracts.DexBindInviteCode.abi),
        description: {
            function: {
                name: {
                    base: i18n.t('assets.invite.receiveInviteTitle', 'en'),
                    zh: i18n.t('assets.invite.receiveInviteTitle', 'zh')
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
            cost: '1000 VITE'
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
export async function createOpenApiKey({ address, agentAddress }) {
    const signature = await signText({ text: 'signText' });
    const { publicKey = '8Np6DQ78vi8A/QnuvbMWta8QGK7ZThBgxpRGR1QoWDo=' } = getCurrHDAcc();
    return ViteXAPI.request({
        method: 'GET',
        path: 'agent/key',
        params: {
            address,
            agentAddress,
            signature,
            pubKey: publicKey
        }
    })
        .catch(err => {
        // openapi mock
            return {
                'agentAddress': 'vite_8942dbbe95adaa65b1603970cee2ed0c0867ae8ed958c4cac5',
                'type': 1,
                'apiKey': '01CA41B8DA499783B6AB7F1380B98B3F',
                // 'apiSecret': '454AB3CD01475A627020A2C021DF8F22',
                'isValid': null,
                'invalidCode': null,
                'balanceLimit': 1000,
                'agentPledgeAmount': 1,
                'rights': [
                    1
                ],
                'createTime': 1585907461000,
                'expireTime': null
            };
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
export async function deleteKey({ address, agentAddress, timestamp, signature, pubKey }) {
    const result = signText({});

    return ViteXAPI.request({
        method: 'POST',
        path: 'agent/removal',
        params: {
            address,
            agentAddress,
            timestamp,
            signature,
            pubKey
        }
    });
}
