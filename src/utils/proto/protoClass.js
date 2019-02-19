import protobuf from 'protobufjs/light';
const Root = protobuf.Root,
    Type = protobuf.Type,
    Field = protobuf.Field;

// string token = 1;""
// string event_key = 2;"tti_d6bb135b8b35b093d51a50ee(ttoken),tti_5649544520544f4b454e6e40(ftoken)"
// int32 type = 3;2
// string message = 4;
const DexProto = new Type('DexProto').add(new Field('token', 1, 'string'))
    .add(new Field('event_key', 2, 'string'))
    .add(new Field('type', 3, 'int32'))
    .add(new Field('message', 4, 'string'));

export const root = new Root().define('vite').add(DexProto);