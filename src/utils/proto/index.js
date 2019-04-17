import { root } from './protoClass';
import { random } from 'utils/random';
import { timer } from 'utils/asyncFlow';

const proto = root.lookupType('vite.DexProto');
const HEARTBEAT = 10000;
class WsProtoClient {
    constructor(wsUrl) {
        this.MESSAGETYPE = { SUB: 'sub', UNSUB: 'un_sub', PING: 'ping', PONG: 'pong', PUSH: 'push' };
        this._clientId = random(10);
        console.log('new Wesocket', this._clientId, new Date());

        this._subKeys = {};

        this._heartBeat = new timer(() => {
            if (!this.ready) return;
            this.send('');
        }, HEARTBEAT);
        this._heartBeat.start();

        try {
            const connect = new WebSocket(wsUrl);
            this.connect = connect;

            window.onbeforeunload = function () {
                console.log('关闭WebSocket连接！');
                this.connect.onclose = function () {};
                this.connect.close();
            };

            connect.binaryType = 'arraybuffer';

            this._subKey && this.subscribe({ event_key: this._subKey });
            connect.onopen = () => {
                this.send('');
            };

            connect.onmessage = e => {
                const message = proto.decode(new Uint8Array(e.data));
                // See ConversionOptions
                const data = proto.toObject(message, { /* Longs: String, enums: String, bytes: String*/ });

                if (data.client_id !== this._clientId) {
                    console.log('clientId不一致', data.client_id, this._clientId);
                    return;
                }
                if (data.op_type !== this.MESSAGETYPE.PUSH) return;

                const realData = data.error_code ? null : JSON.parse(data.message);

                console.log('onmessage', data, realData);

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

        if (type === this.MESSAGETYPE.PING) {
            console.log('ping', this._clientId, new Date());
        }

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

// const _client = new WsProtoClient(process.env.pushServer);
// console.log(_client);
