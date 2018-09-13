// const ViteJS = require('vite.js');
const jayson = require('jayson');
var cors = require('cors');
var connect = require('connect');
var jsonParser = require('body-parser').json;

var app = connect();
// create a server
let server = jayson.server({
    jsonrpcSuccess: function (args, callback) {
        callback(null, args[0] + args[1]);
    },
    jsonrpcError: function (args, callback) {
        callback({ code: 0, message: JSON.stringify(args) });
    },
    jsonrpcTimeoutSuccess: function (args, callback) {
        setTimeout(() => {
            callback(null, args[0] + args[1]);
        }, 100);
    },
    jsonrpcTimeoutError: function (args, callback) {
        setTimeout(() => {
            callback(null, args[0] + args[1]);
        }, 1000);
    }
});

app.use(cors({methods: ['POST']}));
app.use(jsonParser());
app.use(server.middleware());

app.listen(3000);
console.log('APP listening 3000\n\r');
