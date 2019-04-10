<template>
    <div class="market-wrapper">
        <tab-list></tab-list>

        <div class="search-wrapper">
            <vite-input class="search-input" v-model="searchText"
                        :placeholder="$t('trade.search')">
                <img slot="before" class="icon" src="~assets/imgs/search.svg"/>
            </vite-input>

            <div class="select-icon-wrapper __pointer" @click="toogleShowCol('updown')">
                <span class="select-icon" :class="{
                    active: showCol === 'updown'
                }"></span>{{ $t('trade.upDown') }}
            </div>
            <div class="select-icon-wrapper __pointer" @click="toogleShowCol('txNum')">
                <span class="select-icon" :class="{
                    active: showCol === 'txNum'
                }"></span>{{ $t('trade.txNum') }}
            </div>
        </div>

        <div class="__center-tb-title">
            <div class="__center-tb-item tx-pair">
                <span
                    @click="toggleShowFavorite"
                    class="favorite-icon __pointer"
                    :class="{'active': isOnlyFavorite}"
                ></span>
                <span
                    @click="setOrderRule('transPairs')"
                    class="describe __pointer"
                >{{ $t('trade.txPair') }}</span>
            </div>
            <div class="__center-tb-item">
                <span class="describe-r">{{ $t('trade.price') }}</span>
                <order-arrow
                    orderItem="price"
                    :setOrderRule="setOrderRule"
                ></order-arrow>
            </div>
            <div v-show="showCol === 'updown'" class="__center-tb-item percent">
                <span class="describe-r">{{ $t('trade.upDown') }}</span>
                <order-arrow
                    orderItem="upDown"
                    :setOrderRule="setOrderRule"
                ></order-arrow>
            </div>
            <div v-show="showCol === 'txNum'" class="__center-tb-item">
                <span class="describe-r">{{ $t('trade.txNum') }}</span>
                <order-arrow
                    orderItem="txNum"
                    :setOrderRule="setOrderRule"
                ></order-arrow>
            </div>
        </div>

        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <div class="hint" v-show="isShowNoData">{{ noData }}</div>
        <tx-pair-list v-show="!isShowNoData && !isLoading" :list="activeTxPairList"
                      :favoritePairs="favoritePairs" :currentRule="currentOrderRule"
                      :setFavorite="setFavorite" :showCol="showCol"></tx-pair-list>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import loading from 'components/loading';
import localStorage from 'utils/localStorage';
import { subTask } from 'utils/proto/subTask';

import orderArrow from './orderArrow';
import tabList from './tabList';
import txPairList from './txPairList';

const FavoriteKey = 'favoriteTxPairs';
let defaultPairTimer = null;

