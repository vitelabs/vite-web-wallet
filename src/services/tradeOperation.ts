import sendTx from "utils/sendTx";
import { constant } from "@vite/vitejs";
import { getClient } from "utils/request";
import viteClient from "utils/viteClient"

const version = "v1";
const path = `${process.env.dexApiServer}${version}`;
const request = getClient(path, (xhr:XMLHttpRequest) => {
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
export function bindCode(code:number) {
  return new Promise((res, rej) => {
    sendTx({
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
      methodName: "callContract",
      data: {
        toAddress: constant.DexFund_Addr,
        abi: genCodeInterface
      },
      config: {
        pow: true
      }
    });
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
export function getInviteInfo(address:string):Promise<IInviterInfo> {
  return request({ method: "GET", path: "inviter", params: { address } });
}

export function getCode(address:string){
    return viteClient.request('dexfund_getInviterCode',address)
}
