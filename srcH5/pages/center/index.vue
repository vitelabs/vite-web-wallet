<template>
    <div class="trade-center-wrapper">
        <center-head></center-head>
        <div class="white-wrapper">
            <limit-price></limit-price>
            <depth></depth>
        </div>
        <div class="white-wrapper">
            <div class="order-tab">{{ $t('tradeOpenOrders.title') }}</div>
            <openOrder></openOrder>
        </div>
    </div>
</template>

<script>
import openOrder from 'h5Components/orderOpen.vue';
import depth from './depth/depth.vue';
import limitPrice from './limitPrice/limitPrice.vue';
import centerHead from './head/head.vue';

export default {
    components: { depth, limitPrice, centerHead, openOrder },
    mounted() {
        this.$store.dispatch('init');
        this.$store.dispatch('updateMarketMap');
        this.$store.dispatch('getMarketsClosed');
        this.$store.dispatch('exFetchLimitAmounts');
        this.$store.dispatch('exFetchVip');
        this.$store.dispatch('startLoopDexFundeUnreceived');
    },
    destroyed() {
        this.$store.dispatch('stopLoopDexFundUnreceived');
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        quoteTokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        tradeTokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    watch: {
        address() {
            this.$store.dispatch('exFetchVip');
        },
        quoteTokenDetail() {
            this.$store.dispatch('exSetQuoteTokenDecimals');
        },
        tradeTokenDetail() {
            this.$store.dispatch('exSetTradeTokenDecimals');
        },
        activeTxPair() {
            this.$store.dispatch('exSetTokenDecimals');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.trade-center-wrapper {
    font-size: 12px;
    background: rgba(243,245,249,1);
}
.white-wrapper {
    padding: 16px 24px;
    background: #fff;
    margin-bottom: 16px;
}
.order-tab {
    margin-bottom: 10px;
    line-height: 20px;
    font-size: 14px;
    @include font-bold();
    color: rgba(62,74,89,1);
}
</style>
