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

        <div ref="depthContentWrapper" class="depth-content-wrapper">
            <span v-show="miningPriceText" class="mining-price" :style="`top: ${top}px`">{{ miningPriceText }}</span>

            <depth-table v-show="isShowSell" :isShowAll="isShowBuy && isShowSell"
                         dataType="sell" :depthData="depthSell"
                         @showMiningPrice="showSellMiningPrice"
                         @hideMiningPrice="hideMiningPrice"></depth-table>
            <price v-if="isShowBuy && isShowSell" class="border_all"></price>
            <depth-table v-show="isShowBuy" :isShowAll="isShowBuy && isShowSell"
                         dataType="buy" :depthData="depthBuy"
                         @showMiningPrice="showBuyMiningPrice"
                         @hideMiningPrice="hideMiningPrice"></depth-table>
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
            isShowSell: true,
            miningPriceText: '',
            top: 0
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
        },
        showSellMiningPrice(top) {
            this.miningPriceText = this.$t('tradeCenter.depthSellMiningPrice');
            this.showMiningPrice(top);
        },
        showBuyMiningPrice(top) {
            this.miningPriceText = this.$t('tradeCenter.depthBuyMiningPrice');
            this.showMiningPrice(top);
        },
        showMiningPrice(top) {
            const wrapperTop = this.$refs.depthContentWrapper.getBoundingClientRect().top;
            this.top = top - wrapperTop;
        },
        hideMiningPrice() {
            this.miningPriceText = '';
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.depth-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .depth-content-wrapper {
        position: absolute;
        top: 60px;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        &.only-sell {
            flex: 1;
            overflow: auto;
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

.mining-price {
    position: absolute;
    left: -10px;
    transform: translateX(-100%) translateY(-50%);
    line-height: 16px;
    padding: 10px;
    font-size: 12px;
    @include font-family-normal();
    color: rgba(94,104,117,1);
    background: rgba(215,215,215,1);
    box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);

    &::after {
        content: ' ';
        border: 5px solid transparent;
        border-left: 5px solid #d7d7d7;
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -5px;
        margin-right: -10px;
    }
}
</style>
