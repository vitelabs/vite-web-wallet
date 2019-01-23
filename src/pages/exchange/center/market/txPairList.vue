<template>
    <div class="tx-pair-wrapper">
        <div v-for="(txPair, i) in showList" :key="i" 
             class="__center-tb-row __pointer" 
             :class="{'active': txPair && txPair.pairCode === activePairCode}"
             @click="setActiveTxPair(txPair.rawData)">
            <span class="__center-tb-item txPair">
                <span class="favorite-icon" :class="{'active': !!favoritePairs[txPair.pairCode]}"
                      @click.stop="setFavorite(txPair.rawData)"></span>
                <span class="describe">{{ txPair.showPair }}</span>
            </span>
            <span class="__center-tb-item">{{ txPair.price }}</span>
            <span class="__center-tb-item percent" :class="{
                'up': +txPair.upDown > 0,
                'down': +txPair.upDown < 0
            }">{{ txPair.upDown + '%' }}</span>
            <span class="__center-tb-item">{{ txPair.quantity24h }}</span>
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
            default: () => {
                return [];
            }
        },
        setFavorite: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        activePairCode() {
            return this.activeTxPair ? this.activeTxPair.pairCode || null : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        showList() {
            let list = this.orderList(this.list);
            if (!this.activeTxPair && list && list.length) {
                this.setActiveTxPair(list[0]);
            }

            let _l = [];

            list.forEach((_t) => {
                let upDown = BigNumber.minus(_t.price, _t.priceBefore24h).toString();

                let item = {};
                item.pairCode = _t.pairCode;
                item.price = _t.price;
                item.quantity24h = _t.quantity24h;
                item.showPair = `${_t.ftokenShow}/${_t.ttokenShow}`;
                item.upDown = BigNumber.dividedToNumber(upDown, _t.priceBefore24h * 100, 2).toString();
                item.rawData = _t;
                
                _l.push(item);
            });

            return _l;
        }
    },
    methods: {
        orderList(list) {
            let compareStr = (aStr, bStr) => {
                for (let i=0; i<aStr.length; i++) {
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
                    return a.quantity24h - b.quantity24h;
                case 'txNumDown': 
                    return b.quantity24h - a.quantity24h;
                default:
                    return compareStr(a.ftokenShow, b.ftokenShow);
                }
            });
        },
        setActiveTxPair(txPair) {
            this.$store.dispatch('exFetchActiveTxPair', txPair);
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.__center-tb-row.active {
    background: rgba(75,116,255,0.10);;
}
.__center-tb-row .describe {
    position: relative;
    bottom: 6px;
}
</style>
