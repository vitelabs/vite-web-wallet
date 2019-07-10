import { client, constant } from '@vite/vitejs';
import provider from '@vite/vitejs-ws';

// Timout: 6000; retryTimes: 10; retryInterval: 10000
const WS_RPC = new provider(process.env.goViteServer);
const $ViteJS = new client(WS_RPC, () => {
    console.log('Connect success');
});
// }, { isDecodeTx: true });

$ViteJS.addTxType({
    currDexFundNewOrder: {
        contractAddr: constant.DexFund_Addr,
        abi: { 'type': 'function', 'name': 'DexFundNewOrder', 'inputs': [ { 'name': 'tradeToken', 'type': 'tokenId' }, { 'name': 'quoteToken', 'type': 'tokenId' }, { 'name': 'side', 'type': 'bool' }, { 'name': 'orderType', 'type': 'uint8' }, { 'name': 'price', 'type': 'string' }, { 'name': 'quantity', 'type': 'uint256' } ] }
    },
    DexFundTransferTokenOwner: {
        contractAddr: constant.DexFund_Addr,
        abi: { 'type': 'function', 'name': 'DexFundTransferTokenOwner', 'inputs': [ { 'name': 'token', 'type': 'tokenId' }, { 'name': 'owner', 'type': 'address' } ] }
    }
});

export default $ViteJS;
