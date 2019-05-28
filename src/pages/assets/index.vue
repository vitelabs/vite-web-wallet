<template>
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
                    <div class="col">代币名称</div>
                    <div class="col">钱包余额</div>
                    <div class="col">钱包待接收金额</div>
                    <div class="col">钱包跨链网关</div>
                    <div class="col">交易所总余额度</div>
                    <div class="col">交易所可用余额</div>
                    <div class="col">
                        <AssetSwitch v-model="assetType" class="asset-switch" />
                    </div>
                </div>
                <tokenCard
                    v-for="token in nativeTokenList"
                    :key="token.tokenId"
                    :token="token"
                    :assetType="assetType"
                ></tokenCard>
                <tokenCard
                    v-for="token in crossChainTokenList"
                    :key="`_${token.tokenId}`"
                    :token="token"
                    :assetType="assetType"
                ></tokenCard>
            </div>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';
import syncBlock from 'components/syncBlock';
import tokenCard from './tokenCard';
import accountHead from './head';
import { addTokenDialog } from './dialog';
import { gateStorage } from 'services/gate';
import TokenFilter from './filter';
import { debounce } from 'lodash';
import AssetSwitch from './assetSwitch';

const filterFunc = filterObj => t => {
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
    components: { pageLayout, accountHead, syncBlock, tokenCard, TokenFilter, AssetSwitch },
    data() {
        return {
            isShowTrans: false,
            activeToken: null,
            assetType: 'TOTAL',
            filterObj: null
        };
    },
    watch: {
        otherWhithBalance(val) {
            gateStorage.bindTokens(val.map(t => {
                return { tokenId: t.tokenId, gateInfo: {} };
            }));
        }
    },
    beforeMount() {
        this.updateExBalance();
        this.$store.dispatch('startLoopExchangeRate');
    },
    computed: {
        nativeTokenList() {
            return [
                ...this.defaultTokenList,
                ...this.userStorageTokenList.filter(t => !t.gateInfo.url),
                ...this.otherWhithBalance
            ].filter(filterFunc(this.filterObj));
        },
        crossChainTokenList() {
            return [
                ...this.officalGateTokenList,
                ...this.userStorageTokenList.filter(t => t.gateInfo.url)
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

.account_head {
    position: relative;
    text-align: center;
    margin: 10px;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.32);
    border-radius: 2px;
}

.token-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.32);
    border-radius: 2px;

    .token__head {
        display: flex;
        width: 100%;
        justify-content: flex-start;
        color: #5e6875;
        border-bottom: 1px solid #c6cbd4;
        background-color: #fff;
        font-size: 12px;
        .col {
            @include colWidth;
            .asset-switch {
                color: #5e6875;
                font-size: 12px;
                font-family: $font-normal;
                /deep/.list-title {
                    border: none;
                }
            }
        }
    }
}
</style>
