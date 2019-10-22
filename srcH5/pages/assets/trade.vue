<template>
    <confirm v-show="isShow" class="no-padding-confirm" :title="$t('tradeCenter.operatorTxPair.operatorTab')"
             :closeIcon="true" :close="close">
        <div class="tx-pair" v-for="(txPair, i) in txPairList" :key="i">
            <div class="symbol">
                {{ txPair.tradeTokenSymbol }}
                <span class="quote">/{{ txPair.quoteTokenSymbol }}</span>
            </div>
        </div>
    </confirm>
</template>

<script>
import confirm from 'h5Components/confirm/confirm.vue';
import { getMarketsByTradeToken } from 'services/trade';

export default {
    components: { confirm },
    props: {
        symbol: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShow: false,
            isLoading: true,
            txPairList: []
        };
    },
    watch: {
        symbol() {
            this.getTxPairs();
        }
    },
    methods: {
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.trade-container {
    .tx-pair {
        padding: 10px 16px;
        .symbol {
            line-height: 20px;
            font-size: 16px;
            @include font-bold();
            color: rgba(36,39,43,1);
            .quote {
                font-size: 12px;
                color: rgba(62,74,89,0.3);
            }
        }
    }
}
</style>
