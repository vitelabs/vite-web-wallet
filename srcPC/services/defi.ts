import { ViteXAPI } from 'services/apiServer';

// defi: Get global overview of defi
export async function getGlobalAssets() {
    return ViteXAPI.request({
        method: 'GET',
        path: '/finance/global'
    }).catch(() => [
        {
            tokendId: 'tti_5649544520544f4b454e6e40',
            symbol: 'VITE',
            lendQty: 200,
            depositQty: 11111,
            depositRatio: '',
            lendRatio: '',
            lendDepositRatio: '',
            depositRate: '',
            lendRate: '',
            userCount: 100
        },
        {
            tokendId: 'tti_06822f8d096ecdf9356b666c',
            symbol: 'ETH',
            lendQty: 200,
            depositQty: 11111,
            depositRatio: '',
            lendRatio: '',
            lendDepositRatio: '',
            depositRate: '',
            lendRate: '',
            userCount: 1001
        }
    ]);
}
