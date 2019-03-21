import {root} from './protoClass';
import {random} from 'utils/random';
import {timer} from 'utils/asyncFlow';
const proto = root.lookupType('vite.DexProto');
const HEARTBEAT = 10000;
class WsProtoClient {
    constructor(wsUrl) {
        this.MESSAGETYPE = {SUB: 'sub', UNSUB: 'un_sub', PING: 'ping', PONG: 'pong', PUSH: 'push'};
        this._clientId = random(10);
        this._subKeys = {};
        this._heartBeat = new timer(() => {
            if (!this.ready) return;
            this.send('');
        }, HEARTBEAT);
        this._heartBeat.start();

        const connect = new WebSocket(wsUrl);
        this.connect = connect;
        connect.binaryType = 'arraybuffer';
        this._subKey && this.subscribe({event_key: this._subKey});
        connect.onopen = () => {
            this.send('');
        };

        connect.onmessage = e => {
            const message = proto.decode(new Uint8Array(e.data));
            // See ConversionOptions
            const data = proto.toObject(message, { /* Longs: String, enums: String, bytes: String*/ });

            if (data.op_type !== this.MESSAGETYPE.PUSH) return;

            const realData = data.error_code ? null : JSON.parse(data.message);
            const error = data.error_code || undefined;
            this._subKeys[data.event_key] && this._subKeys[data.event_key].forEach(c => {
                c(realData, error);
            });
        };
    }

    get ready() {
        return this.connect && this.connect.readyState === 1;
    }

    get closed() {
        return this.connect && this.connect.readyState === 3;
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
// 192.168.31.190:11211
// ws://132.232.65.121:11211/websocket
export const client = new WsProtoClient(process.env.pushServer);
