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
            return this.$store.getters.activeTxPairRealClosePrice;
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
    display: flex;
    justify-content: center;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-family: $font-H;
    font-weight: 600;
    .price {
        font-size: 14px;
        @include default_font_color();
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
        margin-top: 9px;
        &.up-icon {
            background: url('~assets/imgs/ex-up-arrow.png');
            background-size: 100% 100%;
        }
        &.down-icon {
            background: url('~assets/imgs/ex-down-arrow.png');
            background-size: 100% 100%;
        }
    }
    .real-price {
        font-size: 12px;
        margin-left: 10px;
        @include font_color_to_white(#24272b)
    }
}
</style>
