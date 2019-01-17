<template>
    <div class="tx-pair-wrapper">
        <div v-show="!showList.length">{{ $t('hint.noData') }}</div>

        <div v-for="(txPair, i) in showList" :key="i" 
             class="__center-tb-row __pointer" :class="{'active': txPair && txPair.pairCode === activeCode}"
             @click="setActiveTransPair(txPair)">
            <span class="__center-tb-item txPair">
                <span class="favorite-icon" @click="setFavorite(txPair)"></span>
                <span class="describe">{{ txPair.showPair }}</span>
            </span>
            <span class="__center-tb-item">{{ txPair.price }}</span>
            <span class="__center-tb-item" :class="{
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
        activeCode: {
            type: String,
            default: ''
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
        setActiveTransPair: {
            type: Function,
            default: () => {}
        },
        setFavorite: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        showList() {
            let list = this.orderList(this.list);
            let _l = [];

            list.forEach((_t) => {
                let item = {};
                item.pairCode = _t.pairCode;
                item.showPair = `${_t.fTokenShow}/${_t.tTokenShow}`;
                item.price = _t.price;
                item.upDown = BigNumber.dividedToNumber((_t.price - _t.priceBefore24h), _t.priceBefore24h * 100, 2).toString();
                item.quantity24h = _t.quantity24h;
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
                    return compareStr(a.fTokenShow, b.fTokenShow);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.__center-tb-row .describe {
    position: relative;
    bottom: 6px;
}
</style>
