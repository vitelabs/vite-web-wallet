<template>
    <div class="depth-wrapper">
        <ul class="ex-tab-list">
            <li :class="{
                    'active': isShowSell && isShowBuy
                }" class="ex-tab __pointer"
                @click="showTable(true, true)"><span>{{ $t('trade.depth.all') }}</span></li>
            <li :class="{
                    'active': isShowBuy && !isShowSell,
                    'active-side': isShowSell && isShowBuy
                }" class="ex-tab __pointer"
                @click="showTable(true, false)"><span>{{ $t('trade.depth.buy') }}</span></li>
            <li :class="{
                    'active': isShowSell && !isShowBuy,
                    'active-side': isShowBuy && !isShowSell
                }" class="ex-tab __pointer"
                @click="showTable(false, true)"><span>{{ $t('trade.depth.sell') }}</span></li>
            <merge-depth></merge-depth>
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
            <price :class="{
                border_all: true,
                no_border_t: !isShowSell || (isShowSell && !isShowBuy && (!depthSell || !depthSell.length))
            }"></price>
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

    .border_all {
        border-top: 1px solid rgba(229, 237, 243, 1);
        border-bottom: 1px solid rgba(229, 237, 243, 1);
    }
    .no_border_t {
        border-top: none;
    }
}
</style>
