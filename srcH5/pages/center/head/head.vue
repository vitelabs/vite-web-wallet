<template>
    <div class="txpair-head-wrapper">
        <token></token>

        <div class="else-wrapper">
            <div class="left">
                <div class="price" :class="{
                    'up': +upDownPrev > 0,
                    'down': +upDownPrev < 0
                }">
                    {{ activeTxPair && activeTxPair.closePrice ? formatNum(activeTxPair.closePrice, activeTxPair.pricePrecision) : '--' }}
                </div>
                <div>
                    <span>≈{{ realPrice }}</span>
                    <span :class="{
                        'up': +upDown > 0,
                        'down': +upDown < 0
                    }">{{ activeTxPair && activeTxPair.upDownPercent ?  upDownIcon + activeTxPair.upDownPercent : '--' }}</span>
                </div>
            </div>

            <div class="right">
                <div class="token-title">
                    <span>{{ $t('trade.head.highPrice') }}</span>
                    {{ activeTxPair && activeTxPair.highPrice ? activeTxPair.highPrice : '--' }}
                </div>
                <div class="token-title">
                    <span>{{ $t('trade.head.lowPrice') }}</span>
                    {{ activeTxPair && activeTxPair.lowPrice ? activeTxPair.lowPrice : '--' }}
                </div>
                <div class="token-title">
                    <span>{{ $t('trade.head.quantity') }}</span>
                    {{ activeTxPair && activeTxPair.amount ? formatNum(activeTxPair.amount, 1) + ' ' + activeTxPair.originQuoteTokenSymbol : '--' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import token from './token';

export default {
    components: { token },
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Assets/scss/vars.scss';
@import '~h5Assets/scss/center.scss';

.txpair-head-wrapper {
    background: linear-gradient(62deg,rgba(255,255,255,1) 0%,rgba(199,228,255,1) 100%);
    border-radius: 2px;
    padding: 24px 18px;
    overflow: hidden;
    box-sizing: border-box;
    font-size: 12px;

    .else-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .token-title {
        @include font-normal();
        white-space: nowrap;
        line-height: 16px;
        color: rgba(62,74,89,1);
        margin-bottom: 5px;
        span {
            color: rgba(62,74,89,0.6);
        }
    }
    .left {
        @include font-normal();
        color: rgba(62,74,89,0.6);
        font-size: 14px;
        line-height: 18px;
        .price {
            @include font-bold();
            font-size: 24px;
            line-height: 28px;
            color: $blue;
            margin-bottom: 6px;
            &.down {
                color: $down-color;
            }
            &.up {
                color: $up-color;
            }
        }
    }
    .right {
        @include font-normal();
    }
}
</style>
