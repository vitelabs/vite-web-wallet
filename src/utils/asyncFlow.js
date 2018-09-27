export default class timer {
    constructor( loopFunc, interval = 1000 ) {
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
        if (this.timeHandler) {
            return;
        }

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
