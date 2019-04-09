<template>
    <div class="price-wrapper">
        <span class="price" :class="{
            'up': +upDown > 0,
            'down': +upDown < 0
        }">{{ activeTxPair && activeTxPair.price ? activeTxPair.price : '' }}</span>
        <span v-show="+upDown !== 0" class="p-icon" :class="{
            'up-icon': +upDown > 0,
            'down-icon': +upDown < 0
        }"></span>
        <span class="real-price">{{ realPrice }}</span>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';

export default {
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        upDown() {
            return this.activeTxPair && this.activeTxPair.upDownPre ? this.activeTxPair.upDownPre : '0';
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
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.price-wrapper {
    height: 30px;
    line-height: 30px;
    border-top: 1px solid rgba(229, 237, 243, 1);
    border-bottom: 1px solid rgba(229, 237, 243, 1);
    text-align: center;
    font-family: $font-bold, arial, sans-serif;
    font-weight: 600;

    .price {
        font-size: 14px;

        &.down {
            color: $down-font-color;
        }

        &.up {
            color: $up-font-color;
        }
    }

    .p-icon {
        display: inline-block;
        width: 10px;
        height: 12px;
        margin-bottom: -1px;

        &.up-icon {
            background: url('~assets/imgs/ex-up-arrow.svg');
            background-size: 100% 100%;
        }

        &.down-icon {
            background: url('~assets/imgs/ex-down-arrow.svg');
            background-size: 100% 100%;
        }
    }

    .real-price {
        font-size: 12px;
        color: #24272b;
    }
}
</style>
