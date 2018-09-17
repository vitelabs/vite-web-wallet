const connect = require('connect');
const jsonParser = require('body-parser').json;
const jayson = require('jayson');

const ViteJS = require('vite.js').default;
console.log(ViteJS);

let WS_RPC = new ViteJS.WS_RPC({
    timeout: 2000
});
// console.log(WS_RPC);
let $ViteJS = new ViteJS(WS_RPC);

let p2p = require('./model/p2p');
let ledger = require('./model/ledger');

let initRoutes = require('./routes');
let server = jayson.server( initRoutes({
    P2P: new p2p($ViteJS),
    Ledger: new ledger($ViteJS)
}) );

let app = connect();

app.use(jsonParser());
app.use(server.middleware());

app.listen(3000);
console.log('APP listening 3000\n\r');
