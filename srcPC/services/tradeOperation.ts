import sendTx from 'pcUtils/sendTx';
import { constant } from '@vite/vitejs';
import i18n from 'pcI18n';
import { ViteXAPI } from 'services/apiServer';

export function bindCode(code: number) {
    return sendTx({
        abi: JSON.stringify(constant.DexFundBindInviteCode_Abi),
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
        methodName: 'dexFundBindInviteCode',
        data: { code },
        config: { pow: true }
    });
}

export function genCode() {
    return sendTx({
        abi: JSON.stringify(constant.DexFundNewInviter_Abi),
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
        methodName: 'dexFundNewInviter',
        config: { pow: true }
    });
}

export function pledgeForSuperVIP({ actionType }) {
    const superVipAbi = { 'type': 'function', 'name': 'StakeForSVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };

    return sendTx({
        abi: JSON.stringify(superVipAbi),
        methodName: 'callContract',
        data: {
            abi: superVipAbi,
            params: [actionType],
            toAddress: 'vite_0000000000000000000000000000000000000006e82b8ba657'
        }
    });
}

export function stakeForPrincipalSVIP({ actionType, principal }) {
    const StakeForPrincipalSVIPAbi = { 'type': 'function', 'name': 'StakeForPrincipalSVIP', 'inputs': [ { 'name': 'actionType', 'type': 'uint8' }, { 'name': 'principal', 'type': 'address' } ] };

    return sendTx({
        abi: JSON.stringify(StakeForPrincipalSVIPAbi),
        methodName: 'callContract',
        data: {
            abi: StakeForPrincipalSVIPAbi,
            params: [ actionType, principal ],
            toAddress: 'vite_0000000000000000000000000000000000000006e82b8ba657'
        }
    });
}

export function configMarketsAgent({ actionType, agent, tradeTokens, quoteTokens }) {
    return sendTx({
        abi: JSON.stringify(constant.DexFundConfigMarketsAgent_Abi),
        methodName: 'dexFundConfigMarketsAgent',
        data: { actionType, agent, tradeTokens, quoteTokens },
        config: { pow: true }
    });
}


interface IProxyPair {
  symbol: string;
  tradeToken: tokenId;
  tradeTokenSymbol: tokenSymbol;
  quoteToken: tokenId;
  quoteTokenSymbol: tokenSymbol;
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
