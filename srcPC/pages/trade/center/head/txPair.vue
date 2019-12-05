<template>
    <confirm class="dex-token" :title="$t('trade.txPairDetail.title')"
             :showMask="true" :closeIcon="true" :close="close">
        <div class="tx-pair-wrapper">
            <div class="tx-pair-item">
                <div class="item-title">{{ $t('trade.txPairDetail.24h') }}</div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.openPrice') }}:</span>
                    {{ activeTxPair ? activeTxPair.openPrice : '--' }}
                </div>
                <div class="item-row" :class="{
                    'up': +upDown > 0,
                    'down': +upDown < 0
                }">
                    <span>{{ $t('trade.upDown') }}:</span>
                    {{ percent }}
                </div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.quantity') }}:</span>
                    {{ quantity24h }}
                </div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.amount') }}:</span>
                    {{ amount24h  }}
                </div>
            </div>
            <div class="tx-pair-item">
                <div class="item-title">{{ $t('trade.txPairDetail.status')  }}</div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.latest') }}:</span>
                    {{ activeTxPair ? activeTxPair.closePrice : '--'  }}
                </div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.buy') }}:</span>
                    {{ buyOne || '--' }}
                </div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.sell') }}:</span>
                    {{ sellOne || '--' }}
                </div>
                <div class="item-row">
                    <span>{{ $t('trade.txPairDetail.diff') }}:</span>
                    {{ diff || '--' }}
                </div>
            </div>
        </div>
    </confirm>
</template>

<script>
import confirm from 'pcComponents/confirm/confirm.vue';
import BigNumber from 'utils/bigNumber';

export default {
    components: { confirm },
    props: {
        close: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        percent() {
            return this.activeTxPair && this.activeTxPair.upDownPercent ? this.activeTxPair.upDownPercent : '--';
        },
        upDown() {
            return this.activeTxPair ? this.activeTxPair.upDown : 0;
        },
        quantity24h() {
            if (!this.activeTxPair || !this.activeTxPair.quantity) {
                return '--';
            }

            return `${ BigNumber.formatNum(this.activeTxPair.quantity, 1) } ${ this.activeTxPair.tradeTokenSymbol }`;
        },
        amount24h() {
            if (!this.activeTxPair || !this.activeTxPair.amount) {
                return '--';
            }

            return `${ BigNumber.formatNum(this.activeTxPair.amount, 1) } ${ this.activeTxPair.quoteTokenSymbol }`;
        },
        buyOne() {
            return this.$store.getters.activeTxPairBuyOnePrice;
        },
        sellOne() {
            return this.$store.getters.activeTxPairSellOnePrice;
        },
        diff() {
            if (!this.sellOne && !this.buyOne) {
                return '--';
            }
            if (!this.sellOne) {
                return `-${ this.buyOne }`;
            }
            return this.formatNum(this.sellOne - (this.buyOne || 0));
        }
    },
    methods: {
        formatNum(num, fix = 8) {
            if (this.activeTxPair && this.activeTxPair.toDecimals < fix) {
                fix = this.activeTxPair.toDecimals;
            }

            return BigNumber.formatNum(num, fix);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import '../center.scss';

.tx-pair-wrapper {
    display: flex;
    flex-direction: row;
    .tx-pair-item {
        flex: 1;
        font-size: 12px;
        @include font-family-bold();
        font-weight: 600;
        line-height: 16px;
        .item-title {
            color: rgba(29,32,36,1);
            &:before {
                display: inline-block;
                content: ' ';
                width: 5px;
                height: 5px;
                background: rgba(0,122,255,1);
                margin-right: 6px;
                margin-bottom: 2px;
                border-radius: 5px;
            }
        }
        .item-row {
            color: rgba(36,39,43,1);
            margin-top: 15px;
            margin-left: 12px;
            &.down {
                color: $down-font-color;
            }
            &.up {
                color: $up-font-color;
            }
            span {
                @include font-family-normal();
                font-weight: 400;
                color: rgba(94,104,117,1);
            }
        }
    }
}
</style>
