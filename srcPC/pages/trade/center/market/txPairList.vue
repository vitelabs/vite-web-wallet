<template>
    <div class="tx-pair-wrapper">
        <span v-show="symbol && realPrice" class="real-price" :style="`top: ${top}px`">{{ realPrice }}</span>
        <div ref="txList" class="tx-list">
            <div :ref="`txPair${i}`" v-for="(txPair, i) in showList" :key="i"
                 class="__center-tb-row __pointer"
                 :class="{'active': txPair && txPair.symbol === activeSymbol}"
                 @mouseenter="showRealPrice(txPair, i)"
                 @mouseleave="hideRealPrice(txPair)"
                 @click="setActiveTxPair(txPair)">
                <span class="__center-tb-item tx-pair">
                    <span class="favorite-icon" :class="{'active': !!favoritePairs[txPair.symbol]}"
                          @click.stop="setFavorite(txPair)"></span>
                    <span class="describe">{{ getTxPairShowSymbol(txPair) }}</span>
                </span>
                <span class="__center-tb-item">
                    {{ txPair.closePrice ? formatNum(txPair.closePrice, txPair.pricePrecision) : '--' }}
                </span>
                <span v-show="showCol === 'updown'" class="__center-tb-item percent" :class="{
                    'up': +txPair.priceChange > 0,
                    'down': +txPair.priceChange < 0
                }">{{ txPair.priceChangePercent ? getPercent(txPair.priceChangePercent) : '0.00%' }}</span>
                <span v-show="showCol === 'txNum'" class="__center-tb-item">
                    {{ txPair.amount ? formatNum(txPair.amount, transLimit) : '0.0' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';

export default {
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
            top: 0
        };
    },
    computed: {
        transLimit() {
            if (this.isShowFavorite) {
                return 3;
            }
            return this.$store.state.exchangeMarket.categoryTransLimit[this.curentCategory];
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
                _l.push(_t);
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
        }
    },
    methods: {
        getTxPairShowSymbol(txPair) {
            const tradeTokenSymbol = txPair.tradeTokenSymbol.split('-')[0];
            const quoteTokenSymbol = txPair.quoteTokenSymbol.split('-')[0];
            return `${ tradeTokenSymbol }/${ quoteTokenSymbol }`;
        },
        getPercent(num) {
            return `${ BigNumber.multi(num, 100, 2) }%`;
        },
        formatNum(num, fix) {
            return BigNumber.formatNum(num, fix);
        },
        showRealPrice(txPair, i) {
            const elTop = this.$refs[`txPair${ i }`][0].getBoundingClientRect().top;
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

            const _price = BigNumber.multi(txPair.closePrice || 0, rate || 0, 6);
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

            const pre = this.$store.state.env.currency === 'cny' ? '≈¥' : '≈$';
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
                    return BigNumber.compared(a.priceChangePercent, b.priceChangePercent);
                case 'upDownDown':
                    return BigNumber.compared(b.priceChangePercent, a.priceChangePercent);
                case 'txNumUp':
                    return BigNumber.compared(a.amount, b.amount);
                case 'txNumDown':
                    return BigNumber.compared(b.amount, a.amount);
                default:
                    return compareStr(a.tradeTokenSymbol, b.tradeTokenSymbol);
                }
            });
        },
        setActiveTxPair(txPair) {
            statistics.event(`${ this.$route.name }_trade_pair`, txPair.symbol, this.address || '');
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
        background: rgba(215,215,215,1);
        box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
        border: 1px solid rgba(212,222,231,1);
        font-size: 12px;
        line-height: 18px;
        color: rgba(94,104,117,1);
        font-family: $font-H;
        font-weight: 400;

        &::after {
            content: ' ';
            border: 5px solid transparent;
            border-right: 5px solid rgba(215,215,215,1);
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
        display: inline-block;
        width: 80px;
    }

    &.active {
        background: rgba(75, 116, 255, 0.1);
    }
}

</style>
