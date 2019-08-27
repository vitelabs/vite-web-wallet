import { getClient } from "utils/request";
import { utils } from "@vite/vitejs";
import sendTx from "utils/sendTx";
import { addrSpace } from "utils/storageSpace";
import i18n from "i18n";

const langMap = {
  zh: "zh-cn",
  "zh-Hans": "zh-cn",
  en: "en"
};

const STORAGEKEY = "INDEX_COLLECT_TOKEN";

const client = getClient(
  "",
  xhr => {
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
  },
  { lang: langMap[i18n.locale], version: "v1.0" }
);
export const getGateInfos = () =>
  client({
    path: "registration/certified_gateways",
    host: process.env.gatewayInfosServer
  });

export const getChargeAddr = ({ tokenId, addr: walletAddress }, url) =>
  client({
    path: "deposit-info",
    params: { tokenId, walletAddress },
    host: url
  });

export const verifyAddr = ({ tokenId, withdrawAddress,label }, url) =>
  client({
    path: "withdraw-address/verification",
    params: { tokenId, withdrawAddress,label },
    host: url
  });

export const getWithdrawInfo = ({ tokenId, walletAddress }, url) =>
  client({
    path: "withdraw-info",
    params: { tokenId, walletAddress },
    host: url
  });

export function getWithdrawFee(
  { tokenId, walletAddress, amount, containsFee = false },
  url
) {
  return client({
    path: "withdraw-fee",
    params: { tokenId, walletAddress, amount, containsFee },
    host: url
  });
}

export const getMetaInfo = ({ tokenId }, url) =>
  client({
    path: "meta-info",
    params: { tokenId },
    host: url
  });

export const getDepositInfo = ({ tokenId, addr: walletAddress }, url) =>
  client({
    path: "deposit-info",
    params: { tokenId, walletAddress },
    host: url
  });

export const withdraw = async ({
  amount,
  withdrawAddress,
  gateAddr,
  tokenId,
  type,
  fee,
  labelValue = "",
  labelName
}) => {
  if (type !== 0 && type !== 1) {
    throw new Error("unexcepted address type");
  }
  if (!withdrawAddress) {
    throw new Error("lack withdrawAddress");
  }
  const data =
    type === 0
      ? Buffer.concat([
          Buffer.from(utils.hexToBytes("0bc3")),
          Buffer.from([type]),
          Buffer.from(withdrawAddress)
        ]).toString("base64")
      : Buffer.concat([
          Buffer.from(utils.hexToBytes("0bc3")),
          Buffer.from([type]),
          Buffer.from([Buffer.from(withdrawAddress).length]),
          Buffer.from(withdrawAddress),
          Buffer.from([Buffer.from(labelValue).length]),
          Buffer.from(labelValue)
        ]).toString("base64");

  return await sendTx({
    methodName: "asyncSendTx",
    data: {
      toAddress: gateAddr,
      amount,
      tokenId,
      data
    },
    config: {
      pow: true,
      powConfig: { isShowCancel: true }
    },
    vbExtends: {
      type: "crossChainTransfer",
      fee,
      labelTitle:
        type === 1
          ? {
              name: {
                base: labelName,
                zh: labelName
              }
            }
          : undefined
    }
  });
};

export function getWithdrawRecords(
  { tokenId, walletAddress, pageNum, pageSize },
  url
) {
  return client({
    path: "withdraw-records",
    params: { tokenId, walletAddress, pageNum, pageSize },
    host: url
  });
}

export function getDepositRecords(
  { tokenId, walletAddress, pageNum, pageSize },
  url
) {
  return client({
    path: "deposit-records",
    params: { tokenId, walletAddress, pageNum, pageSize },
    host: url
  });
}

class GateWays {
  public data: any;
  constructor() {
    if (!Array.isArray(addrSpace.getItem(STORAGEKEY))) {
      addrSpace.setItem(STORAGEKEY, []);
    }
    this.updateFromStorage();
  }

  bindToken(tokenId, tokenInfo) {
    this.updateFromStorage();
    const index = this.data.findIndex(t => t.tokenId === tokenId);
    if (index < 0) {
      this.data.push({ tokenId, ...tokenInfo });
    } else {
      this.data[index] = { tokenId, ...tokenInfo };
    }
    this.saveToStorage();
  }

  bindTokens(tokens) {
    this.updateFromStorage();
    this.data = this.data.filter(
      t => tokens.map(n => n.tokenId).indexOf(t.tokenId) === -1
    ); // 去掉data中已有的。
    this.data = this.data.concat(tokens);
    this.saveToStorage();
  }

  unbindToken(tokenId) {
    this.updateFromStorage();
    this.data = this.data.filter(v => v.tokenId !== tokenId);
    this.saveToStorage();
  }

  saveToStorage() {
    addrSpace.setItem(STORAGEKEY, this.data);
  }

  updateFromStorage() {
    const s = addrSpace.getItem(STORAGEKEY); // [{tokenId,gateInfo}]
    if (s) {
      this.data = s;
    } else {
      addrSpace.setItem(STORAGEKEY, []);
      this.data = [];
    }
  }
}

export const gateStorage = new GateWays();
