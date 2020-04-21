import { ViteXAPI } from 'services/apiServer';
import Vite from '@vite/ledgerjs-hw-app-vite';

// defi: Get global overview of defi
export async function getGlobalAssets() {
    return ViteXAPI.request({
        method: 'GET',
        path: '/finance/global'
    }).catch(() => [
        {
            tokenId: 'tti_5649544520544f4b454e6e40',
            symbol: 'VITE',
            lendQty: 200,
            depositQty: '1234567891234567891',
            depositRatio: '',
            lendRatio: '',
            lendDepositRatio: 10,
            depositRate: 15,
            lendRate: 11,
            lendNumber: 100,
            depositNumber: 11111
        },
        {
            tokenId: 'tti_06822f8d096ecdf9356b666c',
            symbol: 'ETH',
            lendQty: 200,
            depositQty: '111111111111111',
            depositRatio: '',
            lendRatio: '',
            lendDepositRatio: 10,
            depositRate: 13,
            lendRate: 4,
            lendNumber: 100,
            depositNumber: 11111
        }
    ]);
}

export async function getAssetMeta() {
    return ViteXAPI.request({
        method: 'GET',
        path: '/coins'
    }).catch(() => [
        {
            logo: '',
            tokenId: 'tti_5649544520544f4b454e6e40',
            symbol: 'VITE',
            name: 'Vite',
            decimals: 18,
            usdPrice: 0.1,
            btcPrice: 0.000001,
            cnyPrice: 10,
            stakingDiscount: 11
        },
        {
            logo: '',
            tokenId: 'tti_06822f8d096ecdf9356b666c',
            symbol: 'ETH',
            name: 'Eth',
            decimals: 18,
            usdPrice: 170,
            btcPrice: 0.025,
            cnyPrice: 1000,
            stakingDiscount: 11
        }
    ]);
}

export async function getUserAssets(address) {
    return ViteXAPI.request({
        method: 'GET',
        path: '/finance/my',
        params: { address }
    }).catch(() => [
        {
            tokenId: 'tti_5649544520544f4b454e6e40',
            symbol: 'VITE',
            lendQty: 200,
            maxLendQty: 1000,
            depositQty: 11111,
            depositRatio: '',
            lendRatio: '',
            lendDepositRatio: '',
            depositRate: '',
            lendRate: '',
            staking: false,
            restDepositInterest: 111,
            restLendInterest: 120
        },
        {
            tokenId: 'tti_06822f8d096ecdf9356b666c',
            symbol: 'ETH',
            lendQty: 200,
            maxLendQty: 1000,
            depositQty: 11111,
            depositRatio: '',
            lendRatio: '',
            lendDepositRatio: '',
            depositRate: '',
            lendRate: '',
            staking: false,
            restDepositInterest: 111,
            restLendInterest: 120
        }
    ]);
}
