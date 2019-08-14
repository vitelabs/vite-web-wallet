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
            return this.$store.state.exchangeActiveTxPair.realClosePrice;
        },
        closePrice() {
            return this.activeTxPair && this.activeTxPair.closePrice ? this.activeTxPair.closePrice : '';
        },
        documentTitle() {
            if (!this.activeTxPair) {
                return Default_Title;
            }

            return `${ BigNumber.onlyFormat(this.closePrice) } | ${ this.activeTxPair.symbol }`;
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
