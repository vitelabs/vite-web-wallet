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

export function depthBuyWs({ ftoken, ttoken }) {
    const key = `market.${ftoken}-${ttoken}.depth.buy`;
    return key;
}
export function depthSellWs({ ftoken, ttoken }) {
    const key = `market.${ftoken}-${ttoken}.depth.sell`;
    return key;

}
export const defaultPairWs = function ({
    ttoken
}) {
    // `market.${ttokenId}.details.latest`
    const key = `market.${ttoken}.details.latest`;
    return key;
};

export const assignPairWs = function ({
    ftoken, ttoken
}) {
    const key = `market.${ftoken}-${ttoken}.detail.latest`;
    return key;
};

export const latestTxWs = function ({
    ftoken, ttoken
}) {
    const key = `market.${ftoken}-${ttoken}.trade.latest`;
    return key;
};
export const latestOrderWs = function ({ address }) {
    const key = `order.${address}.latest`;
    return key;

};
const httpServicesMap = {
    depthBuy,
    depthSell,
    defaultPair,
    assignPair,
    latestTx,
    latestOrder: () => Promise.resolve(null)
};
const wsServicesMap = {
    depthBuy: depthBuyWs,
    depthSell: depthSellWs,
    defaultPair: defaultPairWs,
    assignPair: assignPairWs,
    latestTx: latestTxWs,
    latestOrder: latestOrderWs
};

// http+ws 订阅任务；
// 1，第一次启动以http方式拉全量数据；
// 2，ws订阅失败时以轮询代替
// 3，支持参数更新时自动切换订阅key
// 4，todo ws自动恢复
export class subTask extends timer {
    constructor(key, callback, interval) {
        super();
        this.interval = interval;
        this.loopFunc = () => {
            // use http if sub unavalible
            if (!client.closed && this.subStatus) {
                return;
            }

            let args = this.args;
            httpServicesMap[this.key] && httpServicesMap[this.key](args).then((data) => {
                this.callback && this.callback({
                    args, data
                });
            });
        };

        this.key = key;
        this.subKey = '';
        this.args = [];
        this.callback = callback;
        this.subStatus = true;
    }
    start(argsGetter) {
        this.argsGetter = argsGetter;
        super.start();

        // get all data from http at first
        let args = this.args;
        httpServicesMap[this.key] && httpServicesMap[this.key](args).then((data) => {
            this.callback && this.callback({
                args, data
            });
        });
    }
    get args() {
        const args = this.argsGetter();
        this.subKey = wsServicesMap[this.key](args);
        return args;
    }
    set args(value){
        this._args=value;
    }
    get subKey(){
        return this._subKey;
    }
    set subKey(v){
        if (this._subKey === v) return;

        const oldkey = this.subKey;
        this._subKey = v;
        if (!this.timeHandler) return;

        client.unSub(oldkey, this.callback);

        let args = this.args;
        client.sub(this.subKey, (data) => {
            this.callback && this.callback({ 
                args, data 
            });
        }, (data, err) => {
            if (err) {
                this.subStatus = false;
                this.subKey = '';
            } else {
                this.callback(data);
            }
        });
    }
    stop() {
        super.stop();
        this.args = [];
    }
}