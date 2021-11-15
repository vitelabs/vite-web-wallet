import { viteClient } from "services/apiServer"
import { ChannelERC20 } from "./erc20";
import {ChannelVite} from "./vite"

class Client{
    private channelVite:ChannelVite;
    private channelEth:ChannelERC20;
    constructor(){
        // const channelVite=new ChannelVite();
        // const channelEth=new ChannelERC20()
    }
    public getBalanceInfo(net,token){
        // if(net==='ETH'&&token==='ETH'){
        //     //eth
        // }
        if(net==='ETH'){
           return  this.channelEth.etherProvider.getBalance(token);
            //erc20
        }
        if(net==='vite'){
            //vite
            return this.channelVite.viteProvider.getBalanceInfo(token);
        }
    }
    public send(net,token,address,amount){
        // if(net==='ETH'&&token==='ETH'){
        //     //eth
        // }
        if(net==='ETH'){
            //erc20
            // return this.channelEth.approveOutput()
            return undefined;
        }
        if(net==='vite'){
            //vite
            return  this.channelVite.output(token,address,amount)
        }
    }
}