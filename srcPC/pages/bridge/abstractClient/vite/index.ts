// ---------
// ---------
import { abi } from "@vite/vitejs";
import { constant } from "@vite/vitejs";
import _viteAbi from "./channel.json";
import { offChainCode } from "./offchainCode.json";
import { decodeLog } from "@vite/vitejs/distSrc/abi";
import { viteClient } from "services/apiServer";
import sendTx from "pcUtils/sendTx";

interface ConfirmedInfo {
  scannedHeight: string;
  index: string;
}

const VITE_INFO_PATH_PREFIX = "./.channel_vite/info";

const ConfirmedThreshold = 1;

export class ChannelVite {
  viteProvider: typeof viteClient;
  viteChannelAddress: string;

  viteChannelAbi: any[];
  viteOffChainCode: any;
  tokenId: string;

  constructor(cfg: { address; tokenId }) {
    this.viteChannelAbi = _viteAbi;
    this.viteOffChainCode = Buffer.from(offChainCode, "hex").toString("base64");
    this.viteProvider = viteClient;
    this.viteChannelAddress = cfg.address;
    this.tokenId = cfg.tokenId;
  }

  //   getInfo(prefix: string): any {
  //     let json = utils.readJson(this.infoPath + prefix);
  //     if (!json) {
  //       return json;
  //     }
  //     let info = JSON.parse(json);
  //     return info;
  //   }

  //   updateInfo(prefix: string, info: any) {
  //     utils.writeJson(this.infoPath + prefix, JSON.stringify(info));
  //   }

  async scanInputEvents(fromHeight: string) {
    console.log("vite", "scan input events", fromHeight);
    return this.scanEvents(fromHeight, "Input");
  }

  async scanInputProvedEvents(fromHeight: string) {
    console.log("vite", "scan proved events", fromHeight);
    return this.scanEvents(fromHeight, "InputProved");
  }

  async scanEvents(fromHeight: string, eventName: string) {
    const channelAddress = this.viteChannelAddress;
    let heightRange = {
      [channelAddress]: {
        fromHeight: (BigInt(fromHeight) + BigInt(1)).toString(),
        toHeight: "0",
      },
    };
    // console.log(JSON.stringify(heightRange));
    const vmLogs = await this.viteProvider.request("ledger_getVmLogsByFilter", {
      addressHeightRange: heightRange,
    });

    if (!vmLogs) {
      return {
        toHeight: fromHeight,
        events: [],
      };
    }
    const eventAbi = this.viteChannelAbi.find(
      (item: { name: string; type: string }) =>
        item.type === "event" && item.name === eventName
    );

    const events = vmLogs.filter((x: any) => {
      return this.encodeLogId(eventAbi) === x.vmlog.topics[0];
    });

    if (!events || events.length === 0) {
      return { toHeight: fromHeight, events: [] };
    }

    return {
      toHeight: fromHeight,
      events: events.map((input: any) => {
        const event: any = this.decodeEvent(
          input.vmlog,
          this.viteChannelAbi,
          eventName
        );
        return {
          event: event,
          height: input.accountBlockHeight,
          hash: input.accountBlockHash,
        };
      }),
    };
  }

  // filterInputLog(
  //   log: any,
  //   channelAbi: Array<{ name: string; type: string; }>,
  //   name: string
  // ) {

  //   const targetAbi = channelAbi.find(
  //     (item) => item.type === "event" && item.name === name
  //   );

  //   log.topics[0] ==
  //   const result = abi.decodeLog(
  //     channelAbi,
  //     Buffer.from(log.data ? log.data : "", "base64").toString("hex"),
  //     log.topics.slice(1, log.topics.length),
  //     ""
  //   );
  // }
  decodeEvent(
    log: any,
    channelAbi: Array<{ name: string; type: string }>,
    name: string
  ) {
    const result = abi.decodeLog(
      channelAbi,
      Buffer.from(log.data ? log.data : "", "base64").toString("hex"),
      log.topics.slice(1, log.topics.length),
      name
    );
    return Object.assign(result, { name: name });
  }

