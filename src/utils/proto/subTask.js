import { client } from './index';
import { timer } from 'utils/asyncFlow';
import { httpServicesMap, wsServicesMap } from './subService';

// Http + ws 订阅任务；

// 1，第一次启动以http方式拉全量数据；
// 2，ws订阅失败时以轮询代替
// 3，支持参数更新时自动切换订阅key
// 4，todo ws自动恢复

export class subTask extends timer {
    constructor(key, callback, interval = 2000) {
        if (!httpServicesMap[key] && !wsServicesMap[key]) {
            throw new Error('[subTask] constructor key error, check please.');
        }

        super();

        this.key = key;
        this.interval = interval;
        this.callback = (...args) => {
            callback && callback(...args);
        };

        this.argsGetter = null;
        this._subKey = null;
        this.subCallback = null;

        this.loopFunc = () => {
            // Every loop will update subKey
            // console.log('[subTask] Every loop will update subKey');
            this.subKey = wsServicesMap[this.key](this.args);

            // Use http if sub unavalible
            if (!client.closed || !httpServicesMap[this.key]) {
                return;
            }

            this.httpRequest();
        };
    }

    get args() {
        return this.argsGetter ? this.argsGetter() : null;
    }

    get subKey() {
        return this._subKey;
    }

    set subKey(currentKey) {
        // Already stopped
        if (!this.timeHandler) {
            // console.log('[subTask] Already stopped');
            return;
        }

        // SubKey is not change, now.
        const oldkey = this._subKey;
        if (oldkey === currentKey) {
            // console.log('[subTask] SubKey is not change, now.');
            return;
        }

        // Unsub oldKey
        // console.log('[subTask] Unsub oldKey');
        client.unSub(oldkey, this.subCallback);

        // Update subKey and subCallback.
        // console.log('[subTask] Update subKey and subCallback.');
        const args = this.args;
        this._subKey = currentKey;
        this.subCallback = data => {
            // May be last sub return, but subKey already changed
            if (this.subKey !== currentKey) {
                // console.log('[subTask] May be last sub return, but subKey already changed');
                return;
            }

            // console.log('[subTask]', this.subKey, data);
            this.callback({ args, data });
        };

        // Sub currentKey
        client.sub(currentKey, this.subCallback);
    }

    start(argsGetter, isNeedAllDataFirst = true) {
        if (!argsGetter) {
            throw new Error('[subTask] check argsGetter please. Required and must be a function.');
        }

        // Init
        this.argsGetter = argsGetter;
        this.subKey = wsServicesMap[this.key](this.args);
        super.start();

        // Get all data from http at first if need
        isNeedAllDataFirst && this.httpRequest();
    }

    stop() {
        super.stop();

        client.unSub(this.subKey, this.subCallback);
        this.argsGetter = null;
        this._subKey = null;
    }


    httpRequest() {
        const args = this.args;
        const currentKey = this.subKey;

        httpServicesMap[this.key] && httpServicesMap[this.key](args).then(data => {
            // Async request, maybe subkey already changed.
            if (this.subKey !== currentKey) {
                return;
            }

            // OrderQuery: http-requtn-data should be same as ws-return-data
            if (this.key.indexOf('orderQuery') !== -1) {
                data = data.orders || [];
            }
            this.callback({ args, data });
        });
    }
}
