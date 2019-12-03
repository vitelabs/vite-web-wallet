import sendTx from 'pcUtils/sendTx';
import { constant } from '@vite/vitejs';
import i18n from 'pcI18n';
import { ViteXAPI } from 'services/apiServer';

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
        data: { actionType }
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