  decodeLog(log: any, channelAbi: Array<{ name: string; type: string }>) {
    // console.log(JSON.stringify(log));
    // console.log(JSON.stringify(channelAbi));
    // console.log(log, log['topics'], log['topics'][0]);
    const abiItem = channelAbi.find(
      (item) => this.encodeLogId(item) === log.topics[0]
    );

    // console.log(abiItem);
    const result = abi.decodeLog(
      channelAbi,
      Buffer.from(log.data ? log.data : "", "base64").toString("hex"),
      log.topics.slice(1, log.topics.length),
      abiItem?.name
    );
    return Object.assign(result, { name: abiItem?.name });
  }

  encodeLogId(item: { name: string; type: string }) {
    let id = "";
    if (item.type === "function") {
      id = abi.encodeFunctionSignature(item);
    } else if (item.type === "event") {
      id = abi.encodeLogSignature(item);
    }
    return id;
  }

  async input(address: string, value: string) {
    const sendResult = await writeContract(
      this.viteChannelAddress,
      this.viteChannelAbi,
      "input",
      [address, value],
      this.tokenId,
      value
    );
    return sendResult;
  }

  async inputIndex() {
    return readContract(
      this.viteProvider,
      this.viteChannelAddress,
      this.viteChannelAbi,
      this.viteOffChainCode,
      "inputIndex",
      []
    );
  }

  async prevInputId() {
    return readContract(
      this.viteProvider,
      this.viteChannelAddress,
      this.viteChannelAbi,
      this.viteOffChainCode,
      "prevInputId",
      []
    );
  }

  async outputIndex() {
    return readContract(
      this.viteProvider,
      this.viteChannelAddress,
      this.viteChannelAbi,
      this.viteOffChainCode,
      "outputIndex",
      []
    );
  }

  async prevOutputId() {
    return readContract(
      this.viteProvider,
      this.viteChannelAddress,
      this.viteChannelAbi,
      this.viteOffChainCode,
      "prevOutputId",
      []
    );
  }

  async approvedCnt(id: string) {
    return readContract(
      this.viteProvider,
      this.viteChannelAddress,
      this.viteChannelAbi,
      this.viteOffChainCode,
      "approvedCnt",
      [id]
    );
  }
  async approvedKeepers(id: string, address: string) {
    return readContract(
      this.viteProvider,
      this.viteChannelAddress,
      this.viteChannelAbi,
      this.viteOffChainCode,
      "approvedKeepers",
      [id, address]
    );
  }
}

async function writeContract(
  to: string,
  abi: Array<{ name: string; type: string }>,
  methodName: string,
  params: any[],
  tokenId: string,
  amount: string
) {
  const methodAbi = abi.find((x) => {
    return x.name === methodName && x.type === "function";
  });
  if (!methodAbi) {
    throw new Error("method not found: " + methodName);
  }
  const result = await sendTx({
    methodName: "callContract",
    data: {
      abi: methodAbi,
      toAddress: to,
      params: params,
      tokenId: tokenId,
      amount: amount,
    },
    abi,
  });
  return result;
}

async function readContract(
  provider: any,
  to: string,
  abi: Array<{ name: string; type: string }>,
  code: any,
  methodName: string,
  params: any[]
) {
  const methodAbi = abi.find((x) => {
    return x.type === "offchain" && x.name === methodName;
  });
  if (!methodAbi) {
    throw new Error("method not found:" + methodName);
  }

  // console.log(to, methodAbi);
  return provider.callOffChainContract({
    address: to,
    abi: methodAbi,
    code: code,
    params: params,
  });
}

export async function confirmed(provider: any, hash: string) {
  return provider
    .request("ledger_getAccountBlockByHash", hash)
    .then((block: any) => {
      if (!block) {
        return false;
      } else {
        if (!block.confirmedHash) {
          return false;
        }
        if (block.confirmedTimes < ConfirmedThreshold) {
          return false;
        }
        return true;
      }
    });
}

window.vite = ChannelVite;
