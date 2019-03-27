<template>
    <div class="depth-table-wrapper">
        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>

        <div class="__center-tb-row __pointer" @click="clickRow(item, i)"
             v-for="(item, i) in depthData" :key="i">
            <span class="__center-tb-item depth price" :class="dataType">{{ formatNum(item.price, 'ttoken') }}</span>
            <span class="__center-tb-item depth quantity">{{ formatNum(item.quantity, 'ftoken', 6) }}</span>
            <span class="__center-tb-item depth amount">{{ formatNum(item.amount, 'ttoken', 6) }}</span>
            <span class="percent-wrapper" :class="dataType" :style="{ 'width': getWidth(item) + '%' }"></span>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import loading from 'components/loading';

export default {
    components: { loading },
    props: {
        dataType: {
            type: String,
            default: ''
        },
        depthData: {
            type: Array,
            default: () => []
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
        },
        maxQuantity() {
            const arr = [].concat(this.depthData);
            arr.sort((a, b) => b.quantity - a.quantity);
            return arr && arr[0] ? arr[0].quantity : 0;
        }
    },
    methods: {
        formatNum(num, type, fix) {
            if (!this[type]) {
                return BigNumber.formatNum(num, fix);
            }
            return BigNumber.formatNum(num, this[type].tokenDigit, fix);
        },
        getWidth(item) {
            const width = BigNumber.dividedToNumber(item.quantity, this.maxQuantity, 2).toString() * 100;
            return width > 100 ? 100 : width;
        },
        clickRow(data, index) {
            const price = data.price;
            const quantity = data.quantity;
            const txSide = this.dataType === 'buy' ? 0 : 1;

            let num = 0;
            if (txSide) {
                for (let i = index; i < this.depthData.length; i++) {
                    num = BigNumber.plus(num, this.depthData[i].quantity, this.ftoken.tokenDigit);
                }
            } else {
                for (let i = 0; i <= index; i++) {
                    num = BigNumber.plus(num, this.depthData[i].quantity, this.ftoken.tokenDigit);
                }
            }

            this.$store.commit('exSetActiveTx', { price, quantity, txSide, num });
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
        background: rgba(79, 227, 148, 0.05);
    }

    &.sell {
        background: rgba(229, 73, 77, 0.05);
    }
}
</style>
