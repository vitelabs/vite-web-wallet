<template>
    <div class="assets-container">
        <page-layout>
            <div class="wallet-account-wrapper">
                <account-head class="account_head"></account-head>
                <TokenFilter
                    @newFilter="
                        val => {
                            filterObj = val;
                        }
                    "
                ></TokenFilter>
                <div class="token-list">
                    <div class="token__head">
                        <div class="col">{{$t('tokenCard.heads.name')}}</div>
                        <div class="col">{{$t('tokenCard.heads.balance')}}</div>
                        <div class="col">{{$t('tokenCard.heads.onroad')}}</div>
                        <!-- <div class="col">{{$t('tokenCard.heads.gate')}}</div> -->
                        <!-- <div class="col">{{$t('tokenCard.heads.totalExAmount')}}</div> -->
                        <!-- <div class="col">{{$t('tokenCard.heads.availableExAmount')}}</div> -->
                        <div class="col">
                            <AssetSwitch v-model="assetType" class="asset-switch" />
                        </div>
                    </div>
                    <div v-show="!tokenList || !tokenList.length" class="no-data">{{ $t('hint.noData') }}</div>
                    <tokenCard v-show="tokenList && tokenList.length"
                               v-for="token in tokenList"
                               :key="token.tokenId"
                               :token="token"
                               :assetType="assetType"
                    ></tokenCard>
                </div>
            </div>
        </page-layout>
    </div>
</template>

<script>
import pageLayout from 'components/pageLayout/index';
import tokenCard from './tokenCard';
import accountHead from './head';
import { addTokenDialog } from './dialog';
import { gateStorage } from 'services/gate';
import TokenFilter from './filter';
import { debounce } from 'lodash';
import AssetSwitch from './assetSwitch';
import bignumber from 'utils/bigNumber';

const filterFunc = filterObj => t => {
    if (!t.tokenName) {
        return false;
    }
    if (!filterObj) {
        return true;
    }
    const NOTMatchNoZero
        = filterObj.hideZero && +t.totalAmount === 0 && +t.totalExAmount === 0 && bignumber.isEqual(t.fundFloat || 0, 0);
    const NOTMatchFilterKey
        = filterObj.filterKey
        && !t.tokenSymbol.match(new RegExp(filterObj.filterKey, 'i'));

    return !(NOTMatchNoZero || NOTMatchFilterKey);
};
export default {
    components: { pageLayout, accountHead, tokenCard, TokenFilter, AssetSwitch },
    data() {
        return {
            isShowTrans: false,
            activeToken: null,
            assetType: 'WALLET',
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
        this.updateExBalance();
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
        updateExBalance: debounce(function () {
            this.$store.dispatch('startLoopExchangeBalance');
        }, 0.1),
        addToken() {
            addTokenDialog();
        },
        goDetail() {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }account/${ this.account.addr }`);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/scss/vars.scss";
@import "./tokenCard/colWidth.scss";

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
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.32);
        border-radius: 2px;
    }

    .token-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.32);
        border-radius: 2px;
        flex-grow: 1;
        background-color: #fff;
        .no-data {
            margin-top: 60px;
        }
        .token__head {
            display: flex;
            width: 100%;
            justify-content: flex-start;
            color: #5e6875;
            border-bottom: 1px solid rgba(198,203,212,1);
            background-color: #fff;
            font-size: 12px;
            .col {
                @include colWidth;
                padding: 9px;
                color: rgba(94, 104, 117, 0.58);
                .asset-switch {
                    color: rgba(94, 104, 117, 0.58);;
                    font-size: 12px;
                    @include font-family-normal();
                    /deep/.list-title {
                        border: none;
                    }
                }
            }
        }
    }
}

</style>
