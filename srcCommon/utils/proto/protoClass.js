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

const TickerStatisticsProto = new Type('TickerStatisticsProto')
    .add(new Field('symbol', 1, 'string'))
    .add(new Field('tradeTokenSymbol', 2, 'string'))
    .add(new Field('quoteTokenSymbol', 3, 'string'))
    .add(new Field('tradeToken', 4, 'string'))
    .add(new Field('quoteToken', 5, 'string'))
    .add(new Field('openPrice', 6, 'string'))
    .add(new Field('prevClosePrice', 7, 'string'))
    .add(new Field('closePrice', 8, 'string'))
    .add(new Field('priceChange', 9, 'string'))
    .add(new Field('priceChangePercent', 10, 'string'))
    .add(new Field('highPrice', 11, 'string'))
    .add(new Field('lowPrice', 12, 'string'))
    .add(new Field('quantity', 13, 'string'))
    .add(new Field('amount', 14, 'string'))
    .add(new Field('pricePrecision', 15, 'int32'))
    .add(new Field('quantityPrecision', 16, 'int32'));

const TradeListProto = new Type('TradeListProto')
    .add(new Field('list', 1, 'TradeProto', 'repeated'));

const TradeProto = new Type('TradeProto')
    .add(new Field('tradeId', 1, 'string'))
    .add(new Field('symbol', 2, 'string'))
    .add(new Field('tradeTokenSymbol', 3, 'string'))
    .add(new Field('quoteTokenSymbol', 4, 'string'))
    .add(new Field('tradeToken', 5, 'string'))
    .add(new Field('quoteToken', 6, 'string'))
    .add(new Field('price', 7, 'string'))
    .add(new Field('quantity', 8, 'string'))
    .add(new Field('amount', 9, 'string'))
    .add(new Field('time', 10, 'int64'))
    .add(new Field('side', 11, 'int32'))
    .add(new Field('buyerOrderId', 12, 'string'))
    .add(new Field('sellerOrderId', 13, 'string'))
    .add(new Field('buyFee', 14, 'string'))
    .add(new Field('sellFee', 15, 'string'))
    .add(new Field('blockHeight', 16, 'int64'));

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
    .add(new Field('orderId', 1, 'string'))
    .add(new Field('symbol', 2, 'string'))
    .add(new Field('tradeTokenSymbol', 3, 'string'))
    .add(new Field('quoteTokenSymbol', 4, 'string'))
    .add(new Field('tradeToken', 5, 'string'))
    .add(new Field('quoteToken', 6, 'string'))
    .add(new Field('side', 7, 'int32'))
    .add(new Field('price', 8, 'string'))
    .add(new Field('quantity', 9, 'string'))
    .add(new Field('amount', 10, 'string'))
    .add(new Field('executedQuantity', 11, 'string'))
    .add(new Field('executedAmount', 12, 'string'))
    .add(new Field('executedPercent', 13, 'string'))
    .add(new Field('executedAvgPrice', 14, 'string'))
    .add(new Field('fee', 15, 'string'))
    .add(new Field('status', 16, 'int32'))
    .add(new Field('type', 17, 'int32'))
    .add(new Field('createTime', 18, 'int64'))
    .add(new Field('address', 19, 'string'));

const DepthListProto = new Type('DepthListProto')
    .add(new Field('asks', 1, 'DepthProto', 'repeated'))
    .add(new Field('bids', 2, 'DepthProto', 'repeated'));

const DepthProto = new Type('DepthProto')
    .add(new Field('price', 1, 'string'))
    .add(new Field('quantity', 2, 'string'))
    .add(new Field('amount', 3, 'string'));

export const root = new Root().define('vite')
    .add(DexProto)
    .add(TickerStatisticsProto)
    .add(TradeListProto)
    .add(TradeProto)
    .add(KlineProto)
    .add(OrderListProto)
    .add(OrderProto)
    .add(DepthListProto)
    .add(DepthProto);
