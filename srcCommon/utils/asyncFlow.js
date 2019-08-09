export class timer {
    constructor(loopFunc, interval = 1000) {
        this.interval = interval;
        this.timeHandler = null;
        this.loopFunc = loopFunc;
    }

    stop() {
        window.clearTimeout(this.timeHandler);
        this.timeHandler = null;
        this.loopFunc = null;
    }

    start() {
        if (this.timeHandler || !this.loopFunc) {
            return;
        }

        // Exec immediately for once
        this.loopFunc();
        const _task = () => {
            if (!this.loopFunc) {
                return;
            }

            this.timeHandler = window.setTimeout(() => {
                const triggered = this.loopFunc();

                // Normal function
                if (!triggered || !(triggered instanceof Promise) || !triggered.then) {
                    return _task();
                }

                // Promise
                triggered.then(() => {
                    _task();
                }).catch(() => {
                    _task();
                });
            }, this.interval);
        };

        _task();
    }
}

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
    test = ({ resolve }) => resolve,
    interval = 3000,
    times = 100,
    timeout = 5 * 60 * 1000
}, ...args) {
    const that = this;
    const timesControl = times > 0;
    const timeoutControl = timeout > 0;

    return new Promise((res, rej) => {
        const initTime = Date.now();
        let t = 0;

        const tryAndTry = function () {
            t += 1;
            createPromise.call(that, ...args).then(result => {
                if (test({ resolve: result })) {
                    return res(result);
                }
                setTimeout(tryAndTry, interval);
            }).catch(e => {
                if (test({ reject: e })) {
                    return rej(e);
                }

                if (timeoutControl && (Date.now() - initTime) >= timeout || timesControl && t >= times) {
                    return rej('重试超限');
                }

                setTimeout(tryAndTry, interval);
            });
        };
        tryAndTry();
    });
}
