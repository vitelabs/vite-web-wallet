import { ethers, Contract, utils } from "ethers";
import _channelAbi from "./channel.json";
import _keeperAbi from "./keeper.json";
import _erc20Abi from "./erc20.json";
interface ConfirmedInfo {
  height: string;
  txIndex: number;
  logIndex: number;

  index: string;
}

interface Input {
  id: string;
  index: string;

  height: number;
  txIndex: number;
  logIndex: number;
}

const ConfirmedThreshold = BigInt(0);
export class ChannelERC20 {
  infoPath: string;

  etherChannelAddress: string;
  tokenAddress:string;
  etherChannelAbi: any[];
  erc20Abi:any[];
  etherProvider: ethers.providers.Web3Provider;
  etherChannelContract: ethers.Contract;
  erc20Contract: ethers.Contract;



  constructor(cfg: {
    channelAddress:string;
    tokenAddress:string;
  }) {
    this.etherChannelAbi = _channelAbi;
    this.erc20Abi=_erc20Abi;
    this.etherChannelAddress = cfg.channelAddress;
    this.tokenAddress = cfg.tokenAddress;

    this.etherProvider = new ethers.providers.Web3Provider(window.ethereum);
    this.etherChannelContract = new ethers.Contract(
      this.etherChannelAddress,
      this.etherChannelAbi,
      this.etherProvider
    );

    this.erc20Contract=new ethers.Contract(
      this.tokenAddress,
      this.erc20Abi,
      this.etherProvider
    );


  }

  async approve( amount) {
    return await this.erc20Contract.approve(this.etherChannelContract.address, amount);
  }

  async balanceOf(address) {
    return await this.erc20Contract.balanceOf(address);
  }

  // getInfo(prefix: string): any {
  //   let json = utils.readJson(this.infoPath + prefix);
  //   if (!json) {
  //     return json;
  //   }
  //   let info = JSON.parse(json);
  //   return info;
  // }

  // updateInfo(prefix: string, info: any) {
  //   utils.writeJson(this.infoPath + prefix, JSON.stringify(info));
  // }

  async scanConfirmedInputs(fromHeight: string) {
    const current = await this.etherProvider.getBlockNumber();

    const toHeight = BigInt(current) - ConfirmedThreshold;

    // if (toHeight <= BigInt(fromHeight)) {
    //   return [fromHeight, null];
    // }

    const filterInput = this.etherChannelContract.filters.Input(
      null,
      null,
      null,
      null
    );

    const inputs = await this.etherChannelContract.queryFilter(
      filterInput,
      +fromHeight,
      +toHeight.toString()
    );

    if (!inputs || inputs.length === 0) {
      return { toHeight, inputs: [] };
    }
    return {
      toHeight,
      inputs: inputs.map((input: any) => {
        return {
          id: input.args.id,
          index: input.args.index,
          height: input.blockNumber,
          txIndex: input.transactionIndex,
          logIndex: input.logIndex,
          event: input.args,
        };
      }),
    };
  }




  // async signId(id: string) {
  //   const signingKey = new ethers.utils.SigningKey(this.signerKey);
  //   return signingKey.signDigest(id);
  // }
  async output(id: string, address: string, value: string) {
    return this.etherChannelContract.output(id, address, value);
  }
  async input(address: string, value: string) {
    return this.etherChannelContract.output(address, value);
  }
  async inputIndex() {
    return this.etherChannelContract.inputIndex();
  }

  async prevInputId() {
    return this.etherChannelContract.prevInputId();
  }

  async outputIndex() {
    return this.etherChannelContract.outputIndex();
  }

  async prevOutputId() {
    return this.etherChannelContract.prevOutputId();
  }

  async token() {
    return this.etherChannelContract.token();
  }


}
