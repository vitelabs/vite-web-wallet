// order.$address.latest;
import { client } from './index';
import { timer } from 'utils/asyncFlow';
import {
    depthBuy,
    depthSell,
    defaultPair,
    assignPair,
    latestTx
} from 'services/exchange';

export function depthBuyWs({ ftoken, ttoken }, cb) {
    const key = `market.${ftoken}-${ttoken}.depth.buy`;
    // market.$ftokenId_$ttokenId.depth.buy;
    client.sub(key, cb);
    return key;
}
export function depthSellWs({ ftoken, ttoken }, cb) {
    const key = `market.${ftoken}-${ttoken}.depth.sell`;
    client.sub(key, cb);
    return key;

}
export const defaultPairWs = function ({
    ttoken
}, cb) {
    // `market.${ttokenId}.details.latest`
    const key = `market.${ttoken}.details.latest`;
    client.sub(key, cb);
    return key;

};

export const assignPairWs = function ({
    ftoken, ttoken
}, cb) {
    const key = `market.${ftoken}-${ttoken}.detail.latest`;
    client.sub(key, cb);
    return key;
};

export const latestTxWs = function ({
    ftoken, ttoken
}, cb) {
    const key = `market.${ftoken}-${ttoken}.trade.latest`;
    client.sub(key, cb);
    return key;
};

const httpServicesMap = {
    depthBuy,
    depthSell,
    defaultPair,
    assignPair,
    latestTx
};
const wsServicesMap = {
    depthBuy: depthBuyWs,
    depthSell: depthSellWs,
    defaultPair: defaultPairWs,
    assignPair: assignPairWs,
    latestTx: latestTxWs
};

// http+ws 订阅任务；
// 1，第一次启动以http方式拉全量数据；
// 2，ws订阅失败时以轮询代替
// 3，支持参数更新；
// 4，todo ws自动恢复
export class subTask extends timer {
    constructor(key, callback, interval) {
        super();
        this.interval = interval;
        this.loopFunc = () => {
            if (!client.closed && this.subStatus) return;// use http if sub unavalible
            httpServicesMap[this.key] && httpServicesMap[this.key](...this.args).then(this.callback);
        };
        this.key = key;
        this.subKey = '';
        this.args = [];
        this.callback = callback;
        this.subStatus = true;
    }
    start(...args) {
        args.length > 0 && (this.args = args);
        httpServicesMap[this.key] && httpServicesMap[this.key](...this.args).then(this.callback);// get all data from http at first
        super.start();
        this.updateArgs(...args);
    }
    stop() {
        super.stop();
        this.key = '';
        this.args = [];
    }
    updateArgs(...args) {
        this.subKey && client.unSub(this.subKey);
        this.args = args;
        if (this.timeHandler) {
            this.subKey = wsServicesMap[this.key](...this.args, (data, err) => {
                if (err) {
                    this.subStatus = false;
                    this.subKey = '';
                } else {
                    this.callback(data);
                }
            });
        }
    }
}