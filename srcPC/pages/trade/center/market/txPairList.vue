<template>
    <div class="tx-pair-wrapper">
        <!-- <span
            v-show="symbol && realPrice"
            class="real-price"
            :style="`top: ${top}px`"
        >{{ realPrice }}</span
        > -->
        <div ref="txList" class="tx-list">
            <div
                :ref="`txPair${i}`"
                :id="`txPair${i}`"
                v-for="(txPair, i) in showList"
                :key="i"
            >
                <Popper
                    trigger="hover"
                    :options="{
                        placement: 'right',
                        modifiers: { offset: { offset: '0,20px' } }
                    }"
                    :boundaries-selector="'body'"
                    :visible-arrow="true"
                >
                    <div class="txPair-tips">
                        <div class="txPair-tips__price">{{ realPrice }}</div>
                        <div class="txPair-tips__divider"></div>
                        <div>
                            <div
                                v-show="!txPair.operatorName"
                                class="txPair-tips__operator--unverified"
                            >
                                Unknown Operator
                            </div>
                            <div class="txPair-tips__mineTitle">
                                {{ getTxPairShowSymbol(txPair) }} Mining
                            </div>
                            <div
                                v-show="
                                    !isTradeMining(txPair) &&
                                        !isOrderMining(txPair)
                                "
                                class="txPair-tips__mineItem"
                            >
                                None
                            </div>
                            <div
                                v-show="isTradeMining(txPair)"
                                class="txPair-tips__mineItem"
                            >
                                MM as Mining
                            </div>
                            <div
                                v-show="isOrderMining(txPair)"
                                class="txPair-tips__mineItem"
                            >
                                Trading as Mining
                            </div>
                        </div>
                    </div>
                    <div
                        style="width:100%"
                        class="__center-tb-row __pointer"
                        :class="{
                            active: txPair && txPair.symbol === activeSymbol,
                            'unknown-operator': !txPair.operatorName
                        }"
                        @mouseenter="showRealPrice(txPair, i)"
                        @mouseleave="hideRealPrice(txPair)"
                        @click="setActiveTxPair(txPair)"
                        slot="reference"
                    >
                        <span class="__center-tb-item tx-pair">
                            <span
                                class="favorite-icon"
                                :class="{
                                    active: !!favoritePairs[txPair.symbol]
                                }"
                                @click.stop="setFavorite(txPair)"
                            ></span>
                            <span class="describe">
                                <span class="des-text __ellipsis">{{
                                    getTxPairShowSymbol(txPair)
                                }}</span>
                                <!-- <img :src="operatorIcon" alt="" srcset="">    -->
                                <!-- todo,anomous operator -->
                                <font-awesome-icon
                                    class="operator-icon"
                                    icon="circle-exclamation"
                                    v-show="!txPair.operatorName"
                                />
                                <div class="mining-icon">
                                    <img
                                        v-show="isMining(txPair) === 1"
                                        src="~assets/imgs/trade_mining.svg"
                                    />
                                    <img
                                        v-show="isMining(txPair) === 2"
                                        src="~assets/imgs/order_mining.svg"
                                    />
                                    <img
                                        v-show="isMining(txPair) === 3"
                                        src="~assets/imgs/mining.svg"
                                    />
                                    {{ miningMultiples(txPair) }}
                                </div>
                            </span>
                        </span>
                        <span class="__center-tb-item">
                            <img
                                v-show="isZeroFee(txPair)"
                                class="zero-fee-icon"
                                src="~assets/imgs/trade/zero_fee.svg"
                            />
                            {{
                                txPair.closePrice
                                    ? formatNum(
                                        txPair.closePrice,
                                        txPair.pricePrecision
                                    )
                                    : '--'
                            }}
                        </span>
                        <span
                            v-show="showCol === 'updown'"
                            class="__center-tb-item percent"
                            :class="{
                                up: +txPair.priceChange > 0,
                                down: +txPair.priceChange < 0
                            }"
                        >{{
                            txPair.priceChangePercent
                                ? getPercent(txPair.priceChangePercent)
                                : '0.00%'
                        }}</span
                        >
                        <span
                            v-show="showCol === 'txNum'"
                            class="__center-tb-item"
                        >
                            {{
                                txPair.amount
                                    ? formatNum(txPair.amount, transLimit)
                                    : '0.0'
                            }}
                        </span>
                    </div>
                </Popper>
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import operatorIcon from 'assets/imgs/operator.png';
import Popper from 'vue-popperjs';

