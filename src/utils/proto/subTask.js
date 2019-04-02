import { client } from './index';
import { timer } from 'utils/asyncFlow';
import { depth, defaultPair, assignPair, latestTx, order } from 'services/exchange';

export function depthWs({ ftoken, ttoken }) {
    const key = `market.${ ftoken }-${ ttoken }.depth.latest`;
    return key;
}

export const defaultPairWs = function ({ ttoken }) {
    const key = `market.${ ttoken }.details.latest`;
    return key;
};

export const assignPairWs = function ({ ftoken, ttoken }) {
    const key = `market.${ ftoken }-${ ttoken }.detail.latest`;
    return key;
};

export const latestTxWs = function ({ ftoken, ttoken }) {
    const key = `market.${ ftoken }-${ ttoken }.trade.latest`;
    return key;
};

export const latestOrderWs = function ({ address }) {
    const key = `order.${ address }.latest`;
    return key;
};

export const orderQueryHistoryWs = function ({ ftoken, ttoken, address }) {
    const key = `market.${ ftoken }-${ ttoken }.order.${ address }.history`;
    return key;
};

export const orderQueryCurrentWs = function ({ ftoken, ttoken, address }) {
    const key = `market.${ ftoken }-${ ttoken }.order.${ address }.current`;
    return key;
};

export const klineWs = function ({ ftoken, ttoken, resolution }) {
    const key = `market.${ ftoken }-${ ttoken }.kline.${ resolution }`;
    return key;
};

const httpServicesMap = {
    depth,
    defaultPair,
    assignPair,
    latestTx,
    orderQueryHistory: ({ ftoken, ttoken, address }) => order({
        address,
        ttoken,
        ftoken,
        pageNo: 1,
        pageSize: 10,
        status: 0,
        paging: 0
    }),
    orderQueryCurrent: ({ ftoken, ttoken, address }) => order({
        address,
        ttoken,
        ftoken,
        pageNo: 1,
        pageSize: 10,
        status: 1,
        paging: 0
    })
};
const wsServicesMap = {
    depth: depthWs,
    defaultPair: defaultPairWs,
    assignPair: assignPairWs,
    latestTx: latestTxWs,
    latestOrder: latestOrderWs,
    orderQueryHistory: orderQueryHistoryWs,
    orderQueryCurrent: orderQueryCurrentWs,
    kline: klineWs
};

// Http+ws 订阅任务；

// 1，第一次启动以http方式拉全量数据；
// 2，ws订阅失败时以轮询代替
// 3，支持参数更新时自动切换订阅key
// 4，todo ws自动恢复
export class subTask extends timer {
    constructor(key, callback, interval) {
        super();
        this.interval = interval;
        this.loopFunc = () => {
            // Use http if sub unavalible or the func is not exist.
            if ((!client.closed && this.subStatus)
                || !httpServicesMap[this.key]) {
                return;
            }

            const args = this.args;
            const key = this.subKey;
            httpServicesMap[this.key] && httpServicesMap[this.key](args).then(data => {
                if (this.subKey !== key) {
                    return;
                }
                if (this.key.indexOf('orderQuery') !== -1) {
                    data = data.orders || [];
                }
                this.callback && this.callback({ args, data });
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

        // Get all data from http at first
        const args = this.args;
        const key = this.subKey;

        httpServicesMap[this.key] && httpServicesMap[this.key](args).then(data => {
            if (this.subKey !== key) {
                return;
            }
            // The data should be same as the orderQueryWs return.
            if (this.key.indexOf('orderQuery') !== -1) {
                data = data.orders || [];
            }
            this.callback && this.callback({ args, data });
        });
    }

    get args() {
        const args = this.argsGetter();
        this.subKey = wsServicesMap[this.key](args);
        return args;
    }

    set args(value) {
        this._args = value;
    }

    get subKey() {
        return this._subKey;
    }

    set subKey(v) {
        if (this._subKey === v) return;

        const oldkey = this.subKey;
        this._subKey = v;

        if (!this.timeHandler) return;

        client.unSub(oldkey, this.callback);
        const args = this.args;
        const key = this.subKey;

        client.sub(this.subKey, data => {
            if (this.subKey !== key) {
                return;
            }
            console.log(this.subKey, data);
            this.callback && this.callback({ args, data });
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
