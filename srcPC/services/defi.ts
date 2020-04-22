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
    }).catch(() => {
        return {
            limitLendUsdQty: '1000',
            limitLendCnyQty: '10000',
            currentLendUsdQty: '300',
            currentLendCnyQty: '3000',
            assets: [
                {
                    tokenId: 'tti_5649544520544f4b454e6e40',
                    symbol: 'VITE',
                    lendQty: '1234567891234567892',
                    depositQty: '1234567891234567892',
                    depositRatio: 0.0334,
                    lendRatio: '',
                    lendDepositRatio: 0.034,
                    depositRate: 0.1,
                    lendRate: 0.002,
                    staking: true,
                    restDepositInterest: '123456789123456789',
                    restLendInterest: '123456789123456789'
                },
                {
                    tokenId: 'tti_06822f8d096ecdf9356b666c',
                    symbol: 'ETH',
                    lendQty: '1234567891234567892',
                    depositQty: '1234567891234567891',
                    depositRatio: 0.3,
                    lendRatio: '0.2',
                    lendDepositRatio: 0.0224,
                    depositRate: 0.0234,
                    lendRate: 0.003,
                    staking: false,
                    restDepositInterest: '123456789123456789',
                    restLendInterest: '123456789123456789'
                }
            ]
        }
    });
}
