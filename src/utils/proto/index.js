import { root } from './protoClass';
import { random } from 'utils/random';
import { timer } from 'utils/asyncFlow';
const proto = root.lookupType('vite.DexProto');
const HEARTBEAT = 5000;
class WsProtoClient {
    constructor(wsUrl) {
        this._token = random(10);
        this._subKeys = {};
        this._heartBeat = new timer(() => {
            if (!this.ready) return;
            this.send(Object.keys(this._subKeys).join(','));
        }, HEARTBEAT);
        this._heartBeat.start();


        const connect = new WebSocket(wsUrl);
        this.connect = connect;
        connect.binaryType = 'arraybuffer';
        this._sub_key && this.subscribe({
            event_key: this._sub_key
        });
        connect.onopen = () => {
            this.send(Object.keys(this._subKeys).join(','));
        };

        connect.onmessage = (e)=> {
            const message = proto.decode(new Uint8Array(e.data));
            
            const data = proto.toObject(message, {
                // longs: String,
                // enums: String,
                // bytes: String,
                // // see ConversionOptions
            });
            if(data.type===3)return;
            this._subKeys[data.event_key] && this._subKeys[data.event_key].forEach(c => {
                c(data);
            });
        };
    }
    get ready() {
        return this.connect.readyState === 1;
    }
    sub(event, callback) {
        this._subKeys[event] = this._subKeys[event] || new Set();
        this._subKeys[event].add(callback);
    }
    unSub(event, callback) {
        if (!this._subKeys[event]) return;
        this._subKeys[event].delete(callback);
    }
    send(event_key) {
        // if (!this.ready) return;
        if (!event_key) {
            return;
        }
        const payload = {
            event_key: event_key,
            type: 3,
            token: this._token,
            message: ''
        };
        const err = proto.verify(payload);
        if (err) throw Error(err);        
        const message = proto.create(payload);
        const buffer = proto.encode(message).finish();
        this.connect.send(buffer);
    }

}
export const client = new WsProtoClient('wss://132.232.65.121:11211/websocket');