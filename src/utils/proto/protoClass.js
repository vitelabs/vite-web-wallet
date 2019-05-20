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
 *      bytes message = 4; // proto数据
 *      int32 error_code = 5; // 错误编码 0:normal, 1:illegal_client_id，2:illegal_event_key，3:illegal_op_type(3)
 * }
*/

const DexProto = new Type('DexProto')
    .add(new Field('client_id', 1, 'string'))
    .add(new Field('event_key', 2, 'string'))
    .add(new Field('op_type', 3, 'string'))
    .add(new Field('message', 4, 'bytes'))
    .add(new Field('error_code', 5, 'int32'));

const TradePairProto = new Type('TradePairProto')
    .add(new Field('pairCode', 1, 'string'))
    .add(new Field('ftoken', 2, 'string'))
    .add(new Field('ftokenShow', 3, 'string'))
    .add(new Field('ttoken', 4, 'string'))
    .add(new Field('ttokenShow', 5, 'string'))
    .add(new Field('priceBefore24h', 6, 'string'))
    .add(new Field('pricePrev', 7, 'string'))
    .add(new Field('price', 8, 'string'))
    .add(new Field('price24hChange', 9, 'string'))
    .add(new Field('price24hHigh', 10, 'string'))
    .add(new Field('price24hLow', 11, 'string'))
    .add(new Field('quantity24h', 12, 'string'))
    .add(new Field('amount24h', 13, 'string'))
    .add(new Field('fromDecimals', 14, 'int32'))
    .add(new Field('toDecimals', 15, 'int32'));

const TxLatestListProto = new Type('TxLatestListProto')
    .add(new Field('list', 1, 'TxLatestProto', 'repeated'));

const TxLatestProto = new Type('TxLatestProto')
    .add(new Field('txSide', 1, 'int32'))
    .add(new Field('price', 2, 'string'))
    .add(new Field('quantity', 3, 'string'))
    .add(new Field('txTime', 4, 'int64'));

const KlineProto = new Type('KlineProto')
    .add(new Field('t', 1, 'int64'))
    .add(new Field('c', 2, 'double'))
    .add(new Field('o', 3, 'double'))
    .add(new Field('h', 4, 'double'))
    .add(new Field('l', 5, 'double'))
    .add(new Field('v', 6, 'double'));

const OrderListProto = new Type('OrderListProto')
    .add(new Field('list', 1, 'OrderProto', 'repeated'));

const OrderProto = new Type('OrderProto')
    .add(new Field('address', 1, 'string'))
    .add(new Field('date', 2, 'int64'))
    .add(new Field('ftokenShow', 3, 'string'))
    .add(new Field('ttokenShow', 4, 'string'))
    .add(new Field('ftoken', 5, 'string'))
    .add(new Field('ttoken', 6, 'string'))
    .add(new Field('side', 7, 'int32'))
    .add(new Field('price', 8, 'string'))
    .add(new Field('quantity', 9, 'string'))
    .add(new Field('amount', 10, 'string'))
    .add(new Field('filledQ', 11, 'string'))
    .add(new Field('filledA', 12, 'string'))
    .add(new Field('rate', 13, 'double'))
    .add(new Field('average', 14, 'string'))
    .add(new Field('fee', 15, 'string'))
    .add(new Field('orderId', 16, 'string'))
    .add(new Field('status', 17, 'int32'))
    .add(new Field('type', 18, 'int32'));

const DepthListProto = new Type('DepthListProto')
    .add(new Field('asks', 1, 'DepthProto', 'repeated'))
    .add(new Field('bids', 2, 'DepthProto', 'repeated'));

const DepthProto = new Type('DepthProto')
    .add(new Field('price', 1, 'string'))
    .add(new Field('quantity', 2, 'string'))
    .add(new Field('amount', 3, 'string'));

export const root = new Root().define('vite')
    .add(DexProto)
    .add(TradePairProto)
    .add(TxLatestListProto)
    .add(TxLatestProto)
    .add(KlineProto)
    .add(OrderListProto)
    .add(OrderProto)
    .add(DepthListProto)
    .add(DepthProto);