export default {
    components: { Popper },
    props: {
        favoritePairs: {
            type: Object,
            default: () => {
                return {};
            }
        },
        currentRule: {
            type: String,
            default: ''
        },
        isLoading: {
            type: Boolean,
            default: false
        },
        list: {
            type: Array,
            default: () => []
        },
        setFavorite: {
            type: Function,
            default: () => {}
        },
        showCol: {
            type: String,
            default: 'updown'
        }
    },
    data() {
        return {
            symbol: null,
            realPrice: '',
            top: 0,
            operatorIcon
        };
    },
    computed: {
        tradeMiningSymbols() {
            return this.$store.state.exchangeMine.tradeMiningSymbols;
        },
        zeroFeePairs() {
            return this.$store.state.exchangeMine.zeroFeePairs;
        },
        orderMiningSymbols() {
            return this.$store.state.exchangeMine.orderMiningSymbols;
        },
        orderMiningMultiples() {
            return this.$store.state.exchangeMine.orderMiningMultiples;
        },
        transLimit() {
            return this.$store.getters.exCategoryTransLimit;
        },
        isShowFavorite() {
            return this.$store.state.exchangeMarket.isShowFavorite;
        },
        DefaultSymbol() {
            return this.$store.state.exchangeMarket.DefaultSymbol;
        },
        activeSymbol() {
            return this.activeTxPair ? this.activeTxPair.symbol || null : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        showList() {
            if (this.isLoading) {
                return [];
            }

            const list = this.orderList(this.list);
            const _l = [];

            let activeTxPair = null;

            list.forEach(_t => {
                if (this.DefaultSymbol && _t.symbol === this.DefaultSymbol) {
                    activeTxPair = _t;
                }
                if (this.hiddenSymbols.indexOf(_t.symbol) === -1) {
                    _l.push(_t);
                }
            });

            if (activeTxPair) {
                this.setActiveTxPair(activeTxPair);
            } else if (!this.activeTxPair) {
                activeTxPair = list && list.length ? list[0] : null;
                activeTxPair && this.setActiveTxPair(activeTxPair);
            }
            this.$store.commit('clearDefaultSymbol');

            return _l;
        },
        closeMarket() {
            return this.$store.state.exchangeMarket.marketClosed;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        hiddenSymbols() {
            return this.$store.state.uiConfig.hiddenSymbols;
        }
    },
    methods: {
        isMining(item) {
            const isTradeMining = this.isTradeMining(item) ? 1 : 0;
            const isOrderMining = this.isOrderMining(item) ? 2 : 0;
            return isTradeMining + isOrderMining;
        },
        isZeroFee(item) {
            return this.zeroFeePairs.indexOf(item.symbol) > -1;
        },
        miningMultiples(item) {
            const mul = this.orderMiningMultiples[item.symbol];
            return mul ? `X${ mul }` : '';
        },
        isTradeMining(item) {
            return this.tradeMiningSymbols.indexOf(item.symbol) !== -1;
        },
        isOrderMining(item) {
            return this.orderMiningSymbols.indexOf(item.symbol) !== -1;
        },
        getTxPairShowSymbol(txPair) {
            const tradeTokenSymbol = txPair.tradeTokenSymbol.split('-')[0];
            const quoteTokenSymbol = txPair.quoteTokenSymbol.split('-')[0];
            return `${ tradeTokenSymbol }/${ quoteTokenSymbol }`;
        },
        getPercent(num) {
            return `${ BigNumber.multi(num, 100, 2) }%`;
        },
        formatNum(num, fix) {
            return BigNumber.formatNum(num, fix, fix);
        },
        showRealPrice(txPair, i) {
            const elTop = this.$refs[`txPair${ i }`][0].getBoundingClientRect()
                .top;
            const listTop = this.$refs.txList.getBoundingClientRect().top;
            const height = this.$refs.txList.clientHeight;
            const top = elTop - listTop - 8;

            if (top > listTop + height) {
                this.hideRealPrice();
                return;
            }

            this.top = top;
            this.symbol = txPair.symbol;
            this.realPrice = this.getRealPrice(txPair);
        },
        hideRealPrice(txPair) {
            if (this.symbol && txPair.symbol === this.symbol) {
                this.symbol = null;
            }
        },
        getRealPrice(txPair) {
            if (!txPair) {
                return;
            }

            if (this.closeMarket.find(v => v.symbol === txPair.symbol)) {
                return this.$t('tradeCenter.marketClosed', { symbol: txPair.symbol });
            }

            const rate = this.getRate(txPair.quoteToken);
            if (!rate) {
                return txPair.tradeTokenSymbol;
            }

            const _price = BigNumber.multi(txPair.closePrice || 0,
                rate || 0,
                6);
            if (!+_price) {
                return txPair.tradeTokenSymbol;
            }

            let price = '';
            const _realPrice = BigNumber.normalFormatNum(_price, 6);
            const _realPrice2 = BigNumber.normalFormatNum(_realPrice, 2);

            if (+_realPrice2 === 0) {
                price = _realPrice;
            } else {
                price = _realPrice2;
            }

            const pre = `≈${ this.$store.getters.currencySymbol }`;
            return `${ txPair.tradeTokenSymbol }  ${ pre }${ price }`;
        },
        getRate(tokenId) {
            if (!tokenId) {
                return null;
            }
            const rateList = this.$store.getters.currencyRateList || {};
            return rateList[tokenId] || null;
        },
        orderList(list) {
            const compareStr = (aStr, bStr) => {
                for (let i = 0; i < aStr.length; i++) {
                    if (!bStr[i]) {
                        return 1;
                    }

                    return aStr[i].charCodeAt() - bStr[i].charCodeAt();
                }

                return -1;
            };

            if (this.isShowFavorite && this.currentRule !== 'symbol') {
                return list;
            }

            return list.sort((a, b) => {
                switch (this.currentRule) {
                case 'priceUp':
                    return BigNumber.compared(a.closePrice, b.closePrice);
                case 'priceDown':
                    return BigNumber.compared(b.closePrice, a.closePrice);
                case 'upDownUp':
                    return BigNumber.compared(a.priceChangePercent,
                        b.priceChangePercent);
                case 'upDownDown':
                    return BigNumber.compared(b.priceChangePercent,
                        a.priceChangePercent);
                case 'txNumUp':
                    return BigNumber.compared(a.amount, b.amount);
                case 'txNumDown':
                    return BigNumber.compared(b.amount, a.amount);
                default:
                    return compareStr(a.tradeTokenSymbol,
                        b.tradeTokenSymbol);
                }
            });
        },
        setActiveTxPair(txPair) {
            statistics.event(`${ this.$route.name }_trade_pair`,
                txPair.symbol,
                this.address || '');
            this.$store.dispatch('exFetchActiveTxPair', txPair);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.tx-pair-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    height: 1px;

    .real-price {
        position: absolute;
        padding: 8px;
        right: -10px;
        z-index: 1;
        transform: translateX(100%);
        [data-theme='0'] & {
            color: rgba(94, 104, 117, 1);
            background: rgba(215, 215, 215, 1);
            box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
        }
        [data-theme='1'] & {
            color: $white-color;
            background: $black-color-1;
        }
        font-size: 12px;
        line-height: 18px;
        font-family: $font-H;
        font-weight: 400;

        &::after {
            content: ' ';
            border: 5px solid transparent;
            [data-theme='0'] & {
                border-right: 5px solid rgba(215, 215, 215, 1);
            }
            [data-theme='1'] & {
                border-right: 5px solid $black-color-1;
            }
            position: absolute;
            top: 50%;
            left: 0;
            margin-top: -5px;
            margin-left: -10px;
        }
    }

    .tx-list {
        flex: 1;
        overflow: auto;
    }
}

.__center-tb-row {
    font-family: $font-H;
    .__center-tb-item {
        position: relative;
    }
    .describe {
        display: flex;
        width: 80px;
        box-sizing: border-box;
        align-items: center;
        .des-text {
            flex: 1;
        }
        .operator-icon {
            margin-right: 3px;
            color: #ffc6c6;
            background-color: red;
            border-radius: 50%;
        }
        .mining-icon {
            color: $blue-color-1;
            display: flex;
            align-items: center;
        }
        img {
            width: 12px;
            height: 12px;
            margin-bottom: -2px;
        }
    }
    .zero-fee-icon {
        width: 18px;
        height: 10px;
        position: absolute;
        left: 0;
    }
    &.unknown-operator {
        color: #a4acb8;
    }
    &.active {
        background: rgba(75, 116, 255, 0.1);
    }
}
.txPair-tips {
    background-color: #d7d7d7;
    padding: 8px 12px;
    position: relative;
    font-size: 12px;
    color: #1d2024;
    &__price {
        font-weight: 600;
    }
    &__divider {
        border-top: 1px dashed #007aff;
        margin: 9px 0px;
        width: 100%;
    }
    &__operator--unverified {
        color: #e02020;
        margin-bottom: 6px;
    }
    &__mineTitle {
        margin-bottom: 6px;
    }
    &__mineItem {
        color: #5e6875;
    }
    &::before {
        content: '';
        border-right: 10px solid #d7d7d7;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        position: absolute;
        top: 50%;
        left: -10px;
        transform: translateY(-50%);

        //           content: '';
        //   position: absolute;
        //   left: 0;
        //   top: 50%;
        //   display: block;
        //   border-right: 5px solid red;
        //   border-bottom: 5px solid red;
        //   width: 25px;
        //   height: 25px;
        //   transform: translate(-50%, -50%) rotate(-45deg);
    }
}
</style>
