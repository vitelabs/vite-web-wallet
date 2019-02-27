<template>
    <div class="depth-table-wrapper">
        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        
        <div class="__center-tb-row __pointer" @click="clickRow(item)"
             v-for="(item, i) in depthData" :key="i">
            <span class="__center-tb-item" :class="dataType">{{ formatNum(item.price, 'ttoken') }}</span>
            <span class="__center-tb-item">{{ formatNum(item.quantity, 'ftoken') }}</span>
            <span class="__center-tb-item">{{ formatNum(item.amount, 'ttoken') }}</span>
            <span class="percent-wrapper" :class="dataType" :style="{ 'width': getWidth(item) + '%' }"></span>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import loading from 'components/loading';

export default {
    components: {
        loading
    },
    props: {
        dataType: {
            type: String,
            default: ''
        },
        depthData: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    destroyed() {
        this.$store.dispatch('exStopDepthTimer');
    },
    computed: {
        isLoading() {
            if (this.dataType === 'buy') {
                return this.$store.state.exchangeDepth.isBuyLoading;
            }
            return this.$store.state.exchangeDepth.isSellLoading;
        },
        ttoken() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        ftoken() {
            return this.$store.state.exchangeTokens.ftoken;
        }
    },
    methods: {
        formatNum(num, type) {
            if (!this[type]) {
                return BigNumber.formatNum(num);
            }
            return BigNumber.formatNum(num, this[type].tokenDigit); 
        },
        getWidth(item) {
            // let maxPrice = this.depthData[0].price;
            let maxPrice = 10000;
            let width = BigNumber.dividedToNumber(item.price, maxPrice, 2).toString() * 100;
            return width > 100 ? 100 : width;
        },
        clickRow(data) {
            let price = data.price;
            let quantity = data.quantity;
            let txSide = this.dataType === 'buy' ? 0 : 1;
            this.$store.commit('exSetActiveTx', {
                price, quantity, txSide
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';
.depth-table-wrapper {
    position: relative;
}
.percent-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    &.buy {
        background: rgba(91,197,0,0.05);;
    }
    &.sell {
        background: rgba(229,73,77,0.05);
    }
}
</style>
