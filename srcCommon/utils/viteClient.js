import { client } from '@vite/vitejs';
import provider from '@vite/vitejs-ws';

// Timout: 6000; retryTimes: 10; retryInterval: 10000
const WS_RPC = new provider(process.env.goViteServer);
const $ViteJS = new client(WS_RPC, () => {
    // console.log('Connect success');
});
// }, {
//     isDecodeTx: true,
//     decodeTxTypeList: ['DexFundPledgeForVip']
// });

export default $ViteJS;
