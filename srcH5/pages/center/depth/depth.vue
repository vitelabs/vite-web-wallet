<template>
    <div class="depth-wrapper">
        <div class="__center-tb-title">
            <span class="__center-tb-item __ellipsis depth amount">{{ $t('mobileTradeCenter.sellPrice', {
                token: quoteTokenDetail ? quoteTokenDetail.originalSymbol : ''
            }) }}</span>
            <span class="__center-tb-item left __ellipsis depth quantity">{{ $t('trade.amountTitle', {
                amount: tradeTokenDetail ? tradeTokenDetail.originalSymbol : ''
            }) }}</span>
            <span class="__center-tb-item __ellipsis depth price">{{ $t('mobileTradeCenter.buyPrice', {
                token: quoteTokenDetail ? quoteTokenDetail.originalSymbol : ''
            }) }}</span>
        </div>

        <div class="depth-content-wrapper">
            <depth-table class="depth-table" dataType="sell" :depthData="depthSell"></depth-table>
            <depth-table class="depth-table" dataType="buy" :depthData="depthBuy"></depth-table>
        </div>
    </div>
</template>

<script>
import depthTable from './depthTable';

export default {
    components: { depthTable },
    computed: {
        depthBuy() {
            return this.$store.state.exchangeDepth.buy;
        },
        depthSell() {
            return this.$store.state.exchangeDepth.sell;
        },
        quoteTokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        tradeTokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Assets/scss/vars.scss';

.depth-wrapper {
    .__center-tb-title {
        display: flex;
        flex-direction: row;
        height: 40px;
        line-height: 40px;
        font-weight: 400;
        color: rgba(62,74,89,0.3);
        font-size: 12px;
        @include font-normal();
        justify-content: space-between;

        .__center-tb-item {
            position: relative;
            text-align: right;
            white-space: nowrap;
        }
    }

    .depth-content-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .depth-table {
        position: relative;
        flex: 1;
    }
}
</style>
