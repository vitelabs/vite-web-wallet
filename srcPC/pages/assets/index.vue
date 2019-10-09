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
                        <div class="col" >{{$t('tokenCard.heads.name')}}</div>
                        <div class="col">
                            {{$t('tokenCard.heads.balance')}}
                            <i class="tipsicon">
                                <tooltips class="fee-tips" :content="$t('tokenCard.heads.balanceTips')"></tooltips>
                            </i>
                        </div>
                        <div class="col">
                            {{$t('tokenCard.heads.onroad')}}
                            <i class="tipsicon">
                                <tooltips class="fee-tips" :content="$t('tokenCard.heads.unreceivedTips')"></tooltips>
                            </i>
                        </div>
                        <div class="col">
                            {{$t('tokenCard.heads.gate')}}
                            <i class="tipsicon">
                                <tooltips class="fee-tips" :content="$t('tokenCard.heads.gateTips')"></tooltips>
                            </i>
                        </div>
                        <div class="col">{{$t('tokenCard.heads.totalExAmount')}}</div>
                        <div class="col">
                            {{$t('tokenCard.heads.availableExAmount')}}
                            <i class="tipsicon">
                                <tooltips class="fee-tips" :content="$t('tokenCard.heads.availableExAmountTips')"></tooltips>
                            </i>
                        </div>
                        <div class="col">
                            <AssetSwitch v-model="assetType" class="asset-switch" />
                        </div>
                    </div>
                    <div v-show="!tokenList || !tokenList.length" class="no-data"><div>{{ $t('hint.noData') }}</div></div>
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
import tooltips from 'components/tooltips';
import pageLayout from 'pcComponents/pageLayout/index';
import openUrl from 'utils/openUrl';
import tokenCard from './tokenCard';
import accountHead from './head';
import { addTokenDialog } from './dialog';
import { gateStorage } from 'pcServices/gate';
import TokenFilter from './filter';
import { debounce } from 'lodash';
import AssetSwitch from './assetSwitch';

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
    components: { pageLayout, accountHead, tokenCard, TokenFilter, AssetSwitch, tooltips },
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
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            openUrl(`${ process.env.viteNet }${ locale }account/${ this.account.addr }`);
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

.tipsicon {
    margin-left: 3px;
    position: relative;
    display: inline-block;
    background: url(~assets/imgs/gray_hover_help.svg) center no-repeat;
    background-size: 100% 100%;
    overflow: visible;
    width: 16px;
    height: 16px;
    vertical-align: sub;
    cursor: pointer;
    margin-bottom: -1px;
    .fee-tips{
        z-index: 100;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        color: #5E6875;
        width: 200px;
        box-shadow: 0px 5px 20px 0px rgba(176,192,237,0.4);
        word-break: break-word;
        @include font-family-normal();
        /deep/.trigle {
            border: 7px solid transparent;
            border-bottom: 7px solid #fff;
            top: -14px;
            transform: translateX(-50%);
            left: 50%;
        }
    }
    &:hover .fee-tips {
        display: inline-block;
    }
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
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.32);
        border-radius: 2px;
        flex-grow: 1;
        background-color: #fff;
        .no-data {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateY(-50%) translateX(-50%);
            font-size: 12px;
            @include font-family-normal();
            color: rgba(94,104,117,0.58);
            line-height: 16px;
            text-align: center;
            &:before {
                display: inline-block;
                margin-bottom: 16px;
                content: ' ';
                width: 60px;
                height: 60px;
                background: url('~assets/imgs/dexEmpty.svg') 100% 100%;
            }
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
                overflow: visible;
                .asset-switch {
                    color: rgba(94, 104, 117, 0.58);;
                    font-size: 12px;
                    @include font-family-normal();
                    border: none;
                    margin-left: -10px;
                    /deep/.list-title {
                        padding: 0 10px;
                    }
                    /deep/.list {
                        overflow: visible;
                        border-radius: 2px;
                        margin-top: 8px;
                        @include font-family-normal();
                        color: rgba(94,104,117,0.58);
                        .item:hover {
                            background: rgba(75,116,255,0.1);
                        }
                    }
                }
            }
        }
    }
}

</style>
