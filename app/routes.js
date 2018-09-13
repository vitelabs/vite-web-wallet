// const ViteJS = require('vite.js');


module.exports = {
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
};