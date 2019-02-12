<template>
    <div class="txpair-head-wrapper">
        <token></token>
        <div class="latest-price">
            <div class="token-title">{{ $t('exchange.head.latestPrice') }}</div>
            <div class="token-content">
                <span class="price">
                    {{ activeTxPair && activeTxPair.price ? activeTxPair.price : '' }}
                </span>
                {{ realPrice }}
            </div>
        </div>
        <div class="updown">
            <div class="token-title">{{ $t('exchange.head.updown') }}</div>
            <div class="token-content" :class="{
                'up': +upDown > 0,
                'down': +upDown < 0
            }">{{ upDown }} 
                {{ activeTxPair && activeTxPair.upDownPercent ? activeTxPair.upDownPercent : '' }}
            </div>
        </div>
        <div class="high-price">
            <div class="token-title">{{ $t('exchange.head.highPrice') }}</div>
            <div class="token-content">
                {{ activeTxPair && activeTxPair.price24hHigh ? activeTxPair.price24hHigh : '' }}
            </div>
        </div>
        <div class="low-price">
            <div class="token-title">{{ $t('exchange.head.lowPrice') }}</div>
            <div class="token-content">
                {{ activeTxPair && activeTxPair.price24hLow ? activeTxPair.price24hLow : '' }}
            </div>
        </div>
        <div class="quantity">
            <div class="token-title">{{ $t('exchange.head.quantity') }}</div>
            <div class="token-content">
                {{ activeTxPair && activeTxPair.quantity24h ? activeTxPair.quantity24h : '' }}
            </div>
        </div>
    </div>
</template>

<script>
import token from './token';

export default {
    components: {
        token
    },
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        upDown() {
            return this.activeTxPair && this.activeTxPair.upDown ? this.activeTxPair.upDown : '0';
        },
        realPrice() {
            let pre = '$';
            if (this.$i18n.locale === 'zh') {
                pre = '￥';
            }
            if (!this.activeTxPair) {
                return pre + '0';
            }
            console.log(this.rate);
            console.log(this.activeTxPair.price);
            return pre + this.activeTxPair.price * this.rate;
        },
        rate() {
            let rateList = this.$store.state.exchangeRate.rateList || {};
            console.log(rateList);
            let tokenId = this.activeTxPair && this.activeTxPair.ttoken ? this.activeTxPair.ttoken : null;
            let coin = this.$store.state.exchangeRate.coins[this.$i18n.locale || 'zh'];
            if (!tokenId || !rateList[tokenId]) {
                return null;
            }
            return rateList[tokenId][coin] || null;
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.txpair-head-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 10px 14px;
    font-family: $font-bold, arial, sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    .token-title {
        font-family: $font-normal, arial, sans-serif;
        color: rgba(94,104,117,1);
        font-weight: 400;
    }
    .token-content {
        margin-top: 8px;
        font-weight: 600;
        color: rgba(36,39,43,1);
        &.down {
            color: $down-font-color;
        }
        &.up {
            color: $up-font-color
        }
        .price {
            color: $blue;
        }
    }
}
</style>
