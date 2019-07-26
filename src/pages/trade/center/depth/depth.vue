<template>
    <div class="depth-wrapper">
        <ul class="ex-tab-list">
            <li :class="{
                    'active': isShowSell && isShowBuy
                }" class="ex-tab __pointer"
                @click="showTable(true, true)">{{ $t('trade.depth.all') }}</li>
            <li :class="{
                    'active': isShowBuy && !isShowSell,
                    'active-side': isShowSell && isShowBuy
                }" class="ex-tab __pointer"
                @click="showTable(true, false)">{{ $t('trade.depth.buy') }}</li>
            <li :class="{
                    'active': isShowSell && !isShowBuy,
                    'active-side': isShowBuy && !isShowSell
                }" class="ex-tab __pointer"
                @click="showTable(false, true)">{{ $t('trade.depth.sell') }}</li>
                <!--<merge-depth></merge-depth>-->
        </ul>

        <div class="__center-tb-title">
            <span class="__center-tb-item __ellipsis depth price">{{ $t('trade.priceTitle', {
                price: quoteTokenDetail ? quoteTokenDetail.originalSymbol : ''
            }) }}</span>
            <span class="__center-tb-item left __ellipsis depth quantity">{{ $t('trade.amountTitle', {
                amount: tradeTokenDetail ? tradeTokenDetail.originalSymbol : ''
            }) }}</span>
            <span class="__center-tb-item __ellipsis depth amount">{{ $t('trade.quantityTitle', {
                quantity: quoteTokenDetail ? quoteTokenDetail.originalSymbol : ''
            }) }}</span>
        </div>

        <div class="depth-content-wrapper" :class="{'one': (isShowBuy || isShowSell) && !(isShowBuy && isShowSell)}">
            <div class="depth-table" :class="{'show-all': isShowBuy && isShowSell}">
                <depth-table v-show="isShowSell" class="sell" dataType="sell" :depthData="depthSell"></depth-table>
            </div>
            <price></price>
            <depth-table v-show="isShowBuy" class="depth-table" :class="{
                'show-all': isShowBuy && isShowSell
            }" dataType="buy" :depthData="depthBuy"></depth-table>
        </div>
    </div>
</template>

<script>
import depthTable from './depthTable';
import mergeDepth from './mergeDepth';
import price from './price';

export default {
    components: { depthTable, price, mergeDepth },
    data() {
        return {
            isShowBuy: true,
            isShowSell: true
        };
    },
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
    },
    methods: {
        showTable(isShowBuy, isShowSell) {
            this.isShowBuy = isShowBuy;
            this.isShowSell = isShowSell;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.depth-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .depth-content-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        &.one {
            flex: 1;
            overflow: auto;
        }
    }

    .depth-table {
        position: relative;
        width: 100%;
        &.show-all {
            flex: 1;
            overflow: hidden;

            .sell {
                position: absolute;
                bottom: 0;
            }
        }
        .sell {
            width: 100%;
        }
    }
}
</style>
