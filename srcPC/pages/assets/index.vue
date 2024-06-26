<template>
    <div class="assets-container">
        <page-layout>
            <div class="wallet-account-wrapper">
                <account-head class="account_head"></account-head>
                <TokenFilter @newFilter="val => { filterObj = val; }"></TokenFilter>
                <token-list-view :tokenList="tokenList"></token-list-view>
            </div>
        </page-layout>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import openUrl from '@utils/openUrl';
import { getAccountLink } from '@utils/getLink';
import { gateStorage } from '@pc/services/gate';
import pageLayout from '@pc/components/pageLayout/index.vue';
import accountHead from './head.vue';
import TokenFilter from './filter.vue';
import tokenListView from './tokenList/list.vue';

const filterFunc = (filterObj, currency) => {
    const ob = {};
    return t => {
        if (!t.tokenName) {
            return false;
        }
        if (!filterObj) {
            return true;
        }
        // filter duplicaty token.
        if (ob[t.tokenId]) return false;
        ob[t.tokenId] = 1;

        // Hiding asset if it's value <= $2
        let hideLimit = 2;
        if (currency === 'cny') {
            hideLimit = hideLimit * 7;
        }
        const tokenName = `${ t.tokenSymbol }|${ t.tokenName }`;

        const NOTMatchNoZero
        = filterObj.hideZero && +t.totalAsset <= hideLimit;
        const NOTMatchFilterKey
        = filterObj.filterKey
        && !tokenName.match(new RegExp(filterObj.filterKey, 'i'));

        return !(NOTMatchNoZero || NOTMatchFilterKey);
    };
};
export default {
    components: { pageLayout, accountHead, TokenFilter, tokenListView },
    data() {
        return {
            isShowTrans: false,
            activeToken: null,
            assetType: 'TOTAL',
            filterObj: null
        };
    },
    watch: {
        otherWhithBalance: debounce(function (val) {
            gateStorage.bindTokens(val.map(t => {
                return { tokenId: t.tokenId, gateInfo: {} };
            }));
        }, 2000),
        showTokenIds(val) {
            this.$store.dispatch('addRateTokens', val);
        }
    },
    beforeMount() {
        this.$store.dispatch('startLoopExchangeRate');
    },
    computed: {
        tokenList() {
            return [
                ...this.defaultTokenList,
                ...this.officalGateTokenList,
                ...this.userStorageTokenList,
                ...this.otherWhithBalance
            ].filter(filterFunc(this.filterObj, this.currency));
        },
        defaultTokenList() {
            return this.$store.getters.defaultTokenList;
        },
        officalGateTokenList() {
            return this.$store.getters.officalGateTokenList;
        },
        userStorageTokenList() {
            return this.$store.getters.userStorageTokenList;
        },
        otherWhithBalance() {
            return this.$store.getters.otherWhithBalance;
        },
        showTokenIds() {
            return [
                ...this.defaultTokenList,
                ...this.officalGateTokenList,
                ...this.userStorageTokenList,
                ...this.otherWhithBalance
            ].map(t => t.tokenId);
        },
        currency() {
            return this.$store.state.env.currency;
        }
    },
    methods: {
        goDetail() {
            openUrl(`${ getAccountLink(this.$i18n.locale, this.account.addr) }`);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@use "@assets/scss/theme.scss" as *;

.assets-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.wallet-account-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .account_head {
        position: relative;
        text-align: center;
        border-radius: 2px;
        @include box_shadow();
    }
}
</style>
