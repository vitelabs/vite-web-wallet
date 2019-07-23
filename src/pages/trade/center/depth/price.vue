<template>
    <div class="price-wrapper">
        <span class="price" :class="{
            'up': +upDownPrev > 0,
            'down': +upDownPrev < 0
        }">{{ activeTxPair && activeTxPair.closePrice ? activeTxPair.closePrice : '' }}</span>
        <span v-show="+upDownPrev !== 0" class="p-icon" :class="{
            'up-icon': +upDownPrev > 0,
            'down-icon': +upDownPrev < 0
        }"></span>
        <span class="real-price">{{ realPrice }}</span>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';

const Default_Title = 'Vite Wallet';

export default {
    mounted() {
        document.title = this.documentTitle;
    },
    destroyed() {
        document.title = Default_Title;
    },
    computed: {
        activeTxPair() {
            return this.$store.getters.exActiveTxPair;
        },
        upDownPrev() {
            return this.activeTxPair ? this.activeTxPair.upDownPrev : '0';
        },
        realPrice() {
            const pre = this.$store.state.env.currency === 'cny' ? '¥' : '$';

            if (!this.activeTxPair) {
                return `${ pre }0`;
            }

            return pre + BigNumber.multi(this.activeTxPair.closePrice || 0, this.rate || 0, 2);
        },
        closePrice() {
            return this.activeTxPair && this.activeTxPair.closePrice ? this.activeTxPair.closePrice : '';
        },
        documentTitle() {
            if (!this.activeTxPair) {
                return Default_Title;
            }

            return `${ BigNumber.formatNum(this.closePrice, 2) } | ${ this.activeTxPair.symbol }`;
        },
        rate() {
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const tokenId = this.activeTxPair && this.activeTxPair.quoteToken ? this.activeTxPair.quoteToken : null;
            const coin = this.$store.state.env.currency;

            if (!tokenId || !rateList[tokenId]) {
                return null;
            }
            return rateList[tokenId][`${ coin }Rate`] || null;
        }
    },
    watch: {
        documentTitle() {
            document.title = this.documentTitle;
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
    // @include font-family-bold();
    font-family: $font-H;
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
