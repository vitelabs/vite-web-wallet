<template>
    <div class="wallet-account-wrapper __wrapper">
        <div class="account-head-move">
            <account-head class="account_head"></account-head>
        </div>
        <TokenFilter></TokenFilter>
        <div class="token-list">
            <div class="token__head">
                <div class="col">代币名称</div>
                <div class="col">钱包余额</div>
                <div class="col">钱包待接收金额</div>
                <div class="col">钱包跨链网关</div>
                <div class="col">交易所总余额度</div>
                <div class="col">交易所可用余额</div>
                <div class="col">
                    <AssetSwitch
                        v-model="assetType"
                        class="asset-switch"
                    />
                </div>
            </div>
            <tokenCard
                v-for="token in nativeTokenList"
                :key="token.tokenId"
                :token="token"
            ></tokenCard>
            <tokenCard
                v-for="token in crossChainTokenList"
                :key="`_${token.tokenId}`"
                :token="token"
            ></tokenCard>
        </div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import tokenCard from './tokenCard';
import accountHead from './head';
import { addTokenDialog } from './dialog';
import { gateStorage } from 'services/gate';
import TokenFilter from './filter';
import { debounce } from 'lodash';
import AssetSwitch from './assetSwitch';

export default {
    components: { accountHead, syncBlock, tokenCard, TokenFilter, AssetSwitch },
    data() {
        return {
            isShowTrans: false,
            activeToken: null,
            assetType: 'TOTAL'
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
            ];
        },
        crossChainTokenList() {
            return [
                ...this.officalGateTokenList,
                ...this.userStorageTokenList.filter(t => t.gateInfo.url)
            ];
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

.wallet-account-wrapper.__wrapper {
    padding-top: 0;
}

.account-head-move {
    width: 100%;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
}

.account_head {
    position: relative;
    text-align: center;
    margin-top: 20px;
}

.token-list {
    display: flex;
    flex-direction: column;
    align-items: center;
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
                /deep/.list-title{
                    border: none;
                }
            }
        }
    }
}
</style>
