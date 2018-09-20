/**
 * 这是一个promise重试函数，重试promise操作，直到满足要求
 * @param {Function} createPromise 以该函数创建一个promise任务
 * @param {Function} test return Boolean;接受 promise结果参数{resolve,reject}，返回一个bool值，为true时停止重试。
 * @param {Number} interval 重试间隔
 * @param {Number} times 重试次数
 * @param {Number} timeout 重试时间
 */

export function doUntill({
    createPromise,
    test = ({
        resolve
    }) => resolve,
    interval = 3000,
    times = 100,
    timeout = 5 * 60 * 1000
}, ...args) {
    const that = this;
    return new Promise((res, rej) => {
        const initTime = Date.now();
        let t = 0;

        const tryAndTry = function () {
            t += 1;
            createPromise.call(that, ...args).then((result) => {
                if (test({
                    resolve: result
                })) {
                    return res(result);
                }
            }).catch(e => {
                if (test({
                    reject: e
                })) {
                    return rej(e);
                }
                if ((Date.now() - initTime) >= timeout || t === times) {
                    return rej('重试超限');
                }
                setTimeout(tryAndTry, interval);
            });
        };
        tryAndTry();
    });
}


export class timer {
    constructor(
        createPromise,interval = 1000,context=null,args
    ) {
        this.intervalConst = interval;
        this.diff = 0;
        this.lastTrigger = 0;
        this.timeHandler = null;
        this.context=context;
        this.createPromise=createPromise;
        this.args=args;
    }
    stop() {
        window.clearTimeout(this.timeHandler);
        this.timeHandler = null;
    }
    start() {
        if (this.timeHandler) {
            return;
        }
        const _task = () => window.setTimeout(() => {
            this.diff = Date.now() - this.lastTrigger;
            this.lastTrigger = Date.now();
            const triggered=this.trigger();
            if(!triggered.then){
                this.timeHandler = _task();
                return;
            }
            triggered.then(() => {
                this.timeHandler = _task();
            }).catch(() => {
                this.timeHandler = _task();
            });
        }, this.intervalConst - this.diff < 0 ? 0 : (this.intervalConst - this.diff));
        this.timeHandler = _task();
    }
    trigger() {
        return this.createPromise.call(this.context,this.args);
    }
}