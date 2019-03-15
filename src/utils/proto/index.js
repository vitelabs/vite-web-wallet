import { root } from './protoClass';
import { random } from 'utils/random';
import { timer } from 'utils/asyncFlow';
const proto = root.lookupType('vite.DexProto');
const HEARTBEAT = 10000;
class WsProtoClient {
    constructor(wsUrl) {
        this.MESSAGETYPE = {
            SUB: 'sub', UNSUB: 'un_sub', PING: 'ping', PONG: 'pong', PUSH: 'push'
        };
        this._client_id = random(10);
        this._subKeys = {};
        this._heartBeat = new timer(() => {
            if (!this.ready) return;
            this.send('');
        }, HEARTBEAT);
        this._heartBeat.start();


        const connect = new WebSocket(wsUrl);
        this.connect = connect;
        connect.binaryType = 'arraybuffer';
        this._sub_key && this.subscribe({
            event_key: this._sub_key
        });
        connect.onopen = () => {
            this.send('');
        };

        connect.onmessage = (e) => {
            const message = proto.decode(new Uint8Array(e.data));

            const data = proto.toObject(message, {
                // longs: String,
                // enums: String,
                // bytes: String,
                // // see ConversionOptions
            });
            console.log('PROTO_DATA',data.event_key,data.op_type,data.message);
            if (data.op_type !== this.MESSAGETYPE.PUSH) return;
            const realData=data.error_code===0?JSON.parse(data.message):null;
            const error=data.error_code||undefined;
            this._subKeys[data.event_key] && this._subKeys[data.event_key].forEach(c => {
                c(realData,error);
            });
        };
    }

    get ready() {
        return this.connect&&this.connect.readyState === 1;
    }
    get closed(){
        return this.connect&&this.connect.readyState === 3;
    }
    sub(event, callback) {
        this._subKeys[event] = this._subKeys[event] || new Set();
        this._subKeys[event].add(callback);
        this.send(event, this.MESSAGETYPE.SUB);
    }
    unSub(event, callback) {
        if (!this._subKeys[event]) return;
        if (!callback) {
            this._subKeys[event].clear();
        } else {
            this._subKeys[event].delete(callback);
        }
        this._subKeys[event].length === 0 && this.send(event, this.MESSAGETYPE.UNSUB);
    }
    send(event_key='', type = this.MESSAGETYPE.PING) {
        if (!this.ready) return;
        console.log('PROTO_SEND',event_key,type);
        const payload = {
            event_key: event_key,
            op_type: type,
            client_id: this._client_id,
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

class businessClient extends WsProtoClient {
    constructor(...args) {
        super(...args);
        this.TOPICTYPE = {
            KLINE: 'kline',
            DEPTH: 'depth',
            DETAIL: 'detail',
            DETAILS: 'details',
            TRADE: 'trade'
        };
        this.SIDETYPE = {
            BUY: 'buy',
            SELL: 'sell',
            LATEST: 'latest'
        };
    }
    subOrder(address, callback) {
        this.sub(`order.${address}.latest`, callback);
    }
    subMarket({ ftoken, ttoken, topic, side },callback) {
        this.sub(`market.${ftoken}${ttoken ? ('-' + ttoken) : ''}.${topic}.${side}`,callback);
    }


}
// 192.168.31.190:8085
// ws://132.232.65.121:11211/websocket
export const client = new businessClient('ws://132.232.65.121:11211/websocket');
