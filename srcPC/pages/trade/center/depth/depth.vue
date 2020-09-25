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
            <div v-show="showDepthTips" class="depth-tips" :style="`top: ${top}px`">
                <span v-if="isInMiningRange" style="color: red;">{{ this.$t('tradeCenter.inMiningRange') }}</span>
                <div>
                    <div>{{$t('trade.depth.avgPrice')}}</div>
                    <div>≈ {{selectDepth.avgPrice}}</div>
                </div>
                <div>
                    <div>{{$t('trade.depth.sum', {
                        symbol: tradeTokenDetail ? tradeTokenDetail.originalSymbol : ''
                    })}}</div>
                    <div>{{selectDepth.sumInTrade}}</div>
                </div>
                <div>
                    <div>{{$t('trade.depth.sum', {
                        symbol: quoteTokenDetail ? quoteTokenDetail.originalSymbol : ''
                    })}}</div>
                    <div>{{selectDepth.sumInQuote}}</div>
                </div>
            </div>

            <depth-table v-show="isShowSell" :isShowAll="isShowBuy && isShowSell"
                         dataType="sell" :depthData="depthSell"
                         @showTips="showSellTips"
                         @hideTips="hideTips"></depth-table>
            <price v-if="isShowBuy && isShowSell" class="border_all"></price>
            <depth-table v-show="isShowBuy" :isShowAll="isShowBuy && isShowSell"
                         dataType="buy" :depthData="depthBuy"
                         @showTips="showBuyTips"
                         @hideTips="hideTips"></depth-table>
        </div>
    </div>
</template>

<script>
import depthTable from './depthTable';
import mergeDepth from './mergeDepth';
import price from './price';
import BigNumber from 'utils/bigNumber';

export default {
    components: { depthTable, price, mergeDepth },
    data() {
        return {
            isShowBuy: true,
            isShowSell: true,
            showDepthTips: false,
            top: 0,
            isInMiningRange: false,
            selectDepth: {
                avgPrice: 0,
                sumInQuote: 0,
                sumInTrade: 0
            }
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
        },
        quoteTokenDigit() {
            return this.$store.getters.quoteTokenDecimalsLimit;
        },
        tradeTokenDigit() {
            return this.$store.getters.tradeTokenDecimalsLimit;
        }
    },
    methods: {
        showTable(isShowBuy, isShowSell) {
            this.isShowBuy = isShowBuy;
            this.isShowSell = isShowSell;
        },
        showSellTips(top, isInMiningRange, index) {
            this.isInMiningRange = isInMiningRange;
            this.showTips(top);
            this.calTotal(this.depthSell.slice(index));
        },
        showBuyTips(top, isInMiningRange, index) {
            this.isInMiningRange = isInMiningRange;
            this.calTotal(this.depthBuy.slice(0, index + 1));
            this.showTips(top);
        },
        showTips(top) {
            const wrapperTop = this.$refs.depthContentWrapper.getBoundingClientRect().top;
            this.top = top - wrapperTop;
            this.showDepthTips = true;
        },
        hideTips() {
            this.showDepthTips = false;
        },
        calTotal(arr) {
            let sumInQuote = 0;
            let sumInTrade = 0;
            arr.forEach(item => {
                sumInQuote = BigNumber.plus(sumInQuote, item.amount, this.quoteTokenDigit);
                sumInTrade = BigNumber.plus(sumInTrade, item.quantity, this.tradeTokenDigit);
            });
            const avgPrice = BigNumber.dividedToNumber(sumInQuote, sumInTrade, this.quoteTokenDigit);
            this.selectDepth = {
                sumInQuote: BigNumber.formatNum(sumInQuote, this.quoteTokenDigit, this.quoteTokenDigit),
                sumInTrade: BigNumber.formatNum(sumInTrade, this.tradeTokenDigit, this.tradeTokenDigit),
                avgPrice
            };
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
        @include center_border(top);
        @include center_border(bottom);
    }
    .no_border_t {
        border-top: none;
    }
}

.depth-tips {
    position: absolute;
    left: -10px;
    transform: translateX(-100%) translateY(-50%);
    line-height: 16px;
    padding: 10px;
    font-size: 12px;
    @include font-family-normal();
    box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
    border-radius: 4px;

    [data-theme="0"] & {
        color: rgba(94,104,117,1);
        background: rgba(215,215,215,1);
    }
    [data-theme="1"] & {
        color: $white-color;
        background: $black-color-1;
    }

    &::after {
        content: ' ';
        border: 5px solid transparent;
        [data-theme="0"] & {
            border-left: 5px solid #d7d7d7;
        }
        [data-theme="1"] & {
            border-left: 5px solid $black-color-1;
        }
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -5px;
        margin-right: -10px;
    }
    & > div {
        width: 200px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 10px;
    }
}
</style>
