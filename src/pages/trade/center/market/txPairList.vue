<template>
    <div class="tx-pair-wrapper">
        <span v-show="pairCode && realPrice" class="real-price" :style="`top: ${top}px`">{{ realPrice }}</span>
        <div ref="txList" class="tx-list">
            <div :ref="`txPair${i}`" v-for="(txPair, i) in showList" :key="i"
                 class="__center-tb-row __pointer"
                 :class="{'active': txPair && txPair.pairCode === activePairCode}"
                 @mouseenter="showRealPrice(txPair, i)"
                 @mouseleave="hideRealPrice(txPair)"
                 @click="setActiveTxPair(txPair.rawData)">
                <span class="__center-tb-item tx-pair">
                    <span class="favorite-icon" :class="{'active': !!favoritePairs[txPair.pairCode]}"
                          @click.stop="setFavorite(txPair.rawData)"></span>
                    <span class="describe">{{ txPair.showPair }}</span>
                </span>
                <span class="__center-tb-item">
                    {{ txPair.price ? formatNum(txPair.price, txPair.rawData.toDecimals) : '--' }}
                </span>
                <span v-show="showCol === 'updown'" class="__center-tb-item percent" :class="{
                    'up': +txPair.price24hChange > 0,
                    'down': +txPair.price24hChange < 0
                }">{{ txPair.price24hChange ? getPercent(txPair.price24hChange) : '--' }}</span>
                <span v-show="showCol === 'txNum'" class="__center-tb-item">
                    {{ txPair.amount24h ? formatNum(txPair.amount24h, 1) : '--' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import BigNumber from 'utils/bigNumber';

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
            pairCode: null,
            realPrice: '',
            top: 0
        };
    },
    computed: {
        activePairCode() {
            return this.activeTxPair ? this.activeTxPair.pairCode || null : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        showList() {
            const list = this.orderList(this.list);
            if (!this.activeTxPair && list && list.length) {
                this.setActiveTxPair(list[0]);
            }

            const _l = [];

            list.forEach(_t => {
                const item = {};
                item.pairCode = _t.pairCode;
                item.price = _t.price;
                item.amount24h = _t.amount24h;
                item.showPair = `${ _t.ftokenShow }/${ _t.ttokenShow }`;
                item.price24hChange = _t.price24hChange;
                item.rawData = _t;

                _l.push(item);
            });

            return _l;
        }
    },
    methods: {
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
            const top = elTop - listTop - 10;

            if (top > listTop + height) {
                this.hideRealPrice();
                return;
            }

            this.top = top;
            this.pairCode = txPair.pairCode;
            this.realPrice = this.getRealPrice(txPair);
        },
        hideRealPrice(txPair) {
            if (this.pairCode && txPair.pairCode === this.pairCode) {
                this.pairCode = null;
            }
        },
        getRealPrice(txPair) {
            if (!txPair) {
                return '';
            }

            const rate = this.getRate(txPair.rawData.ttoken);
            if (!rate) {
                return '';
            }

            let pre = '$';
            if (this.$i18n.locale === 'zh') {
                pre = '￥';
            }

            return pre + BigNumber.multi(txPair.price || 0, rate || 0, 2);
        },
        getRate(tokenId) {
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const coin = this.$store.state.exchangeRate.coins[this.$i18n.locale || 'zh'];

            if (!tokenId || !rateList[tokenId]) {
                return null;
            }
            return rateList[tokenId][coin] || null;
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

            return list.sort((a, b) => {
                switch (this.currentRule) {
                case 'priceUp':
                    return a.price - b.price;
                case 'priceDown':
                    return b.price - a.price;
                case 'upDownUp':
                    return (a.price - a.priceBefore24h) - (b.price - b.priceBefore24h);
                case 'upDownDown':
                    return (b.price - b.priceBefore24h) - (a.price - a.priceBefore24h);
                case 'txNumUp':
                    return a.amount24h - b.amount24h;
                case 'txNumDown':
                    return b.amount24h - a.amount24h;
                default:
                    return compareStr(a.ftokenShow, b.ftokenShow);
                }
            });
        },
        setActiveTxPair(txPair) {
            history.replaceState(null, null, `${ location.origin }/trade?${ txPair.pairCode }`);
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
        padding: 10px;
        line-height: 20px;
        right: -10px;
        z-index: 1;
        transform: translateX(100%);
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);
        font-size: 14px;
        color: rgba(36, 39, 43, 1);
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;

        &::after {
            content: ' ';
            border: 5px solid transparent;
            border-right: 5px solid #fff;
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
