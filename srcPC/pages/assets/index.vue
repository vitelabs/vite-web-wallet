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
import openUrl from 'utils/openUrl';
import { getExplorerLink } from 'utils/getLink';
import { gateStorage } from 'pcServices/gate';
import pageLayout from 'pcComponents/pageLayout/index';
import accountHead from './head';
import { addTokenDialog } from './dialog';
import TokenFilter from './filter';
import tokenListView from './tokenList/list';

const filterFunc = filterObj => t => {
    if (!t.tokenName) {
        return false;
    }
    if (!filterObj) {
        return true;
    }
    const NOTMatchNoZero
        = filterObj.hideZero && +t.totalAmount === 0 && +t.totalExAmount === 0;
    const NOTMatchFilterKey
        = filterObj.filterKey
        && !t.tokenSymbol.match(new RegExp(filterObj.filterKey, 'i'));

    return !(NOTMatchNoZero || NOTMatchFilterKey);
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
            ].filter(filterFunc(this.filterObj));
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
        }
    },
    methods: {
        addToken() {
            addTokenDialog();
        },
        goDetail() {
            openUrl(`${ getExplorerLink(this.$i18n.locale) }account/${ this.account.addr }`);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/scss/vars.scss";

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
