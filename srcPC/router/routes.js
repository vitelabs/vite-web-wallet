import assets from '@pc/pages/assets/index.vue';
import assetsTokenCard from '@pc/pages/assets/tokenCard/index.vue';
import create from '@pc/pages/create/index.vue';
import keystore from '@pc/pages/keystore/index.vue';
import notFound from '@pc/pages/notFound.vue';
import setting from '@pc/pages/setting/index.vue';
import startCreate from '@pc/pages/start/create/index.vue';
import start from '@pc/pages/start/index.vue';
import startLogin from '@pc/pages/start/login/index.vue';
import tradeCenter from '@pc/pages/trade/center/index.vue';
import tradeDividend from '@pc/pages/trade/dividend/index.vue';
import trade from '@pc/pages/trade/index.vue';
import tradeMining from '@pc/pages/trade/mining/index.vue';
import tradeOpenOrders from '@pc/pages/trade/openOrders/index.vue';
import tradeOpenapi from '@pc/pages/trade/openapi/index.vue';
import tradeOperator from '@pc/pages/trade/operator/index.vue';
import tradeOrderHistory from '@pc/pages/trade/orderHistory/index.vue';
import tradeTrust from '@pc/pages/trade/trust/index.vue';
import tradeTxPairManage from '@pc/pages/trade/txPairManage/index.vue';
import tradeVip from '@pc/pages/trade/vip/index.vue';
import walletSBP from '@pc/pages/wallet/SBP/index.vue';
import walletFullNode from '@pc/pages/wallet/fullNode/index.vue';
import wallet from '@pc/pages/wallet/index.vue';
import walletMintage from '@pc/pages/wallet/mintage/index.vue';
import walletQuota from '@pc/pages/wallet/quota/index.vue';
import walletTransList from '@pc/pages/wallet/transList/index.vue';
import walletVote from '@pc/pages/wallet/vote/index.vue';

export default [
  {
    name: 'assets', path: '/assets', component: assets, alias: "/index",
    children: [{ name: 'assetsTokenCard', path: '/assetsTokenCard', component: assetsTokenCard },
    ]
  },
  { name: 'create', path: '/create', component: create },
  { name: 'keystore', path: '/keystore', component: keystore },
  { name: 'notFound', path: '/notFound', component: notFound },
  { name: 'setting', path: '/setting', component: setting },
  {
    name: 'start', path: '/start', component: start,
    children: [{ name: 'startCreate', path: '/startCreate', component: startCreate },
    { name: 'startLogin', path: '/startLogin', component: startLogin, alias: "/start" },
    ]
  },
  {
    name: 'trade', path: '/trade', component: trade,
    children: [{ name: 'tradeCenter', path: '/tradeCenter', component: tradeCenter, alias: ["/trade"] },
    { name: 'tradeDividend', path: '/tradeDividend', component: tradeDividend },
    { name: 'tradeMining', path: '/tradeMining', component: tradeMining },
    { name: 'tradeOpenOrders', path: '/tradeOpenOrders', component: tradeOpenOrders },
    { name: 'tradeOpenapi', path: '/tradeOpenapi', component: tradeOpenapi },
    { name: 'tradeOperator', path: '/tradeOperator', component: tradeOperator },
    { name: 'tradeOrderHistory', path: '/tradeOrderHistory', component: tradeOrderHistory },
    { name: 'tradeTrust', path: '/tradeTrust', component: tradeTrust },
    { name: 'tradeTxPairManage', path: '/tradeTxPairManage', component: tradeTxPairManage },
    { name: 'tradeVip', path: '/tradeVip', component: tradeVip },
    ]
  },
  {
    name: 'wallet', path: '/wallet', component: wallet,
    children: [{ name: 'walletSBP', path: '/walletSBP', component: walletSBP },
    { name: 'walletFullNode', path: '/walletFullNode', component: walletFullNode },
    { name: 'walletMintage', path: '/walletMintage', component: walletMintage },
    { name: 'walletQuota', path: '/walletQuota', component: walletQuota, alias: "/wallet" },
    { name: 'walletTransList', path: '/walletTransList', component: walletTransList },
    { name: 'walletVote', path: '/walletVote', component: walletVote },
    ]
  },
  { path: '/', redirect: '/index' },
  { path: '*', redirect: '/notFound' }
]