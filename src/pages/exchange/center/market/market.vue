<template>
    <div class="market-wrapper">
        <tab-list :setToTokenId="setToTokenId"></tab-list>

        <vite-input class="search-input" :valid="fetchSearchList" v-model="searchText" :placeholder="$t('exchange.search')">
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
            <div class="__center-tb-item percent">
                <span class="describe">{{ $t('exchange.upDown') }}</span>
                <order-arrow orderItem="upDown" :setOrderRule="setOrderRule"></order-arrow>
            </div>
            <div class="__center-tb-item">
                <span class="describe">{{ $t('exchange.txNum') }}</span>
                <order-arrow orderItem="txNum" :setOrderRule="setOrderRule"></order-arrow>
            </div>
        </div>

        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <div class="hint" v-show="isShowSearchErr">{{ searchErr }}</div>
        <div class="hint" v-show="!isShowSearchErr && isShowNoData">{{ noData }}</div>
        <tx-pair-list v-show="isShowList" class="tx-list" :list="activeTxPairList"
                      :favoritePairs="favoritePairs" :currentRule="currentOrderRule"
                      :setFavorite="setFavorite"></tx-pair-list>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import loading from 'components/loading';
import localStorage from 'utils/localStorage';
import { timer } from 'utils/asyncFlow';
import { defaultPair, assignPair, pairSearch } from 'services/exchange';

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
        this.stopLoopList();
    },
    data() {
        return {
            isLoading: false,
            currentOrderRule: 'txPair',
            isOnlyFavorite: false,

            favoritePairs: localStorage.getItem(FavoriteKey) || {},

            toTokenId: '',
            txPairList: [],

            isShowSearch: false,
            searchErr: '',
            searchText: '',
            searchList: []
        };
    },
    watch: {
        toTokenId: function() {
            this.init();
        },
        txPairList: function() {
            this.txPairList && this.txPairList.forEach((txPair) => {
                if (!this.activePairCode || txPair.pairCode !== this.activePairCode) {
                    return;
                }
                this.$store.commit('exSetActiveTxPair', txPair);
            });
        }
    },
    computed: {
        isShowSearchErr() {
            return this.searchText && this.isShowSearch && this.searchErr;
        },
        isShowNoData() {
            return !this.activeTxPairList || !this.activeTxPairList.length;
        },
        isShowList() {
            return !this.isShowSearchErr && !this.isShowNoData;
        },
        txPairCodeList() {
            let codeList = [];
            this.txPairList.forEach((txPair) => {
                codeList.push(txPair.pairCode);
            });
            return codeList;
        },
        favoriteCodeList() {
            let codeList = [];
            for (let code in this.favoritePairs) {
                let item = this.favoritePairs[code];
                if (!item || !item.toTokenId || item.toTokenId !== this.toTokenId) {
                    continue;
                }
                codeList.push(code);
            }
            return codeList;
        },
        noData() {
            if (this.searchText && this.isShowSearch) {
                return this.$t('exchange.noData.search');
            }
            if (this.isOnlyFavorite) {
                return this.$t('exchange.noData.favorite');
            }
            return this.$t('hint.noData');
        },
        activeTxPairList() {
            let list = this.searchText && this.isShowSearch ? this.searchList : 
                this.isOnlyFavorite ? this.activeFavoriteList :
                    this.txPairList;

            let i;
            for (i=0; i<list.length; i++) {
                if (list[i].pairCode === this.activePairCode) {
                    break;
                }
            }

            if (i === list.length && this.activeTxPair) {
                list.push(this.activeTxPair);
            }

            return list;
        },
        activeFavoriteList() {
            let list = [];
            this.txPairList.forEach((txPair) => {
                if (this.favoriteCodeList.indexOf(txPair.pairCode) === -1) {
                    return;
                }
                list.push(txPair);
            });
            return list;
        },
        activePairCode() {
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
        setOrderRule(rule) {
            this.currentOrderRule = rule;
        },
        setFavorite(txPair) {
            let pairCode = txPair.pairCode;
            let toTokenId = txPair.ttoken;

            this.favoritePairs = this.favoritePairs || {};
            if (this.favoritePairs[pairCode]) {
                delete this.favoritePairs[pairCode];
            } else {
                this.favoritePairs[pairCode] = { toTokenId };
            }
            this.favoritePairs = Object.assign({}, this.favoritePairs);

            localStorage.setItem(FavoriteKey, this.favoritePairs);
        },

        async init() {
            // First, clear.
            this.searchText = '';
            this.searchList = [];
            this.stopLoopList();

            // Second, wait txPairList.
            this.isLoading = true;
            let toTokenId = this.toTokenId;

            try {
                let _q = [this.fetchDefaultList()];
                this.favoriteCodeList && this.favoriteCodeList.length && _q.push(this.fetchFavoriteList());
                let _r = await Promise.all(_q);

                if (toTokenId !== this.toTokenId) {
                    return;
                }

                // Third, txPairList finish. Get final list.
                this.isLoading = false;
                let defaultList = _r[0] || [];
                let favoriteList = _r.length === 2 ? _r[1] || [] : [];

                let list = [];
                let codeList = [];
                // Add default
                defaultList.forEach((txPair) => {
                    list.push(txPair);
                    codeList.push(txPair.pairCode);
                });
                // Add favorite
                favoriteList.forEach((txPair) => {
                    if (codeList.indexOf(txPair.pairCode) !== -1) {
                        return;
                    }
                    list.push(txPair);
                    codeList.push(txPair.pairCode);
                });

                // Done
                this.txPairList = list;

                // this.startLoopList();
            } catch(err) {
                console.warn(err);
                this.isLoading = false;
            }
        },

        startLoopList() {
            this.stopLoopList();
            pairTimer = new timer(()=>{
                if (!this.txPairCodeList || !this.txPairCodeList.length) {
                    return Promise.resolve();
                }
                return this.fetchTxPairList();
            }, 2000);
            pairTimer.start();
        },
        stopLoopList() {
            pairTimer && pairTimer.stop();
            pairTimer = null;
        },

        fetchSearchList() {
            if (!this.searchText) {
                return;
            }

            this.isLoading = true;
            let _fromTokenShow = this.searchText;
            return pairSearch({
                fromTokenShow: _fromTokenShow
            }).then((data) => {
                if (this.searchText !== _fromTokenShow) {
                    return;
                }
                this.isLoading = false;
                this.isShowSearch = true;
                this.searchList = data;
            }).catch((err) => {
                console.warn(err);
                this.isLoading = false;
                this.isShowSearch = true;
                this.searchErr = this.$t('hint.err');
            });
        },
        fetchDefaultList() {
            return defaultPair({
                toTokenId: this.toTokenId
            });
        },
        fetchFavoriteList() {
            return assignPair({
                pairs: this.favoriteCodeList
            });
        },
        fetchTxPairList() {
            return assignPair({
                pairs: this.txPairCodeList
            }).then((data) => {
                this.txPairList = data;
            });
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
    display: flex;
    flex-direction: column;
    .describe {
        position: relative;
        bottom: 9px;
    }
    .hint {
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(94,104,117,1);
        margin-top: 20px;
    }
    .tx-list {
        flex: 1;
        overflow: auto;
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
            font-size: 12px;
        }
    }
</style>

