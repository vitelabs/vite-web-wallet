<template>
    <confirm v-show="isShow" class="no-padding-confirm" :title="$t('tradeCenter.operatorTxPair.operatorTab')"
             :closeIcon="true" :close="close">
        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <no-data v-if="!isLoading && !txPairList.length"></no-data>
        <div v-show="!isLoading && txPairList.length" class="trade-container">
            <div class="tx-pair" @click="switchTxPair(txPair)" v-for="(txPair, i) in txPairList" :key="i">
                <div class="left">
                    <div class="symbol">
                        {{ txPair.tradeTokenSymbol }}
                        <span class="quote">/{{ txPair.quoteTokenSymbol }}</span>
                    </div>
                    <div class="price">
                        {{ txPair.closePrice }}
                        <span class="real">{{ getCurrency(txPair.closePrice, txPair.quoteToken) }}</span>
                    </div>
                </div>
                <div class="right" :class="{
                    'red': +txPair.priceChangePercent<0,
                    'green': +txPair.priceChangePercent>0
                }">{{ getPriceChange(txPair.priceChangePercent) }}</div>
            </div>
        </div>
    </confirm>
</template>

<script>
import loading from 'components/loading';
import noData from 'h5Components/noData';
import confirm from 'h5Components/confirm/confirm.vue';
import { getMarketsByTradeToken } from 'services/trade';
import bigNumber from 'utils/bigNumber';

export default {
    components: { loading, confirm, noData },
    props: {
        symbol: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false,
            isLoading: false,
            txPairList: []
        };
    },
    watch: {
        symbol() {
            this.getTxPairs();
        },
        tokenIds(val) {
            this.$store.dispatch('addRateTokens', val);
        }
    },
    computed: {
        tokenIds() {
            return this.txPairList.map(t => t.quoteToken);
        }
    },
    methods: {
        getPriceChange(priceChangePercent) {
            return `${ bigNumber.multi(priceChangePercent || 0, 100, 2) }%`;
        },
        getCurrency(price, tokenId) {
            const pre = this.$store.getters.currencySymbol;
            const rate = this.$store.getters.currencyRateList[tokenId] || 0;

            const _price = bigNumber.multi(price || 0, rate, 6);
            const _realPrice = bigNumber.normalFormatNum(_price, 6);
            const _realPrice2 = bigNumber.normalFormatNum(_realPrice, 2);

            if (+_realPrice2 !== 0) {
                return pre + bigNumber.onlyFormat(_realPrice2, 2);
            }
            return pre + bigNumber.onlyFormat(_realPrice, 2);
        },
        getTxPairs() {
            this.isLoading = true;
            getMarketsByTradeToken({ tradeTokenSymbol: this.symbol }).then(data => {
                this.isLoading = false;
                this.txPairList = data || [];
            }).catch(err => {
                this.isLoading = false;
                console.warn(err);
            });
        },
        close() {
            this.isShow = false;
        },
        switchTxPair(txPair) {
            this.$store.commit('switchTradePair', txPair);
            this.$router.push({ name: 'center' });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.trade-container {
    max-height: 270px;
    .tx-pair {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        border-bottom: 1px solid rgba(211,223,239,1);
        .symbol {
            line-height: 20px;
            font-size: 16px;
            @include font-bold();
            color: rgba(36,39,43,1);
            margin-bottom: 10px;
            .quote {
                font-size: 12px;
                color: rgba(62,74,89,0.3);
            }
        }
        .price {
            font-size: 12px;
            @include font-normal();
            color: rgba(62,74,89,1);
            line-height: 16px;
            .real {
                color: rgba(62,74,89,0.6);
            }
        }
        .right {
            font-size: 16px;
            @include font-bold();
            line-height: 20px;
            &.red {
                color: $red;
            }
            &.green {
                color: $green;
            }
        }
    }
}
</style>
