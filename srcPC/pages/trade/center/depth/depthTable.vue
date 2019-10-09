<template>
    <div class="depth-table" :class="{
        'show-all': isShowAll,
        'sell': dataType === 'sell',
        'buy': dataType === 'buy'
    }">
        <span v-show="isShowMiningPrice" class="mining-price" :style="`top: ${top}px`">{{ $t('tradeCenter.depthMiningPrice') }}</span>
        <div ref="depthTable" class="depth-table-wrapper">
            <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>

            <div class=" __pointer" :ref="`depthRow${i}`"
                 @click="clickRow(item, i)"
                 @mouseenter="showMiningPrice(item, i)"
                 @mouseleave="hideMiningPrice(item)"
                 :class="{
                     '__center-tb-row': !item.isLine,
                     'in_mining': item.isInMining,
                     'line': item.isLine
            }" v-for="(item, i) in _depthData" :key="i">
                <template v-if="!item.isLine">
                    <span class="__center-tb-item depth price __ellipsis" :class="dataType">
                        {{ formatNum(item.price, quoteTokenDepthDigit) }}
                        <span class="owner" v-show="isInOpenOrders(item.price)"></span>
                    </span>
                    <span class="__center-tb-item left depth quantity">{{ formatNum(item.quantity, tradeTokenDigit) }}</span>
                    <span class="__center-tb-item depth amount">{{ formatNum(item.amount, quoteTokenDigit) }}</span>
                    <span class="percent-wrapper" :class="dataType" :style="{ 'width': getWidth(item) + '%' }"></span>
                </template>
            </div>
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
        },
        isShowAll: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isShowMiningPrice: false,
            top: 0
        };
    },
    destroyed() {
        this.$store.dispatch('exStopDepthTimer');
    },
    computed: {
        _depthData() {
            if (this.dataType !== 'buy') {
                return this.depthData;
            }

            const a = [];
            let isHaveLine = false;
            this.depthData.forEach((item, i) => {
                if (this.isInMining(i)) {
                    item.isInMining = true;
                    a.push(item);
                }

                if (i === 0) {
                    return;
                }

                if (item.isInMining
                    && (
                        (i + 1 >= this.depthData.length && !isHaveLine)
                        || !this.isInMining(i + 1)
                    )
                ) {
                    isHaveLine = true;
                    a.push({
                        price: this.miningPrice,
                        isLine: true
                    });
                }
            });
            return a;
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
        isMining() {
            return this.$store.getters.exIsMining;
        },
        miningPrice() {
            if (this.isMining) {
                return '';
            }
            return this.$store.getters.exMiningPrice;
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
            const quoteTokenDigit = this.$store.getters.quoteTokenDecimalsLimit;
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
        showMiningPrice(item, i) {
            if (!item.isLine) {
                return;
            }

            const elTop = this.$refs[`depthRow${ i }`][0].getBoundingClientRect().top;
            const listTop = this.$refs.depthTable.getBoundingClientRect().top;
            const height = this.$refs.depthTable.clientHeight;
            const top = elTop - listTop;

            if (top > listTop + height) {
                this.hideMiningPrice();
                return;
            }

            this.top = top;
            this.isShowMiningPrice = true;
        },
        hideMiningPrice() {
            this.isShowMiningPrice = false;
        },
        isInMining(i) {
            if (!this.miningPrice
                || i >= this.depthData.length) {
                return false;
            }
            const price = this.depthData[i].price;
            return price >= this.miningPrice;
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
            return BigNumber.formatNum(num, digit);
        },
        getWidth(item) {
            const width = BigNumber.dividedToNumber(item.quantity, this.maxQuantity, 2).toString() * 100;
            return width > 100 ? 100 : width;
        },
        clickRow(data, index) {
            if (data.isLine) {
                return;
            }

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
    &.buy {
        flex: 1;
    }
}
.show-all {
    flex: 1;
    height: inherit;
    &.sell {
        overflow: auto;
    }
    .depth-table-wrapper {
        overflow: hidden;
    }
}
.depth-table-wrapper {
    height: 100%;
    overflow: auto;
    position: relative;
    font-family: $font-H;
}

.mining-price {
    position: absolute;
    left: -10px;
    transform: translateX(-100%) translateY(-50%);
    line-height: 16px;
    padding: 10px;
    font-size: 12px;
    @include font-family-normal();
    color: rgba(94,104,117,1);
    background: rgba(215,215,215,1);
    box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);

    &::after {
        content: ' ';
        border: 5px solid transparent;
        border-left: 5px solid #d7d7d7;
        position: absolute;
        top: 50%;
        right: 0;
        margin-top: -5px;
        margin-right: -10px;
    }
}

.__center-tb-row {
    &.in_mining {
        background: rgba(75,116,255,0.05);
    }
}

.line {
    position: relative;
    border-bottom: 1px dashed rgba(189,196,208,1);
}

.__center-tb-item .owner {
    display: inline-block;
    width: 8px;
    height: 8px;
    background: url('~assets/imgs/owner.svg');
    background-size: 100% 100%;
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
