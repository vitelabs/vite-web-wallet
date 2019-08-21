<template>
    <div class="pool-detail">
        <div class="item">
            <div class="title">{{ $t('mobileDividend.poolTitle', { token: 'BTC' }) }}</div>
            <div class="btc-amount">{{ allBtc }}</div>
            <div class="real-amount">{{ allPrice }}</div>
        </div>

        <div class="item pool-item">
            <div class="token-wrapper" v-for="tokenType in typeList" :key="tokenType.name">
                <div class="token-name">
                    <img class="icon" :src="tokenType.icon" />
                    <span class="token-name">{{ tokenType.name }}</span>
                </div>
                <div class="token-amount">
                    {{ pool[tokenType.name] ? formatNum(pool[tokenType.name].amount, tokenType.name) : '--' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ViteJS from 'utils/viteClient';
import viteIcon from 'assets/imgs/vite-dividend.svg';
import ethIcon from 'assets/imgs/eth.svg';
import usdIcon from 'assets/imgs/usd.svg';
import btcIcon from 'assets/imgs/BTC.svg';
import bigNumber from 'utils/bigNumber';

const typeList = [ {
    name: 'VITE',
    icon: viteIcon
}, {
    name: 'BTC',
    icon: btcIcon
}, {
    name: 'ETH',
    icon: ethIcon
}, {
    name: 'USD',
    icon: usdIcon
} ];

export default {
    beforeMount() {
        this.fetchPool();
    },
    data() {
        return {
            typeList,
            rawData: {},
            pool: {}
        };
    },
    computed: {
        allPrice() {
            const coin = this.$store.state.env.currency;
            const pre = coin === 'cny' ? '¥' : '$';

            let allPrice = this.getPrice(this.rawData, coin);
            if (+allPrice < 0) {
                return `≈${ pre } --`;
            }

            allPrice = this.formatNum(allPrice, 'USD');
            return `≈${ pre }${ allPrice }`;
        },
        allBtc() {
            let allPrice = this.getPrice(this.rawData, 'btc');
            if (+allPrice < 0) {
                return '--';
            }

            allPrice = this.formatNum(allPrice, 'BTC');
            return `${ allPrice }`;
        }
    },
    methods: {
        getPrice(data, coin) {
            let allPrice = 0;
            for (const tokenId in data) {
                const token = data[tokenId];
                if (!token.amount) {
                    continue;
                }

                const rate = this.getRate(tokenId, coin);
                if (!rate) {
                    return -1;
                }

                const price = bigNumber.multi(token.amount || 0, rate || 0);
                allPrice = bigNumber.plus(price, allPrice);
            }
            return allPrice;
        },
        getRate(tokenId, coin) {
            const rateList = this.$store.state.exchangeRate.rateMap || {};

            if (!tokenId || !rateList[tokenId]) {
                return null;
            }

            return rateList[tokenId][`${ coin }Rate`] || null;
        },

        fetchPool() {
            $ViteJS.request('dexfund_getCurrentDividendPools').then(data => {
                this.rawData = data;
                if (!data) {
                    this.pool = {};
                    return;
                }

                this.pool = {};
                const tokenIds = [];
                const tokenList = [ 'VITE', 'ETH', 'BTC', 'USD' ];

                for (const tokenId in data) {
                    const token = data[tokenId];
                    const tokenTypeName = tokenList[token.quoteTokenType - 1];

                    this.pool[tokenTypeName] = this.pool[tokenTypeName] || {
                        amount: '0',
                        decimals: 8,
                        tokens: []
                    };

                    const allAmount = this.pool[tokenTypeName].amount;

                    token.tokenType = tokenTypeName;
                    token.amount = bigNumber.toBasic(token.amount, token.tokenInfo.decimals);

                    this.pool[tokenTypeName].tokens.push(token);
                    this.pool[tokenTypeName].amount = bigNumber.plus(token.amount, allAmount);

                    tokenIds.push(token.tokenInfo.tokenId);
                }

                this.$store.dispatch('addRateTokens', tokenIds);
            }).catch(err => {
                console.warn(err);
            });
        },
        formatNum(amount, tokenSymbol) {
            const map = {
                BTC: 8,
                ETH: 8,
                VITE: 4,
                USD: 2
            };
            return bigNumber.formatNum(amount, map[tokenSymbol]);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.pool-detail {
    font-size: 12px;
    @include font-normal();
    color: rgba(62,74,89,0.6);
    border-radius: 2px;
    background: url('~h5Assets/imgs/assets.svg') no-repeat;
    background-size: 100% 100%;
    .title {
        line-height: 26px;
    }
    .btc-amount {
        font-size: 24px;
        @include font-bold();
        color: rgba(36,39,43,1);
        line-height: 30px;
        margin-bottom: 6px;
    }
    .real-amount {
        font-size: 14px;
        color: rgba(36,39,43,1);
        line-height: 18px;
    }
}

.item {
    padding: 14px;
    &:first-child {
        border-bottom: 1px dashed rgba(211,223,239,1);
    }
}

.pool-item {
    padding-bottom: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    font-size: 12px;
    line-height: 16px;
    color: rgba(62, 74, 89, 0.6);
    .token-wrapper {
        margin-bottom: 14px;
        width: 50%;
    }
    .token-name {
        margin-bottom: 5px;
        .icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 2px;
        }
    }
    .token-amount {
        @include font-bold();
    }
}
</style>
