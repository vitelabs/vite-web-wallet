import sendTx from 'pcUtils/sendTx';
import { constant } from '@vite/vitejs';
import i18n from 'pcI18n';
import { getClient } from 'utils/request';
import viteClient from 'utils/viteClient';

const version = 'v1';
const path = `${ process.env.dexApiServer }${ version }`;

const request = getClient(path);

export function bindCode(code: number) {
    return new Promise((res, rej) => {
        sendTx({
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
        })
            .then(block => res(block))
            .catch(e => rej(e));
    });
}

export function genCode() {
    return new Promise((res, rej) => {
        sendTx({
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
        })
            .then(data => res(data))
            .catch(e => rej(e));
    });
}

export function getInviteeCode(address: string) {
    // get who invited me
    return viteClient.request('dexfund_getInviteeCode', address);
}

export function getSvipStatus(address:string){
     return viteClient.request("dexfund_isPledgeSuperVip", address); 
}

export function configMarketsAgent({actionType, agent,tradeTokens,quoteTokens}) {
  return new Promise((res, rej) => {
    sendTx({
      abi: JSON.stringify(constant.DexFundConfigMarketsAgent_Abi),
      methodName: "dexFundConfigMarketsAgent",
      data: { actionType, agent,tradeTokens,quoteTokens },
      config: { pow: true }
    })
      .then(data => res(data))
      .catch(e => rej(e));
  });
}

export function pledgeForSuperVIp({actionType}) {
  return new Promise((res, rej) => {
    sendTx({
      abi: JSON.stringify(constant.DexFundPledgeForSuperVip_Abi),
      methodName: "dexFundPledgeForSuperVip",
      data: { actionType },
      config: { pow: true }
    })
      .then(data => res(data))
      .catch(e => rej(e));
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
  return request({
    method: "GET",
    path: "relation/proxy",
    params: { address }
  });
}
export function getProxyGrantor({ address }): Promise<IProxyRelation> {
  return request({
    method: "GET",
    path: "relation/grantor",
    params: { address }
  });
}


export function getProxyAblePairs(): Promise<IProxyPair[]> {
  return request({ method: "GET", path: "proxy/market" });
}