<template>
    <div class="market-wrapper">
        <tab-list></tab-list>

        <div class="search-wrapper">
            <vite-input class="market-search-input" v-model="searchText"
                        :placeholder="$t('trade.search')">
                <span slot="before" class="icon"></span>
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
            <div class="__center-tb-item tx-pair __pointer"
                 @click="setOrderRule('symbol')">
                {{ $t('trade.txPair') }}
            </div>
            <div class="__center-tb-item">
                <span :class="{
                    'describe-r': !isShowFavorite
                }">{{ $t('trade.price') }}</span>
                <order-arrow v-show="!isShowFavorite"
                             orderItem="price"
                             :setOrderRule="setOrderRule"
                ></order-arrow>
            </div>
            <div v-show="showCol === 'updown'" class="__center-tb-item percent">
                <span :class="{
                    'describe-r': !isShowFavorite
                }">{{ $t('trade.upDown') }}</span>
                <order-arrow v-show="!isShowFavorite"
                             orderItem="upDown"
                             :setOrderRule="setOrderRule"
                ></order-arrow>
            </div>
            <div v-show="showCol === 'txNum'" class="__center-tb-item">
                <span  :class="{
                    'describe-r': !isShowFavorite
                }">{{ $t('trade.txNum') }}</span>
                <order-arrow v-show="!isShowFavorite"
                             orderItem="txNum"
                             :setOrderRule="setOrderRule"
                ></order-arrow>
            </div>
        </div>

        <loading loadingType="dot" class="ex-center-loading" v-show="isLoading"></loading>
        <div class="hint" v-show="isShowNoData">{{ noData }}</div>
        <tx-pair-list v-show="!isShowNoData && !isLoading"
                      :list="activeTxPairList" :isLoading="isLoading"
                      :favoritePairs="favoritePairs" :currentRule="currentOrderRule"
                      :setFavorite="setFavorite" :showCol="showCol"></tx-pair-list>
    </div>
</template>

<script>
import viteInput from '@components/viteInput.vue';
import loading from '@components/loading.vue';
import localStorage from '@pc/utils/store';
import { subTask } from '@utils/proto/subTask';
import statistics from '@utils/statistics';
import { assignPair } from '@services/trade';

import orderArrow from './orderArrow.vue';
import tabList from './tabList.vue';
import txPairList from './txPairList.vue';

const FavoriteKey = 'favoriteTickers';
let defaultPairTimer = null;
let assignPairTimerList = [];

