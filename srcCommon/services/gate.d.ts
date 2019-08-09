import { TokenId, Address } from "@vite/vitejs";

type responseWrapper<T> = {
  code: number;
  msg: string;
  data: T;
  error?: string;
  subCode?: number;
};
type client = (params: any) => Promise<any>;

//----------gateinfo
type GateTokenInfo = {
  tokenId: TokenId;
  gateway: string;
  mappedNet: string;
  mappedTokenId: string;
};

type depositInfo = {
  depositAddress: string;
  minimumDepositAmount: string;
  confirmationCount: number;
  noticeMsg: string;
};
export declare function getDepositInfo(
  { tokenId, addr }: { tokenId: string; addr: string },
  url: string
): Promise<depositInfo>;
type GateInfo = {
  name: string; //网关名称
  url: string; //网关host，后面的请求为该网关host与url拼接而成
  tokens: Array<GateTokenInfo>;
};

type withdrawInfo = {
  minimumWithdrawAmount: String;
  maximumWithdrawAmount: String;
  gatewayAddress: String;
  noticeMsg: string;
};
export declare function getWithdrawInfo({
  tokenId,
  addr
}): Promise<withdrawInfo>;

type metaInfo = {
  type: 0 | 1;
  depositState: "OPEN" | "MAINTAIN" | "CLOSED";
  withdrawState: "OPEN" | "MAINTAIN" | "CLOSED";
};
export declare function getMetaInfo({ tokenId }): Promise<>;

declare function getGateInfos(): Promise<GateInfo[]>;

//---------deposit records
type getDepositRecordsParams = {
  tokenId: TokenId;

  walletAddress: Address;

  pageNum: number;

  pageSize: number;
};

declare enum depositStatus {
  OPPOSITE_PROCESSING, //外链交易进行中，等待足够确认数
  OPPOSITE_CONFIRMED, //网关已确认外链交易
  BELOW_MINIMUM, //外链交易金额小于最小充值金额，充值流程结束
  TOT_PROCESSING, //网关已发出tot置换交易
  TOT_CONFIRMED //网关已确认tot置换交易，充值流程结束
}
type depositRecord = {
  inTxHash: string;
  outTxHash: string;
  amount: string;
  fee: string;
  state: depositStatus;
  dateTime: number;
};

type depositRecordRep = {
  totalCount: number;
  depositRecords: depositRecord[];
  inTxExplorerFormat: string; // "https://ropsten.etherscan.io/tx/{$tx}",//外链浏览器，用inTxHash替换{$tx}为该交易区块浏览器地址
  outTxExplorerFormat: string; // "http://132.232.134.168:8080/zh/transaction/{$tx}"//vite链浏览器，用outTxHash替换{$tx}为该交易区块浏览器地址
};
export declare function getDepositRecords(
  params: getDepositRecordsParams,
  url: string
): Promise<depositRecordRep>;

//withdraw records
type getWithdrawRecordsParams = {
  tokenId: TokenId;

  walletAddress: Address;

  pageNum: number;

  pageSize: number;
};

declare enum withdrawStatus {
  TODO, //：vite tot交易待处理
  TOT_PROCESSING, //：vite tot交易已发送，等待足够确认数
  TOT_NOT_RECEIVED, //：vite tot交易失败，提现流程结束
  TOT_CONFIRMED, //：网关已确认vite tot交易
  OPPOSITE_PROCESSING, //：网关已发出外链转账交易
  OPPOSITE_CONFIRMED //：网关已确认外链转账交易，提现流程结束
}
type withdrawRecord = {
  inTxHash: string; //vite链tot置换交易hash
  outTxHash: string; //外链提现交易hash
  amount: string; //提现实际到账金额
  fee: string; //提现手续费
  state: withdrawStatus; //状态
  dateTime: number; //充值时间，CST时间，前端需要本地化
};

type withdrawRecordRep = {
  totalCount: number;
  withdrawRecords: withdrawRecord[];
  inTxExplorerFormat: string; // "https://ropsten.etherscan.io/tx/{$tx}",//外链浏览器，用inTxHash替换{$tx}为该交易区块浏览器地址
  outTxExplorerFormat: string; // "http://132.232.134.168:8080/zh/transaction/{$tx}"//vite链浏览器，用outTxHash替换{$tx}为该交易区块浏览器地址
};

export declare function getWithdrawRecords(
  params: getWithdrawRecordsParams,
  url: string
): Promise<withdrawRecordRep>;
