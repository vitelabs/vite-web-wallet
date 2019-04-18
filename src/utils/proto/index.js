import { root } from './protoClass';
import { random } from 'utils/random';
import { timer } from 'utils/asyncFlow';

const proto = root.lookupType('vite.DexProto');
const HEARTBEAT = 10000;
class WsProtoClient {
    constructor(wsUrl) {
        this.MESSAGETYPE = { SUB: 'sub', UNSUB: 'un_sub', PING: 'ping', PONG: 'pong', PUSH: 'push' };
        this._clientId = random(10);
        this._subKeys = {};

        this._heartBeat = new timer(() => {
            if (!this.ready) return;
            this.send('');
        }, HEARTBEAT);
        this._heartBeat.start();

        try {
            const connect = new WebSocket(wsUrl);
            this.connect = connect;
            connect.binaryType = 'arraybuffer';

            this._subKey && this.subscribe({ event_key: this._subKey });
            connect.onopen = () => {
                this.send('');
            };

            connect.onmessage = e => {
                const rootMessage = proto.lookupType('vite.DexProto');
                const data = rootMessage.decode(new Uint8Array(e.data));

                if (data.op_type !== this.MESSAGETYPE.PUSH) return;

                const realData = getRealData(data);
                const error = data.error_code || undefined;
                this._subKeys[data.event_key] && this._subKeys[data.event_key].forEach(c => {
                    c(realData, error);
                });
            };
        } catch (err) {
            console.warn(err);
        }
    }

    get ready() {
        return this.connect && this.connect.readyState === 1;
    }

    get closed() {
        return !this.connect || (this.connect && this.connect.readyState === 3);
    }

    sub(event, callback) {
        this._subKeys[event] = this._subKeys[event] || new Set();
        this._subKeys[event].add(callback);
        this.send(event, this.MESSAGETYPE.SUB);
    }

    unSub(event, callback) {
        if (!this._subKeys[event]) return;

        if (callback) {
            this._subKeys[event].delete(callback);
        } else {
            this._subKeys[event].clear();
        }

        this._subKeys[event].length === 0 && this.send(event, this.MESSAGETYPE.UNSUB);
    }

    send(event_key = '', type = this.MESSAGETYPE.PING) {
        if (!this.ready) return;

        const payload = {
            event_key: event_key,
            op_type: type,
            client_id: this._clientId,
            message: '',
            error_code: 0
        };

        const err = proto.verify(payload);
        if (err) throw Error(err);

        const message = proto.create(payload);
        const buffer = proto.encode(message).finish();
        this.connect.send(buffer);
    }
}

export const client = new WsProtoClient(process.env.pushServer);


function getRealData(data) {
    if (data.error_code) {
        return null;
    }

    const event_key = data.event_key;
    let key = null;
    if (/^order.vite_[a-zA-Z0-9]{50}.latest$/.test(event_key)) {
        key = 'OrderProto';
    } else if (/^market.tti_[a-zA-Z0-9]{24}-tti_[a-zA-Z0-9]{24}.kline.(minute|hour|day|week|month|year|minute15|minute30|hour2|hour4|hour6|hour12|month3|month6)$/.test(event_key)) {
        key = 'KlineProto';
    } else if (/^market.tti_[a-zA-Z0-9]{24}-tti_[a-zA-Z0-9]{24}.depth.latest$/.test(event_key)) {
        key = 'DepthListProto';
    } else if (/^market.tti_[a-zA-Z0-9]{24}-tti_[a-zA-Z0-9]{24}.detail.latest$/.test(event_key)) {
        key = 'TradePairProto';
    } else if (/^market.tti_[a-zA-Z0-9]{24}.details.latest$/.test(event_key)) {
        key = 'TradePairProto';
    } else if (/^market.tti_[a-zA-Z0-9]{24}-tti_[a-zA-Z0-9]{24}.trade.latest$/.test(event_key)) {
        key = 'TxLatestListProto';
    } else if (/market.tti_[a-zA-Z0-9]{24}-tti_[a-zA-Z0-9]{24}.order.vite_[a-zA-Z0-9]{50}.(history|current)$/.test(event_key)) {
        key = 'OrderListProto';
    }

    if (!key) {
        return null;
    }

    const listKey = [ 'TxLatestListProto', 'OrderListProto' ];

    const messageProto = proto.lookupType(`vite.${ key }`);
    const result = messageProto.decode(data.message);

    // console.log('proto', key, result);

    if (listKey.indexOf(key) !== -1) {
        return result && result.list ? result.list : null;
    }
    return result;
}
