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
                            {{ activeTxPair && activeTxPair.price ? formatNum(activeTxPair.price, activeTxPair.toDecimals) : '--' }}
                        </span>
                        {{ realPrice }}
                    </div>
                </div>
                <div class="updown item-left">
                    <div class="token-title">{{ $t('trade.head.updown') }}</div>
                    <div class="token-content" :class="{
                        'up': +upDown > 0,
                        'down': +upDown < 0
                    }">{{ upDownIcon + (!!activeTxPair ? formatNum(upDown, activeTxPair.toDecimals) : upDown) }}
                        {{ activeTxPair && activeTxPair.upDownPercent ?  upDownIcon + activeTxPair.upDownPercent : '--' }}
                    </div>
                </div>
                <div class="high-price item-left">
                    <div class="token-title">{{ $t('trade.head.highPrice') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.price24hHigh ? activeTxPair.price24hHigh : '--' }}
                    </div>
                </div>
                <div class="low-price item-left">
                    <div class="token-title">{{ $t('trade.head.lowPrice') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.price24hLow ? activeTxPair.price24hLow : '--' }}
                    </div>
                </div>
                <div class="quantity item-left">
                    <div class="token-title">{{ $t('trade.head.quantity') }}</div>
                    <div class="token-content">
                        {{ activeTxPair && activeTxPair.amount24h ? formatNum(activeTxPair.amount24h, 1) + ' ' + activeTxPair.ttokenShow : '--' }}
                    </div>
                </div>
            </div>
        </div>

        <div class="else-point __pointer" @click="showTxPair">
            <div></div>
            <div></div>
            <div></div>
        </div>
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
            let pre = '$';
            if (this.$i18n.locale === 'zh') {
                pre = '￥';
            }
            if (!this.activeTxPair) {
                return `${ pre }0`;
            }
            return pre + BigNumber.multi(this.activeTxPair.price || 0, this.rate || 0, 2);
        },
        rate() {
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const tokenId = this.activeTxPair && this.activeTxPair.ttoken ? this.activeTxPair.ttoken : null;
            const coin = this.$store.state.env.currency;
            if (!tokenId || !rateList[tokenId]) {
                return null;
            }

            return rateList[tokenId][coin] || null;
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
    padding: 0px 14px 10px;
    font-family: $font-bold, arial, sans-serif;
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
            padding-top: 10px;
            min-width: 250px;
            margin-top: -5px;
            margin-right: 20px;
        }
        .else-wrapper {
            padding-top: 10px;
            display: flex;
            flex-direction: row;
            flex: 1;
        }
        .token-title {
            font-family: $font-normal, arial, sans-serif;
            color: #5e6875;
            font-weight: 400;
        }
        .token-content {
            margin-top: 8px;
            font-weight: 600;
            color: rgba(36, 39, 43, 1);
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
        height: 100%;
        box-sizing: border-box;
        padding: 10px 10px;
        div {
            width: 5px;
            height: 5px;
            background: rgba(0,122,255,0.7);
            border-radius: 5px;
            margin-bottom: 5px;
            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
