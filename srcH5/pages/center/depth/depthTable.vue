<template>
    <div class="depth-table-wrapper">
        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>

        <div class="__center-tb-row" :class="dataType" @click="clickRow(item, i)"
             v-for="(item, i) in depthData" :key="i">
            <span v-if="dataType === 'buy'" class="quantity">{{ formatNum(item.quantity, 'ftoken') }}</span>
            <span class="price">{{ formatNum(item.price, 'ttoken') }}
                <span class="owner" v-show="isInOpenOrders(item.price)"></span>
            </span>
            <span v-if="dataType === 'sell'" class="quantity">{{ formatNum(item.quantity, 'ftoken') }}</span>
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
            return this.$store.state.exchangeDepth.isLoading;
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
        },
        currentOpenOrders() {
            return this.$store.state.exchangeCurrentOpenOrders.list;
        },
        quoteTokenDigit() {
            const quoteTokenDigit = this.$store.getters.quoteTokenDecimalsLimit;
            if ((this.depthStep || this.depthStep === 0) && quoteTokenDigit > this.depthStep) {
                return this.depthStep;
            }
            return quoteTokenDigit;
        },
        tradeTokenDigit() {
            const tradeTokenDigit = this.$store.getters.tradeTokenDecimalsLimit;
            if ((this.depthStep || this.depthStep === 0) && tradeTokenDigit > this.depthStep) {
                return this.depthStep;
            }
            return tradeTokenDigit;
        },
        depthStep() {
            return this.$store.state.exchangeDepth.depthStep;
        }
    },
    methods: {
        isInOpenOrders(price) {
            if (!this.currentOpenOrders) {
                return false;
            }

            for (let i = 0; i < this.currentOpenOrders.length; i++) {
                const openOrder = this.currentOpenOrders[i];
                if (!BigNumber.isEqual(openOrder.price, price)) {
                    continue;
                }
                if ((this.dataType === 'sell' && openOrder.side === 1)
                    || (this.dataType === 'buy' && openOrder.side === 0)) {
                    return true;
                }
            }

            return false;
        },
        formatNum(num, type) {
            if (type === 'ttoken') {
                return BigNumber.formatNum(num, this.quoteTokenDigit);
            }
            return BigNumber.formatNum(num, this.tradeTokenDigit);
        },
        getWidth(item) {
            const width = BigNumber.dividedToNumber(item.quantity, this.maxQuantity, 2).toString() * 100;
            return width > 100 ? 100 : width;
        },
        clickRow(data, index) {
            const price = data.price;
            const quantity = data.quantity;
            const side = this.dataType === 'buy' ? 0 : 1;

            let num = 0;
            if (side) {
                for (let i = index; i < this.depthData.length; i++) {
                    num = BigNumber.plus(num, this.depthData[i].quantity, this.ftoken.tokenDecimals);
                }
            } else {
                for (let i = 0; i <= index; i++) {
                    num = BigNumber.plus(num, this.depthData[i].quantity, this.ftoken.tokenDecimals);
                }
            }

            this.$store.commit('exSetActiveTx', {
                price,
                quantity,
                side,
                num
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~h5Assets/scss/vars.scss';

.depth-table-wrapper {
    position: relative;
}

.__center-tb-row {
    position: relative;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    @include font-bold();
    display: flex;
    flex-direction: row;
    color: rgba(94,104,117,1);
    justify-content: space-between;
    white-space: nowrap;
    .price {
        max-width: 50%;
    }
    .owner {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: url('~assets/imgs/owner.svg');
        background-size: 100% 100%;
    }
    &.buy {
        padding-left: 4px;
        .quantity {
            color: $green;
        }
    }
    &.sell {
        padding-right: 4px;
        .quantity {
            color: $red;
        }
    }
}

.percent-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    &.buy {
        background: rgba(0,215,100,0.08);
    }

    &.sell {
        background: rgba(237,81,88,0.08);
    }
}
</style>
