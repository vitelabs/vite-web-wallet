
let HTTP_RPC = new ViteJS.HTTP_RPC({
    host: 'http://localhost:3000',
    timeout: 15000
});

HTTP_RPC.request('jsonrpcSuccess', [1, 2]).then((res) => {
    console.log(res);
}).catch((err) => {
    console.error(err);
});