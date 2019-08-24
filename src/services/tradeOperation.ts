import sendTx from "utils/sendTx";
import { constant } from "@vite/vitejs";
import { getClient } from "utils/request";
import viteClient from "utils/viteClient";
import i18n from "i18n";

const version = "v1";
const path = `${process.env.dexApiServer}${version}`;
const request = getClient(path, (xhr: XMLHttpRequest) => {
  if (xhr.status === 200) {
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
  return Promise.reject(xhr.responseText);
});

export function bindCode(code: number) {
  return new Promise((res, rej) => {
    sendTx({
      abi: JSON.stringify(constant.DexFundBindInviteCode_Abi),
      description: {
        function: {
          name: {
            base: i18n.t("assets.invite.receiveInviteTitle", "en"),
            zh: i18n.t("assets.invite.receiveInviteTitle", "zh")
          }
        },
        inputs: [
          {
            name: {
              base: i18n.t("assets.invite.codeLable"),
              zh: i18n.t("assets.invite.codeLable")
            }
          }
        ]
      },
      methodName: "dexFundBindInviteCode",
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
            base: i18n.t("assets.invite.inviteTitle", "en"),
            zh: i18n.t("assets.invite.inviteTitle", "en")
          }
        },
        inputs: []
      },
      vbExtends: {
        type: "dexNewInviter",
        cost: "1000 VITE"
      },
      methodName: "dexFundNewInviter",
      config: { pow: true }
    })
      .then(data => res(data))
      .catch(e => rej(e));
  });
}

interface IInviterInfo {
  miningTotal: bnStr;
  inviteCount: number;
  inviteCode: number;
  inviteeList: string[];
  inviteeInfo: {
    inviteCode: number;
    inviter: string;
  };
}

export function getInviteInfo(address: string): Promise<IInviterInfo> {
  return request({ method: "GET", path: "inviter", params: { address } });
}

export function getCode(address: string) {
  // get my code
  return viteClient.request("dexfund_getInviterCode", address);
}

export function getInviteeCode(address: string) {
  // get who invited me
  return viteClient.request("dexfund_getInviteeCode", address);
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

interface IInviteMiningDetail {
  miningTotal: string;
  total: string;
  miningList: [
    {
      date: number;
      feeAmount: string;
      miningToken: string;
      miningAmount: string;
      status: number;
    }
  ];
}
export function getInviteMiningDetail({
  address,
  offset,
  limit
}): Promise<IInviteMiningDetail> {
  return request({
    method: "GET",
    path: "mining/invite",
    params: { address, offset, limit }
  });
}
interface IOrderMiningDetail {
  miningTotal: string;
  total: string;
  miningList: [
    {
      date: number;
      miningAmount: string;
      miningRatio: string;
    }
  ];
}
export function getOrderMiningDetail({
  address,
  offset,
  limit
}): Promise<IOrderMiningDetail> {
  return request({
    method: "GET",
    path: "mining/order/address",
    params: { address, offset, limit }
  });
}
