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

const bindCodeInterface = {
  type: "function",
  name: "DexFundBindInviteCode",
  inputs: [{ name: "code", type: "uint32" }]
};
const genCodeInterface = {
  type: "function",
  name: "DexFundNewInviter",
  inputs: []
};
export function bindCode(code: number) {
  return new Promise((res, rej) => {
    sendTx({
      abi: JSON.stringify(bindCodeInterface),
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
      methodName: "callContract",
      data: {
        toAddress: constant.DexFund_Addr,
        abi: bindCodeInterface,
        params: [code]
      },
      config: {
        pow: true
      }
    })
      .then(block => res(block))
      .catch(e => rej(e));
  });
}

export function genCode() {
  return new Promise((res, rej) => {
    sendTx({
      abi: JSON.stringify(genCodeInterface),
      description: {
        function: {
          name: {
            base: i18n.t("assets.invite.inviteTitle", "en"),
            zh: i18n.t("assets.invite.inviteTitle", "en")
          }
        },
        inputs: []
      },
      methodName: "callContract",
      data: {
        toAddress: constant.DexFund_Addr,
        abi: genCodeInterface
      },
      config: {
        pow: true
      }
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
  //get my code
  return viteClient.request("dexfund_getInviterCode", address);
}

export function getInviteeCode(address: string) {
  // get who invited me
  return viteClient.request("dexfund_getInviteeCode", address);
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
