import { utils } from '@vite/vitejs';
import { root } from './protoClass';
import { random } from 'utils/random';
import { timer } from 'utils/asyncFlow';

const { _Buffer } = utils;
const DexProto = root.lookupType('vite.DexProto');
const HEARTBEAT = 10000;
const RetryInterval = 3000;
const MaxRetryTimes = 5;

class WsProtoClient {
    constructor(wsUrl, isRetry = true) {
        this.MESSAGETYPE = { SUB: 'sub', UNSUB: 'un_sub', PING: 'ping', PONG: 'pong', PUSH: 'push' };
        this.wsUrl = wsUrl;
        this.isRetry = isRetry;
        this._clientId = random(10);

        this.connect = null;
        this._subKeys = {};
        this.retryTimes = 0;

        this._heartBeat = new timer(() => {
            this.send('');
        }, HEARTBEAT);
        this._heartBeat.start();

        window.onbeforeunload = () => {
            this.close();
        };

        this.startConnect();
    }

    get ready() {
        return this.connect && this.connect.readyState === 1;
    }

    get closed() {
        return !this.connect || (this.connect && this.connect.readyState === 3);
    }

    startConnect() {
        // console.log('[New Wesocket]', this._clientId, new Date());

        try {
            const connect = new WebSocket(this.wsUrl);
            connect.binaryType = 'arraybuffer';

            this.connect = connect;

            connect.onopen = () => {
                this.send('');
                this._checkSubs();
            };

            connect.onclose = () => {
                // console.log('[WebSocket closed]');
                this.retryConnect();
            };

            connect.onmessage = e => {
                const data = DexProto.decode(_Buffer.from(e.data));
                if (data.op_type !== this.MESSAGETYPE.PUSH) {
                    // console.log(data);
                    return;
                }

                if (data.client_id !== this._clientId) {
                    // console.log('[ClientId 不一致]', data.client_id, this._clientId);
                    return;
                }

                const realData = getRealData(data);
                // console.log('Onmessage', data, JSON.stringify(realData));

                const error = data.error_code || undefined;
                this._subKeys[data.event_key] && this._subKeys[data.event_key].forEach(c => {
                    c && c(realData, error);
                });
            };
        } catch (err) {
            console.warn(err);
        }
    }

    close() {
        if (!this.connect) {
            return;
        }
        this.connect.onclose = function () {};
        this.connect.close();
    }

    retryConnect() {
        if (!this.isRetry || this.ready) {
            // console.log('[Retry but ready]', this.isRetry, this.ready);
            return;
        }

        // Offline: waiting for online
        if (navigator && !navigator.onLine) {
            // console.log('[Retry offLine]');
            window.addEventListener('online', () => {
                // console.log('[Retry onLine]');
                this.retryConnect();
            });
            return;
        }

        if (this.retryTimes > MaxRetryTimes) {
            // console.log('Over retryTimes && retryTimes = 0');
            this.retryTimes = 0;
            return;
        }

        setTimeout(() => {
            // console.log('Retry', this.retryTimes);
            this.startConnect();
            this.retryTimes++;
        }, RetryInterval);
    }

    sub(event, callback) {
        // console.log('[SUB]', event);
        this._subKeys[event] = this._subKeys[event] || new Set();
        this._subKeys[event].add(callback);
        this.send(event, this.MESSAGETYPE.SUB);
    }

    unSub(event, callback) {
        if (!event || !this._subKeys[event]) {
            // console.log('[UNSUB] fail, !this._subKeys[event]', event);
            return;
        }

        if (callback) {
            this._subKeys[event].delete(callback);
        } else {
            this._subKeys[event].clear();
        }

        if (this._subKeys[event].size !== 0) {
            // console.log('[UNSUB] fail, this._subKeys[event].size', event);
            return;
        }

        // console.log('[UNSUB] success', event);
        this.send(event, this.MESSAGETYPE.UNSUB);
    }

    send(event_key = '', type = this.MESSAGETYPE.PING) {
        if (!this.ready || this.closed) return;

        if (type === this.MESSAGETYPE.PING) {
            // console.log('ping', this._clientId, new Date());
        }

        const payload = {
            event_key: event_key,
            op_type: type,
            client_id: this._clientId,
            message: '',
            error_code: 0
        };

        const err = DexProto.verify(payload);
        if (err) throw Error(err);

        const message = DexProto.create(payload);
        const buffer = DexProto.encode(message).finish();
        this.connect.send(buffer);
    }

    _checkSubs() {
        // console.log('_checkSubs');
        for (const event in this._subKeys) {
            if (!this._subKeys[event] || !this._subKeys[event].size) {
                // console.log('_checkSubs send UNSUB', event);
                this.send(event, this.MESSAGETYPE.UNSUB);
            } else {
                // console.log('_checkSubs send SUB', event);
                this.send(event, this.MESSAGETYPE.SUB);
            }
        }
    }
}

export const client = new WsProtoClient(process.env.pushServer);

function getRealData(data) {
    if (data.error_code) {
        return null;
    }

    // 'market.CSTT-000_VITE-000.order.vite_553462bca137bac29f440e9af4ab2e2c1bb82493e41d2bc8b2.history';
    const event_key = data.event_key;
    let key = null;
    if (/^order.vite_[a-zA-Z0-9]{50}$/.test(event_key)) {
        key = 'OrderProto';
    } else if (/^market.(\w|\-)+.kline.(minute|hour|day|week|minute30|hour6|hour12)$/.test(event_key)) {
        key = 'KlineProto';
    } else if (/^market.(\w|\-)+.(depth.step[0-9]+|depth)$/.test(event_key)) {
        key = 'DepthListProto';
    } else if (/^market.(quoteToken|quoteTokenCategory).(\w|\-)+.tickers$/.test(event_key)) {
        key = 'TickerStatisticsProto';
    } else if (/^market.(\w|\-)+.tickers$/.test(event_key)) {
        key = 'TickerStatisticsProto';
    } else if (/^market.(\w|\-)+.trade$/.test(event_key)) {
        key = 'TradeListProto';
    } else if (/market.(\w|\-)+.order.vite_[a-zA-Z0-9]{50}.(history|open)$/.test(event_key)) {
        key = 'OrderListProto';
    }

    if (!key) {
        return null;
    }

    const listKey = [ 'TradeListProto', 'OrderListProto' ];

    const messageProto = root.lookupType(`vite.${ key }`);
    const result = messageProto.decode(data.message);

    // console.log('proto', key, result);

    if (listKey.indexOf(key) !== -1) {
        return result && result.list ? result.list : null;
    }
    return result;
}
