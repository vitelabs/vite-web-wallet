<template>
    <div class="depth-table" :class="{ 'show-all': isShowAll, 'sell': dataType === 'sell' }">
        <div ref="depthTable" class="depth-table-wrapper">
            <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
            <price v-if="!isShowAll && dataType === 'buy'" class="border_b"></price>
            <div class="__center-tb-row __pointer" :ref="`depthRow${i}`"
                 @click="clickRow(item, i)"
                 @mouseenter="showTips(item, i)"
                 @mouseleave="hideTips(item)"
                 :class="{
                     'in_mining': miningSeparatorArr.indexOf(i) !== -1,
                     'border_b': (miningSeparator >= 0 && dataType === 'buy' && i === miningSeparator) || dataType === 'buy' && selectIndex === i,
                     'border_t': (miningSeparator >= 0 && dataType === 'sell' && i === miningSeparator) || dataType === 'sell' && selectIndex === i,
                     'in_select_range': isInRange(i),
                     'selected_row': i === selectIndex
                 }"
                 v-for="(item, i) in depthData" :key="i">
                <span class="__center-tb-item depth price __ellipsis" :class="dataType">
                    <span class="owner" v-if="isInOpenOrders(item.price)"></span>
                    <span class="not-owner" v-else></span>
                    {{ formatNum(item.price, quoteTokenDepthDigit) }}
                </span>
                <span class="__center-tb-item left depth quantity">{{ formatNum(item.quantity, tradeTokenDigit) }}</span>
                <span class="__center-tb-item depth amount">{{ formatNum(item.amount, quoteTokenDigit) }}</span>
                <span class="percent-wrapper" :class="dataType" :style="{ 'width': getWidth(item) + '%' }"></span>
            </div>
            <price v-if="!isShowAll && dataType === 'sell'" :class="{
                'border_all': depthData.length,
                'border_b': !depthData.length
            }"></price>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import loading from 'components/loading';
import tooltips from 'components/tooltips';
import price from './price';

export default {
    components: { loading, price, tooltips },
    props: {
        dataType: {
            type: String,
            default: ''
        },
        depthData: {
            type: Array,
            default: () => []
        },
        isShowAll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return { selectIndex: null };
    },
    destroyed() {
        this.$store.dispatch('exStopDepthTimer');
    },
    computed: {
        miningSeparatorArr() {
            if (this.miningSeparator < 0) {
                return [];
            }

            const arr = [];
            if (this.dataType === 'buy') {
                for (let i = 0; i <= this.miningSeparator; i++) {
                    arr.push(i);
                }
                return arr;
            }

            for (let i = this.miningSeparator; i < this.depthData.length; i++) {
                arr.push(i);
            }
            return arr;
        },
        miningSeparator() {
            return this.dataType === 'buy'
                ? this.$store.getters.exDepthBuyMiningSeparator
                : this.$store.getters.exDepthSellMiningSeparator;
        },
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
            return this.$store.getters.quoteTokenDecimalsLimit;
        },
        tradeTokenDigit() {
            return this.$store.getters.tradeTokenDecimalsLimit;
        },
        quoteTokenDepthDigit() {
            const quoteTokenDigit = this.quoteTokenDigit;
            if ((this.depthStep || this.depthStep === 0) && quoteTokenDigit > this.depthStep) {
                return this.depthStep;
            }
            return quoteTokenDigit;
        },
        depthStep() {
            return this.$store.state.exchangeDepth.depthStep;
        }
    },
    methods: {
        showTips(item, i) {
            const elTop = this.$refs[`depthRow${ i }`][0].getBoundingClientRect().top;
            const rowHeight = this.$refs[`depthRow${ i }`][0].clientHeight;
            let isInMiningRange = this.miningSeparator >= 0 && this.miningSeparator - i <= 0;

            this.selectIndex = i;
            if (this.dataType === 'buy') {
                isInMiningRange = this.miningSeparator >= 0 && this.miningSeparator - i >= 0;
                return this.$emit('showTips', elTop + rowHeight, isInMiningRange, i);
            }
            this.$emit('showTips', elTop, isInMiningRange, i);
        },
        isInRange(i) {
            if (this.selectIndex === null) return false;
            if (this.dataType === 'buy') {
                return i <= this.selectIndex;
            }
            return i >= this.selectIndex;
        },
        hideTips() {
            this.$emit('hideTips');
            this.selectIndex = null;
        },
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
        formatNum(num, digit) {
            return BigNumber.formatNum(num, digit, digit);
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
@import '../center.scss';

.depth-table {
    position: relative;
    height: 100%;
}
.show-all {
    flex: 1;
    min-height: 0;
    height: inherit;
    &.sell {
        overflow: hidden;
        .depth-table-wrapper {
            height: auto;
            position: absolute;
            width: 100%;
            bottom: 0;
        }
    }
    .depth-table-wrapper {
        overflow: hidden;
    }
}
.border_b {
    @include center_border(bottom);
}
.border_all {
    @include center_border(top);
    @include center_border(bottom);
}

.depth-table-wrapper {
    height: 100%;
    overflow: auto;
    position: relative;
    font-family: $font-H;
}

.__center-tb-row {
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    padding-left: 0;
    &.in_select_range {
        [data-theme="0"] & {
            background: rgba(75,116,255,0.05);
        }
        [data-theme="1"] & {
            background: rgba(75,116,255,0.1);
        }
    }
    &.in_mining {
        [data-theme="0"] & {
            background: rgba(75,116,255,0.05);
        }
        [data-theme="1"] & {
            background: rgba(75,116,255,0.1);
        }
    }
    &.border_b {
        border-bottom: 1px dashed rgba(189,196,208,1);
    }
    &.border_t {
        border-top: 1px dashed rgba(189,196,208,1);
    }
    &.selected_row {
        font-weight: 600;
    }
}

.__center-tb-item .owner {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: url('~assets/imgs/owner.png');
    background-size: 100% 100%;
}

.__center-tb-item {
    .not-owner {
        display: inline-block;
        width: 8px;
        height: 8px;
    }
}

.percent-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    &.buy {
        background: rgba(0, 215, 100, 0.08);
    }
    &.sell {
        background: rgba(237, 81, 88, 0.08);
    }
}
</style>
