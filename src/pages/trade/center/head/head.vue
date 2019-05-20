<template>
    <div class="txpair-head-wrapper">
        <token class="token-wrapper"></token>

        <div class="else-wrapper">
            <div class="latest-price item-left">
                <div class="token-title">{{ $t('trade.head.latestPrice') }}</div>
                <div class="token-content">
                    <span :class="{
                        'up': +upDownPre > 0,
                        'down': +upDownPre < 0
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
                }">{{ upDownIcon + upDown }}
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
        upDownPre() {
            return this.activeTxPair && this.activeTxPair.upDownPre ? this.activeTxPair.upDownPre : '0';
        },
        upDown() {
            return this.activeTxPair && this.activeTxPair.upDown ? this.formatNum(this.activeTxPair.upDown, this.activeTxPair.toDecimals) : '0';
        },
        upDownIcon() {
            if (this.upDown && this.upDown > 0) {
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
            const coin = this.$store.state.exchangeRate.coins[this.$i18n.locale || 'zh'];
            if (!tokenId || !rateList[tokenId]) {
                return null;
            }

            return rateList[tokenId][coin] || null;
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
@import '../center.scss';

.txpair-head-wrapper {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    padding: 10px 14px;
    font-family: $font-bold, arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    white-space: nowrap;
    background: rgba(247,249,251,1);

    .token-wrapper {
        float: left;
        margin-top: -5px;
    }
    .else-wrapper {
        display: flex;
        flex-direction: row;
        float: left;
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

@media only screen and (max-width: 1400px) {
    .txpair-head-wrapper {
        flex-direction: column;
        height: 120px;
        .else-wrapper {
            margin-top: 6px;
        }
    }
    .item-left:first-child {
        margin-left: 0px;
    }
}
</style>
