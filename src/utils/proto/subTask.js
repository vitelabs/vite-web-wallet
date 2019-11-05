import { WsProtoClient } from './index';
import { timer } from 'utils/asyncFlow';
import { onReady, Server } from 'services/dnsHostIP';
import { httpServicesMap, wsServicesMap } from './subService';

// Http + ws 订阅任务；

// 1，第一次启动以http方式拉全量数据；
// 2，ws订阅失败时以轮询代替
// 3，支持参数更新时自动切换订阅key
// 4，ws自动恢复

let client = null;

if (Server.isReady) {
    client = new WsProtoClient(Server.dexPush.url);
} else {
    onReady(() => {
        client = new WsProtoClient(Server.dexPush.url);
    });
}

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

        this.loopFunc = isForce => {
            // Every loop will update subKey
            // console.log('[subTask] Every loop will update subKey');
            this.subKey = wsServicesMap[this.key](this.args);

            if (isForce) {
                this.httpRequest();
                return;
            }

            // Use http if sub unavalible
            if (client && !client.closed) {
                return;
            }
            this.httpRequest();
        };

        // If websocket retry success, maybe no all data in it
        window.addEventListener('online', () => {
            // Update subkey and reload all data.
            this.loopFunc && this.loopFunc(true);
        });
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
        client && client.unSub(oldkey, this.subCallback);

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
        client && client.sub(currentKey, this.subCallback);
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
        if (!isNeedAllDataFirst) {
            return Promise.resolve();
        }
        return this.httpRequest();
    }

    stop() {
        super.stop();

        client && client.unSub(this.subKey, this.subCallback);
        this.argsGetter = null;
        this._subKey = null;
    }

    httpRequest() {
        const args = this.args;
        const currentKey = this.subKey;

        if (!httpServicesMap[this.key]) {
            return Promise.resolve();
        }

        return httpServicesMap[this.key](args).then(data => {
            // Async request, maybe subkey already changed.
            if (this.subKey !== currentKey) {
                return;
            }
            this.callback({ args, data });
        });
    }
}