export default {
    components: {
        viteInput,
        loading,
        orderArrow,
        tabList,
        txPairList
    },
    beforeMount() {
        this.isLoading = true;
        if (this.isShowFavorite) {
            this.initFavoriteList();
        } else {
            this.init();
        }
    },
    destroyed() {
        this.stopDefaultPair();
        this.stopAssignPair();
    },
    data() {
        return {
            isLoading: false,
            currentOrderRule: 'txNumDown',
            showCol: 'updown',

            txPairList: [],

            favoritePairs: localStorage.getItem(FavoriteKey) || {},
            favoriteList: [],

            searchText: '',
            searchList: []
        };
    },
    computed: {
        isShowFavorite() {
            return this.$store.state.exchangeMarket.isShowFavorite;
        },
        quoteTokenCategory() {
            return this.$store.state.exchangeMarket.curentCategory;
        },
        isShowNoData() {
            return !this.isLoading
                && (
                    !this.activeTxPairList
                    || !this.activeTxPairList.length
                    || (!this.searchList.length && this.searchText)
                );
        },
        noData() {
            if (this.searchText) {
                return this.$t('trade.noData.search');
            }
            if (this.isShowFavorite) {
                return this.$t('trade.noData.favorite');
            }
            return this.$t('hint.noData');
        },
        activeTxPairList() {
            if (this.isLoading) {
                return [];
            }

            const list = this.searchText
                ? this.searchList
                : this.isShowFavorite
                    ? this.favoriteList
                    : this.txPairList;

            return [].concat(list);
        },
        activePairCode() {
            return this.activeTxPair
                ? this.activeTxPair.symbol || null
                : null;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        officalGateTokenList() {
            return this.$store.getters.officalGateTokenList;
        }
    },
    watch: {
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        quoteTokenCategory: function () {
            this.searchText = '';
            this.searchList = [];
            this.stopDefaultPair();

            if (!this.quoteTokenCategory) {
                return;
            }

            this.isLoading = true;
            this.init();
        },
        isShowFavorite: function () {
            if (!this.isShowFavorite) {
                this.stopAssignPair();
                this.favoriteList = [];
                return;
            }

            this.isLoading = true;
            this.initFavoriteList();
        },
        searchText: function () {
            const list = [];
            const searchText = this.$trim(this.searchText).toLowerCase();
            this.txPairList.forEach(tx => {
                let ftokenShow = tx.tradeTokenSymbol;
                const tokenDetail = this.officalGateTokenList.find(item => item.tokenId === tx.tradeToken);
                if (tokenDetail) {
                    ftokenShow = `${ ftokenShow }|${ tokenDetail.tokenName }`;
                }
                ftokenShow = ftokenShow.toLowerCase();
                if (ftokenShow.indexOf(searchText) !== -1) {
                    list.push(tx);
                }
            });
            this.searchList = list;
        }
    },
    methods: {
        init() {
            defaultPairTimer = defaultPairTimer || new subTask('defaultPair', ({ args, data }) => {
                if (args.quoteTokenCategory !== this.quoteTokenCategory) {
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

                if (this.activeTxPair && data.symbol === this.activeTxPair.symbol) {
                    this.$store.commit('exSetActiveTxPair', data);
                }

                let i;
                for (i = 0; i < this.txPairList.length; i++) {
                    if (this.txPairList[i].symbol === data.symbol) {
                        this.txPairList[i] = data;
                        break;
                    }
                }

                this.txPairList = [].concat(this.txPairList);
            }, 2000);

            defaultPairTimer.start(() => {
                return { quoteTokenCategory: this.quoteTokenCategory };
            });
        },
        initFavoriteList() {
            const symbols = [];
            for (const symbol in this.favoritePairs) {
                symbols.push(symbol);
            }

            if (!symbols.length) {
                this.isLoading = false;
                return;
            }

            assignPair({ symbols }).then(data => {
                this.isLoading = false;
                this.favoriteList = data;

                this.stopAssignPair();
                this.favoriteList && this.favoriteList.forEach(txPair => {
                    const _t = new subTask('assignPair', ({ data }) => {
                        if (!this.isShowFavorite) {
                            this.stopAssignPair();
                            return;
                        }

                        if (!data) {
                            return;
                        }

                        if (this.activeTxPair && data.symbol === this.activeTxPair.symbol) {
                            this.$store.commit('exSetActiveTxPair', data);
                        }

                        let i;
                        for (i = 0; i < this.favoriteList.length; i++) {
                            if (this.favoriteList[i].symbol === data.symbol) {
                                this.favoriteList[i] = data;
                                break;
                            }
                        }

                        if (i === this.favoriteList.length) {
                            return;
                        }

                        this.favoriteList = [].concat(this.favoriteList);
                    });
                    _t.start(() => {
                        return { symbol: txPair.symbol };
                    }, false);
                    assignPairTimerList.push(_t);
                });
            }).catch(err => {
                this.isLoading = false;
                this.favoriteList = [];
                console.warn(err);
            });
        },
        stopDefaultPair() {
            defaultPairTimer && defaultPairTimer.stop();
            defaultPairTimer = null;
        },
        stopAssignPair() {
            assignPairTimerList.forEach(assignTimer => {
                assignTimer && assignTimer.stop();
                assignTimer = null;
            });
            assignPairTimerList = [];
        },
        toogleShowCol(showCol) {
            this.showCol = showCol;
        },
        setOrderRule(rule) {
            this.currentOrderRule = rule;
        },
        setFavorite(txPair) {
            const symbol = txPair.symbol;
            const toTokenId = txPair.quoteToken;

            this.favoritePairs = this.favoritePairs || {};
            if (this.favoritePairs[symbol]) {
                statistics.event(`${ this.$route.name }_delete_trade_sign`, symbol, this.address || '');
                delete this.favoritePairs[symbol];
            } else {
                statistics.event(`${ this.$route.name }_trade_sign`, symbol, this.address || '');
                this.favoritePairs[symbol] = { toTokenId };
            }
            this.favoritePairs = Object.assign({}, this.favoritePairs);

            localStorage.setItem(FavoriteKey, this.favoritePairs);
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use "../center.scss" as *;

.__center-tb-item.percent {
    overflow: visible;
}

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
        @include font_color_2();
        margin-top: 20px;
    }

    .search-wrapper {
        display: flex;
        padding: 4px 6px;
        box-sizing: border-box;
        @include common_border_one(bottom);

        .market-search-input {
            flex: 1;
            border-radius: 2px;
            [data-theme="0"] & {
                background: rgba(245, 250, 255, 1);
            }
        }

        .select-icon-wrapper {
            font-size: 11px;
            @include font-family-normal();
            @include gray_font_color_1();
            margin-left: 10px;
            line-height: 20px;

            .select-icon {
                position: relative;
                display: inline-block;
                box-sizing: border-box;
                width: 12px;
                height: 12px;
                border-radius: 10px;
                @include common_border();
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
                        // background: $blue-color-1;
                        @include primary_bg_color();
                        border-radius: 5px;
                    }
                }
            }
        }
    }
}
</style>

<style lang="scss">
@use "@assets/scss/theme.scss" as t;
.market-search-input.input-wrapper {
    box-sizing: border-box;
    height: 20px;
    line-height: 20px;
    [data-theme="0"] & {
        border: none;
    }
    .icon {
        width: 12px;
        height: 12px;
        margin: 4px 6px 4px 6px;
        @include t.background_common_img_suffix('search', 'svg', 'png');
    }
    input {
        text-indent: 0;
        font-weight: 400;
        font-size: 11px;
        [data-theme="0"] & {
            background: rgba(245, 250, 255, 1);
        }
    }
}
</style>
