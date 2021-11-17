import { ConversionAPI } from "pcServices/apiServer";

export const bind = function({
  pub_key,
  eth_tx_hash,
  eth_addr,
  vite_addr,
  value,
  signature,
}) {
  return ConversionAPI.request({
    path: "/bind",
    method: "POST",
    params: { pub_key, eth_tx_hash, eth_addr, vite_addr, value, signature },
    timeout: 30000,
  });
};

export const balance = function({ address }) {
  return ConversionAPI.request({
    path: "/balance",
    method: "GET",
    params: { address, token: "VITE" },
    timeout: 30000,
  });
};

export const getTxs = function(params: {
  from: string;
  to: string;
  fromAddress: string;
  toAddress: string;
  desc: boolean;
}): Promise<{
  id: string;
  idx: number;
  amount: string;
  fromAddress: string;
  toAddress: string;
  fromHash: string;
  toHash: string;
}[]> {
  return ConversionAPI.request({
    path: "/txs",
    method: "GET",
    params: params,
    timeout: 30000,
  });
};

export const getTx = function(params: {
  from: string;
  to: string;
  id: string;
}): Promise<{
  id: string;
  idx: number;
  amount: string;
  fromAddress: string;
  toAddress: string;
  fromHash: string;
  toHash: string;
}> {
  return ConversionAPI.request({
    path: "/tx",
    method: "GET",
    params: params,
    timeout: 30000,
  });
};
