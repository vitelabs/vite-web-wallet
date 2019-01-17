<template>
    <div class="market-wrapper">
        <tab-list :setToTokenId="setToTokenId"></tab-list>

        <vite-input class="search-input" v-model="searchText" :placeholder="$t('exchange.search')">
            <img slot="before" class="icon" src="~assets/imgs/search.svg"/>
        </vite-input>

        <div class="__center-tb-title">
            <div class="__center-tb-item txPair">
                <span @click="toggleShowFavorite" class="favorite-icon __pointer"
                      :class="{'active': isOnlyFavorite}"></span>
                <span @click="setOrderRule('transPairs')" 
                      class="describe __pointer">{{ $t('exchange.txPair') }}</span>
            </div>
            <div class="__center-tb-item">
                <span class="describe">{{ $t('exchange.price') }}</span>
                <order-arrow orderItem="price" :setOrderRule="setOrderRule"></order-arrow>
            </div>
            <div class="__center-tb-item">
                <span class="describe">{{ $t('exchange.upDown') }}</span>
                <order-arrow orderItem="upDown" :setOrderRule="setOrderRule"></order-arrow>
            </div>
            <div class="__center-tb-item">
                <span class="describe">{{ $t('exchange.txNum') }}</span>
                <order-arrow orderItem="txNum" :setOrderRule="setOrderRule"></order-arrow>
            </div>
        </div>

        <tx-pair-list :list="txPairs" :activeCode="activeCode" :currentRule="currentOrderRule"
                      :setActiveTransPair="setActiveTransPair" :setFavorite="setFavorite"></tx-pair-list>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import loading from 'components/loading';

// import { defaultPair, assignPair } from 'services/exchange';

import localStorage from 'utils/localStorage';
import { timer } from 'utils/asyncFlow';

import orderArrow from './orderArrow';
import tabList from './tabList';
import txPairList from './txPairList';

const FavoriteKey = 'favoriteTxPairs';
let pairTimer = null;

