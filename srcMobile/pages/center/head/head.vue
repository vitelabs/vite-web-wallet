<template>
    <div class="txpair-head-wrapper">
        <div class="content">
            <token class="token-wrapper"></token>

            <div class="else-wrapper">
                <div class="latest-price">
                    <div class="token-title">{{ $t('trade.head.latestPrice') }}</div>
                    <div class="token-content">
                        <span :class="{
                            'up': +upDownPrev > 0,
                            'down': +upDownPrev < 0
                        }">
                            {{ activeTxPair && activeTxPair.closePrice ? formatNum(activeTxPair.closePrice, activeTxPair.pricePrecision) : '--' }}
                        </span>
                        {{ realPrice }}
                    </div>
                </div>
                <div class="updown item-left">
                    <div class="token-title">{{ $t('trade.head.updown') }}</div>
                    <div class="token-content" :class="{
                        'up': +upDown > 0,
                        'down': +upDown < 0
                    }">{{ upDownIcon + (!!activeTxPair ? formatNum(upDown, activeTxPair.pricePrecision) : upDown) }}
                        {{ activeTxPair && activeTxPair.upDownPercent ?  upDownIcon + activeTxPair.upDownPercent : '--' }}
                    </div>
                </div>
                <div class="high-price item-left">
                    <div class="token-title">{{ $t('trade.head.highPrice') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.highPrice ? activeTxPair.highPrice : '--' }}
                    </div>
                </div>
                <div class="low-price item-left">
                    <div class="token-title">{{ $t('trade.head.lowPrice') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.lowPrice ? activeTxPair.lowPrice : '--' }}
                    </div>
                </div>
                <div class="quantity item-left">
                    <div class="token-title">{{ $t('trade.head.quantity') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.amount ? formatNum(activeTxPair.amount, 1) + ' ' + activeTxPair.originQuoteTokenSymbol : '--' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="else-point __pointer" @click="showTxPair"></div>
        <tx-pair v-show="isShowTxPair" :close="hideTxPair"></tx-pair>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import token from './token';
import txPair from './txPair';

export default {
    components: { token, txPair },
    data() {
        return { isShowTxPair: false };
    },
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        upDownPrev() {
            return this.activeTxPair ? this.activeTxPair.upDownPrev : '0';
        },
        upDown() {
            return this.activeTxPair ? this.activeTxPair.upDown : 0;
        },
        upDownIcon() {
            if (this.upDown && +this.upDown > 0) {
                return '+';
            }
            return '';
        },
        realPrice() {
            return this.$store.state.exchangeActiveTxPair.realClosePrice;
        }
    },
    methods: {
        formatNum(num, fix) {
            return BigNumber.formatNum(num, fix);
        },
        showTxPair() {
            this.isShowTxPair = true;
        },
        hideTxPair() {
            this.isShowTxPair = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.txpair-head-wrapper {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0px 14px 5px;
    @include font-family-bold();
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    background: rgba(247,249,251,1);
    align-items: center;

    .content {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        .token-wrapper {
            padding-top: 8px;
            min-width: 250px;
            margin-right: 20px;
        }
        .else-wrapper {
            padding-top: 8px;
            display: flex;
            flex-direction: row;
            flex: 1;
        }
        .token-title {
            @include font-family-normal();
            color: #5e6875;
            font-weight: 400;
            white-space: nowrap;
        }
        .token-content {
            font-family: $font-H;
            margin-top: 4px;
            font-weight: 600;
            color: #1d2024;
            &.down {
                color: $down-font-color;
            }
            &.up {
                color: $up-font-color;
            }
            .price {
                color: $blue;
            }
        }
        .item-left {
            margin-left: 20px;
        }
    }

    .else-point {
        display: inline-block;
        height: 24px;
        padding: 2px 10px;
        background: url('~assets/imgs/more-tx-detail.svg') right bottom no-repeat;
        background-size: 4px 24px;
    }
}
</style>
