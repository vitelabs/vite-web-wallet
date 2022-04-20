<template>
    <div class="staking-detail pool">
        <div class="item pool">
            <span class="icon"></span>
            <div class="token-wrapper">
                <div>{{ $t('tradeDividend.allPrice') }}</div>
                <div class="bold">{{ allBtc }}</div>
                <div class="light">{{ allPrice }}</div>
            </div>
        </div>

        <template v-for="tokenType in typeList">
            <div
                class="pool item"
                v-if="tokenType.name !== 'VITE'"
                :key="tokenType.name"
            >
                <img class="icon" :src="tokenType.icon" />
                <div
                    class="token-wrapper __pointer"
                    v-click-outside="hideTokenList"
                    @click.stop="showTokenList(tokenType)"
                >
                    <div>{{ tokenType.name }}</div>
                    <div class="bold">
                        {{
                            pool[tokenType.name]
                                ? formatNum(
                                    pool[tokenType.name].amount,
                                    tokenType.name
                                )
                                : '--'
                        }}
                        <span class="down-icon"></span>
                    </div>

                    <div
                        class="item-content"
                        v-if="
                            pool[tokenType.name] &&
                                isShowTokenList === tokenType.name
                        "
                    >
                        <div
                            class="row"
                            v-for="(token, i) in pool[tokenType.name].tokens"
                            :key="i"
                        >
                            <span class="light"
                            >{{ getSymbol(token.tokenInfo) }}:</span
                            >
                            <span class="amount">{{
                                formatNum(token.amount, tokenType.name)
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import { getTokenSymbolString } from 'utils/tokenParser';
import bigNumber from 'utils/bigNumber';
import { getCurrDividendPools } from 'services/viteServer';

export default {
    beforeMount() {
        this.fetchPool();
    },
    data() {
        return {
            rawData: {},
            pool: {},
            isShowTokenList: ''
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
                return '-- BTC';
            }

            allPrice = this.formatNum(allPrice, 'BTC');
            return `${ allPrice } BTC`;
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
        showTokenList(tokenType) {
            this.isShowTokenList = tokenType.name;
        },
        hideTokenList() {
            this.isShowTokenList = '';
        },
        getSymbol(tokenInfo) {
            if (!tokenInfo) {
                return '';
            }
            return getTokenSymbolString(tokenInfo.tokenSymbol, tokenInfo.index);
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
@import '~assets/scss/vars.scss';
@import '../components/stakingDetail.scss';

@mixin font_color_price() {
    [data-theme='0'] & {
        color: rgba(94, 104, 117, 0.58);
    }
    [data-theme='1'] & {
        color: $gray-color-2;
    }
}
.pool.staking-detail {
    @include box_shadow();
}

.item.pool {
    padding: 14px 30px;
    flex-direction: row;
    .icon {
        display: inline-block;
        @include background_common_img('head_asset.svg');
        width: 24px;
        height: 24px;
        margin-right: 10px;
        position: relative;
        top: 50%;
        margin-top: -12px;
    }
    .token-wrapper {
        position: relative;
        flex: 1;
    }
}
</style>
