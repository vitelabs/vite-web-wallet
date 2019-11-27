import sendTx from 'pcUtils/sendTx';
import { constant } from '@vite/vitejs';
import i18n from 'pcI18n';
import { ViteXAPI, abiList } from 'services/apiServer';

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
        data: { code },
        config: { pow: true }
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
        abi: JSON.stringify(constant.Contracts.DexConfigMarketAgents),
        methodName: 'dexConfigMarketAgents',
        data: { actionType, agent, tradeTokens, quoteTokens },
        config: { pow: true }
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
        abi: JSON.stringify(abiList.StakeForVIP.abi),
        methodName: 'callContract',
        data: {
            abi: abiList.StakeForVIP.abi,
            params: [actionType],
            toAddress: abiList.StakeForVIP.contractAddr
        }
    });
}

export function stakeForSuperVIP({ actionType }) {
    return sendTx({
        abi: JSON.stringify(abiList.StakeForSuperVip.abi),
        methodName: 'callContract',
        data: {
            abi: abiList.StakeForSuperVip.abi,
            params: [actionType],
            toAddress: abiList.StakeForSuperVip.contractAddr
        }
    });
}

export function stakeForPrincipalSVIP({ principal }) {
    return sendTx({
        abi: JSON.stringify(abiList.StakeForPrincipalSVIP.abi),
        methodName: 'callContract',
        data: {
            abi: abiList.StakeForPrincipalSVIP.abi,
            params: [principal],
            toAddress: abiList.StakeForPrincipalSVIP.contractAddr
        }
    });
}

export function cancelStakeById({ id }) {
    return sendTx({
        abi: JSON.stringify(abiList.CancelStakeById.abi),
        methodName: 'callContract',
        data: {
            abi: abiList.CancelStakeById.abi,
            params: [id],
            toAddress: abiList.CancelStakeById.contractAddr
        }
    });
}

export function lockVxForDividend({ actionType, amount }) {
    return sendTx({
        abi: JSON.stringify(abiList.LockVxForDividend.abi),
        methodName: 'callContract',
        data: {
            abi: abiList.LockVxForDividend.abi,
            params: [ actionType, amount ],
            toAddress: abiList.LockVxForDividend.contractAddr
        }
    });
}