export default {
    components: {
        viteInput,
        loading,
        orderArrow,
        tabList,
        txPairList
    },
    beforeMount() {
        this.init();
    },
    destroyed() {
        this.stopLoop();
    },
    data() {
        return {
            isLoading: false,
            currentOrderRule: 'txNumDown',
            isOnlyFavorite: false,
            showCol: 'updown',

            favoritePairs: localStorage.getItem(FavoriteKey) || {},
            txPairList: [],

            searchText: '',
            searchList: []
        };
    },
    watch: {
        toTokenId: function () {
            this.searchText = '';
            this.searchList = [];
            this.isLoading = true;
            this.stopLoop();
            this.init();
        },
        txPairList: function () {
            this.txPairList && this.txPairList.forEach(txPair => {
                if (!this.activePairCode || txPair.pairCode !== this.activePairCode) {
                    return;
                }
                this.$store.commit('exSetActiveTxPair', txPair);
            });
        },
        searchText: function () {
            const list = [];
            const searchText = this.$trim(this.searchText).toLowerCase();
            this.txPairList.forEach(tx => {
                const ftokenShow = tx.ftokenShow.toLowerCase();
                if (ftokenShow.indexOf(searchText) !== -1) {
                    list.push(tx);
                }
            });
            this.searchList = list;
        }
    },
    computed: {
        toTokenId() {
            return this.$store.state.exchangeMarket.currentMarket;
        },
        isShowNoData() {
            return !this.isLoading && (
                !this.activeTxPairList
                || !this.activeTxPairList.length
                || (!this.searchList.length
                    && this.searchText)
            );
        },

        favoriteCodeList() {
            const codeList = [];
            for (const code in this.favoritePairs) {
                const item = this.favoritePairs[code];
                if (
                    !item
                    || !item.toTokenId
                    || item.toTokenId !== this.toTokenId
                ) {
                    continue;
                }
                codeList.push(code);
            }

            return codeList;
        },
        noData() {
            if (this.searchText) {
                return this.$t('trade.noData.search');
            }
            if (this.isOnlyFavorite) {
                return this.$t('trade.noData.favorite');
            }

            return this.$t('hint.noData');
        },
        activeTxPairList() {
            if (this.isLoading) {
                return [];
            }
            let list
                = this.searchText
                    ? this.searchList
                    : this.isOnlyFavorite
                        ? this.activeFavoriteList
                        : this.txPairList;
            list = [].concat(list);

            return list;
        },
        activeFavoriteList() {
            const list = [];
            this.txPairList.forEach(txPair => {
                if (this.favoriteCodeList.indexOf(txPair.pairCode) === -1) {
                    return;
                }
                list.push(txPair);
            });

            return list;
        },
        activePairCode() {
            return this.activeTxPair
                ? this.activeTxPair.pairCode || null
                : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    methods: {
        init() {
            defaultPairTimer = defaultPairTimer || new subTask('defaultPair', ({ args, data }) => {
                if (args.ttoken !== this.toTokenId) {
                    return;
                }

                this.isLoading = false;

                if (data instanceof Array) {
                    this.txPairList = data || [];
                    return;
                }

                if (!data) {
                    return;
                }

                let i;
                for (i = 0; i < this.txPairList.length; i++) {
                    if (this.txPairList[i].pairCode === data.pairCode) {
                        this.txPairList[i] = data;
                        break;
                    }
                }

                if (i === this.txPairList.length) {
                    this.txPairList.push(data);
                    return;
                }

                this.txPairList = [].concat(this.txPairList);
            }, 2000);

            defaultPairTimer.start(() => {
                return { ttoken: this.toTokenId };
            });
        },
        stopLoop() {
            defaultPairTimer && defaultPairTimer.stop();
            defaultPairTimer = null;
        },
        toggleShowFavorite() {
            this.isOnlyFavorite = !this.isOnlyFavorite;
        },
        toogleShowCol(showCol) {
            this.showCol = showCol;
        },
        setOrderRule(rule) {
            this.currentOrderRule = rule;
        },
        setFavorite(txPair) {
            const pairCode = txPair.pairCode;
            const toTokenId = txPair.ttoken;

            this.favoritePairs = this.favoritePairs || {};
            if (this.favoritePairs[pairCode]) {
                delete this.favoritePairs[pairCode];
            } else {
                this.favoritePairs[pairCode] = { toTokenId };
            }
            this.favoritePairs = Object.assign({}, this.favoritePairs);

            localStorage.setItem(FavoriteKey, this.favoritePairs);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";

.market-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .describe-r {
        position: relative;
        bottom: 9px;
    }

    .hint {
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(94, 104, 117, 1);
        margin-top: 20px;
    }

    .search-wrapper {
        display: flex;
        border-bottom: 1px solid rgba(212, 222, 231, 1);
        padding: 4px 6px;
        box-sizing: border-box;

        .search-input {
            flex: 1;
            background: rgba(245, 250, 255, 1);
            border-radius: 2px;
        }

        .select-icon-wrapper {
            font-size: 11px;
            font-family: $font-normal, arial, sans-serif;
            font-weight: 400;
            color: rgba(94, 104, 117, 1);
            margin-left: 10px;

            .select-icon {
                position: relative;
                display: inline-block;
                box-sizing: border-box;
                width: 12px;
                height: 12px;
                border-radius: 10px;
                border: 1px solid rgba(188, 196, 201, 1);
                margin-right: 4px;
                margin-bottom: -2px;

                &.active {
                    &::after {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        margin-top: -2px;
                        margin-left: -2px;
                        content: ' ';
                        display: inline-block;
                        width: 4px;
                        height: 4px;
                        background: #007aff;
                        border-radius: 5px;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
.search-input.input-wrapper {
    box-sizing: border-box;
    height: 20px;
    line-height: 20px;
    border: none;

    .icon {
        width: 12px;
        height: 12px;
        margin: 4px 6px 4px 6px;
    }

    input {
        text-indent: 0;
        font-weight: 400;
        font-size: 11px;
        background: rgba(245, 250, 255, 1);
    }
}
</style>
