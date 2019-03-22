import protobuf from 'protobufjs/light';
const Root = protobuf.Root,
    Type = protobuf.Type,
    Field = protobuf.Field;

/**
 * string token = 1; ""
 * string event_key = 2; "tti_d6bb135b8b35b093d51a50ee(ttoken),tti_5649544520544f4b454e6e40(ftoken)"
 * int32 type = 3; 2
 * string message = 4;
 * message DexProtocol {
 *      string client_id = 1; //Identify a single client
 *      string event_key = 2; //order.$address.latest|market.$param.(kline|buy|sell|detail|details|trade).$param
 *      tring op_type = 3; // sub,un_sub,ping,pong,push
 *      string message = 4; //json数据
 *      int32 error_code = 5; //错误编码 0:normal, 1:illegal_client_id，2:illegal_event_key，3:illegal_op_type(3)
 * }
*/

const DexProto = new Type('DexProto')
    .add(new Field('client_id', 1, 'string'))
    .add(new Field('event_key', 2, 'string'))
    .add(new Field('op_type', 3, 'string'))
    .add(new Field('message', 4, 'string'))
    .add(new Field('error_code', 5, 'int32'));

export const root = new Root().define('vite').add(DexProto);
