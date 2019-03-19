import { client } from '@vite/vitejs';
import provider from '@vite/vitejs-ws';

// timout: 6000; retryTimes: 10; retryInterval: 10000
let WS_RPC = new provider(process.env.goViteServer);
export default new client(WS_RPC);
