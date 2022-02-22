<template>
    <my-income
        class="pool-my-income"
        :total="`${allBtc}`"
        :actualTotal="`${allPrice}`"
        :isShowMiningLink="false"
        :isShowActualTotal="true"
        :title="$t('mobileDividend.poolTitle', { token: 'BTC' })"
    >
        <div class="head-detail">
            <template v-for="tokenType in typeList">
                <div
                    class="item"
                    v-if="tokenType.name !== 'VITE'"
                    :key="tokenType.name"
                >
                    <div class="item-title">
                        <img :src="tokenType.h5Icon" />{{ tokenType.name }}
                    </div>
                    <div class="bold">
                        {{
                            pool[tokenType.name]
                                ? formatNum(
                                    pool[tokenType.name].amount,
                                    tokenType.name
                                )
                                : '--'
                        }}
                    </div>
                </div>
            </template>
        </div>
    </my-income>
</template>

<script>
import myIncome from 'h5Components/myIncome/index';
import bigNumber from 'utils/bigNumber';
import { getCurrDividendPools } from 'services/viteServer';

export default {
    components: { myIncome },
    beforeMount() {
        this.fetchPool();
    },
    data() {
        return {
            rawData: {},
            pool: {}
        };
    },
    computed: {
        typeList() {
            return this.$store.getters.tokenShowTypeList;
        },
        allPrice() {
            const coin = this.$store.state.env.currency;
            const pre = this.$store.getters.currencySymbol;

            let allPrice = this.getPrice(this.rawData, coin);
            if (+allPrice < 0) {
                return `≈${ pre } --`;
            }

            allPrice = this.formatNum(allPrice, 'USDT');
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
            getCurrDividendPools()
                .then(data => {
                    this.rawData = data;
                    if (!data) {
                        this.pool = {};
                        return;
                    }

                    this.pool = {};
                    const tokenIds = [];
                    const tokenList = [ 'VITE', 'ETH', 'BTC', 'USDT' ];

                    for (const tokenId in data) {
                        const token = data[tokenId];
                        const tokenTypeName
                            = tokenList[token.quoteTokenType - 1];

                        this.pool[tokenTypeName] = this.pool[tokenTypeName] || {
                            amount: '0',
                            decimals: 8,
                            tokens: []
                        };

                        const allAmount = this.pool[tokenTypeName].amount;

                        token.tokenType = tokenTypeName;
                        token.amount = bigNumber.toBasic(token.amount,
                            token.tokenInfo.decimals);

                        this.pool[tokenTypeName].tokens.push(token);
                        this.pool[tokenTypeName].amount = bigNumber.plus(token.amount,
                            allAmount);

                        tokenIds.push(token.tokenInfo.tokenId);
                    }

                    this.$store.dispatch('addRateTokens', tokenIds);
                })
                .catch(err => {
                    console.warn(err);
                });
        },
        formatNum(amount, tokenSymbol) {
            const map = {
                BTC: 8,
                ETH: 8,
                VITE: 4,
                USDT: 2
            };
            return bigNumber.formatNum(amount, map[tokenSymbol]);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Components/myIncome/headDetail.scss';

.pool-my-income {
    margin-top: 0px;
}
</style>