export default {
    components: {
        viteInput, loading, orderArrow, tabList, txPairList
    },
    destroyed() {
        this.stopLoopTxPair();
    },
    data() {
        let favoritePairsCode = localStorage.getItem(FavoriteKey) || [];

        return {
            toTokenId: '',
            defaultList: [],

            favoritePairsCode,
            favoriteList: [],

            currentOrderRule: 'txPair',
            isOnlyFavorite: false,

            // sdsdsdsd
            searchText: '',
            searchList: []
        };
    },
    watch: {
        toTokenId: function() {
            this.fetchDefaultPair();
        },
        favoritePairsCode: function() {
            let codeList = [];
            this.favoritePairsCode.forEach((code) => {
                for(let i = 0; i<this.defaultList.length; i++) {
                    let txPair = this.defaultList[i];
                    if (txPair.pairCode === code) {
                        return;
                    }
                }
                codeList.push(code);
            });
            this.fetchAssignPairs(codeList);
        }
    },
    computed: {
        pairCodeList() {
            let codeList= [];
            this.txPairs.forEach((_t) => {
                codeList.push(_t.pairCode);
            });
            return codeList;
        },
        txPairs() {
            if (this.searchText) {
                return this.searchList;
            }

            // isOnlyFavorite
            // favoriteList, defaultList, currentOrderRule, activeTxPair

            let txPairs = this.defaultList || [];
            txPairs.concat(this.favoriteList || []);

            let i;
            for (i=0; i<txPairs.length; i++) {
                if (txPairs[i].pairCode === this.activeCode) {
                    break;
                }   
            }
            if (i === txPairs.length && this.activeTxPair) {
                txPairs.push(this.activeTxPair);
            }

            return txPairs;
        },
        activeCode() {
            return this.activeTxPair ? this.activeTxPair.pairCode || null : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    methods: {
        setToTokenId(toTokenId) {
            this.toTokenId = toTokenId;
        },
        toggleShowFavorite() {
            this.isOnlyFavorite = !this.isOnlyFavorite;
        },
        setFavorite(transPair) {
            let pairCode = transPair.pairCode;
            let i = this.favoritePairsCode.indexOf(pairCode);
            if (i < 0) {
                this.favoritePairsCode.push(pairCode);
            } else {
                this.favoritePairsCode.splice(i, 1);
            }
            localStorage.setItem(FavoriteKey, this.favoritePairsCode);
        },
        setOrderRule(rule) {
            console.log(rule);
            this.currentOrderRule = rule;
        },
        setActiveTransPair(transPair) {
            this.$store.dispatch('exFetchActiveTxPair', transPair);
        },

        startLoopTxPair() {
            pairTimer = new timer(()=>{
                if (!this.pairCodeList || !this.pairCodeList.length) {
                    return Promise.resolve();
                }
                return this.fetchAssignPairs(this.pairCodeList);
            }, 2000);
            pairTimer.start();
        },
        stopLoopTxPair() {
            pairTimer && pairTimer.stop();
            pairTimer = null;
        },

        fetchDefaultPair() {
            this.defaultList = [{
                'pairCode': '4232', //交易对Id
                'fToken': '23232', //fromTokenId
                'fTokenShow': 'TBIJN', //fromToken简称 
                'tToken': '232323', //toTokenId
                'tTokenShow': 'TBIJN', //toToken简称 
                'priceBefore24h': '232323', 
                'pricePrev': '2323232', 
                'price': '23.23232323', 
                'price24hChange': '232323', 
                'price24hHigh': '232323', 
                'price24hLow': '232323', 
                'quantity24h': '232233323', 
                'amount24h': '232323' 
            }, {
                'pairCode': '4232', //交易对Id
                'fToken': '23232', //fromTokenId
                'fTokenShow': 'ABIJN', //fromToken简称 
                'tToken': '232323', //toTokenId
                'tTokenShow': 'TBIJN', //toToken简称 
                'priceBefore24h': '232323', 
                'pricePrev': '2323232', 
                'price': '23.23232323', 
                'price24hChange': '232323', 
                'price24hHigh': '232323', 
                'price24hLow': '232323', 
                'quantity24h': '232233323', 
                'amount24h': '232323' 
            }, {
                'pairCode': 'dfad', //交易对Id
                'fToken': 'WOEPJ', //fromTokenId
                'fTokenShow': 'WOEPJ', //fromToken简称 
                'tToken': '41wfss', //toTokenId
                'tTokenShow': 'WOEPJ', //toToken简称 
                'priceBefore24h': '23483', 
                'pricePrev': '23483', 
                'price': '23', 
                'price24hChange': '2324', 
                'price24hHigh': '3183041', 
                'price24hLow': '41341341', 
                'quantity24h': '232341341', 
                'amount24h': '142341' 
            }];

            // defaultPair({
            //     toTokenId: this.toTokenId
            // }).then((data) => {
            //     this.defaultList = data;
            // }).catch((err) => {
            //     console.warn(err);
            // });
        },
        fetchAssignPairs(codes) {
            console.log(codes);
            this.favoriteList = [{
                'parCode': 'dfawed', //交易对Id
                'fToken': 'dfwe2423', //fromTokenId
                'fTokenShow': '231413', //fromToken简称 
                'tToken': '41wfss', //toTokenId
                'tTokenShow': '23483', //toToken简称 
                'priceBefore24h': '23483', 
                'pricePrev': '23483', 
                'price': '23', 
                'price24hChange': '2324', 
                'price24hHigh': '3183041', 
                'price24hLow': '41341341', 
                'quantity24h': '2341341', 
                'amount24h': '142341' 
            }];

            // assignPair({
            //     pairs: codes
            // }).then((data) => {
            //     this.favoriteList = data;
            // }).catch((err) => {
            //     console.warn(err);
            // });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '../center.scss';

.market-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    .describe {
        position: relative;
        bottom: 9px;
    }
}
</style>

<style lang="scss">
    .search-input.input-wrapper {
        box-sizing: border-box;
        height: 28px;
        line-height: 28px;
        border: none;
        border-bottom: 1px solid rgba(212,222,231,1);
        .icon {
            width: 12px;
            height: 12px;
            margin: 8px 6px;
        }
        input {
            text-indent: 0px;
            font-weight: 400;
            color: rgba(206,209,213,1);
            font-size: 12px;
        }
    }
</style>

