import { viteClient } from "services/apiServer";
import { ChannelERC20 } from "./erc20";
import { ChannelVite } from "./vite";

class Client {
  private channelVite: ChannelVite;
  private channelEth: ChannelERC20;
  // private myEthAddress:string;
  // private myViteAddress:string;
  constructor({etherChannelAddress,viteChannelAddress,viteToeknId,etherTokenAddress,myViteAddress,myEthAddress}) {
    // this.myEthAddress=myEthAddress;
    // this.myViteAddress=myViteAddress;
    this.channelVite=new ChannelVite({
      address:viteChannelAddress
    });
    this.channelEth=new ChannelERC20({
      channelAddress: etherChannelAddress,
      tokenAddress: etherTokenAddress
    })
  }
  public getBalanceInfo(net, token,address) {
    // if(net==='ETH'&&token==='ETH'){
    //     //eth
    // }
    if (net === "ETH") {
      return this.channelEth.erc20Contract.balanceOf(address)
      //erc20
    }
    if (net === "vite") {
      //vite
      return this.channelVite.viteProvider.getBalanceInfo(token);
    }
  }
  public send(net, token, address, amount) {
    // if(net==='ETH'&&token==='ETH'){
    //     //eth
    // }
    if (net === "ETH") {
      //erc20
      // return this.channelEth.approveOutput()
      return this.channelEth.input(address, amount);
    }
    if (net === "vite") {
      //vite
      return this.channelVite.input(address, amount);
    }
  }
  public async approve(amount){
  return await  this.channelEth.approve(amount)
  }
}
