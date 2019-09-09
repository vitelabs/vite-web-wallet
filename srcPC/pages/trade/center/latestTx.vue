<template>
    <div class="ex-latest-tx-wrapper">
        <div class="__center-title">{{ $t('trade.latestTx.title') }}</div>
        <div class="__center-tb-title">
            <span class="__center-tb-item">
                {{ $t('trade.priceTitle', {
                    price: quoteTokenDetail ? quoteTokenDetail.originalSymbol : ''
                }) }}
            </span>
            <span class="__center-tb-item left __ellipsis">
                {{ $t('trade.amountTitle', {
                    amount: tradeTokenDetail ? tradeTokenDetail.originalSymbol : ''
                })}}
            </span>
            <span class="__center-tb-item tx-time">{{ $t('trade.latestTx.time') }}</span>
        </div>

        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <div class="tx-list-wrapper">
            <div class="__center-tb-row __pointer" @click="clickRow(tx)"
                 v-for="(tx, i) in latestTxList" :key="i">
                <span class="__center-tb-item"  :class="{
                    'buy': tx.side === 0,
                    'sell': tx.side === 1
                }">{{ formatNum(tx.price, 'price') }}</span>
                <span class="__center-tb-item left">{{ formatNum(tx.quantity, 'quantity') }}</span>
                <span class="__center-tb-item tx-time">{{ getDate(tx.time * 1000) }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import date from 'utils/date';
import BigNumber from 'utils/bigNumber';
import loading from 'components/loading';

export default {
    components: { loading },
    destroyed() {
        this.$store.dispatch('exStopLatestTimer');
    },
    computed: {
        quoteTokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        tradeTokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        latestTxList() {
            return this.$store.state.exchangeLatestTx.txList;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        isLoading() {
            return this.$store.state.exchangeLatestTx.isLoading;
        },
        quoteTokenDigit() {
            return this.$store.getters.quoteTokenDecimalsLimit;
        },
        tradeTokenDigit() {
            return this.$store.getters.tradeTokenDecimalsLimit;
        }
    },
    methods: {
        formatNum(num, type) {
            const tokenDigit = type === 'price' ? 'quoteTokenDigit' : 'tradeTokenDigit';
            return BigNumber.normalFormatNum(num, this[tokenDigit]);
        },
        getDate(timestamp) {
            return date(timestamp, 'zh', true);
        },
        clickRow(tx) {
            this.$store.commit('exSetActiveTx', tx);
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

.ex-latest-tx-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.__center-tb-item.tx-time {
    width: 60px;
    flex: unset;
}

.tx-list-wrapper {
    flex: 1;
    overflow: auto;
}
</style>
