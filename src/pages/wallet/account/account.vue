<template>
    <div class="wallet-account-wrapper __wrapper">
        <div class="account-head-move item">
            <account-head></account-head>
        </div>
        <div class="token-list item">
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

export default {
    components: { accountHead, syncBlock, tokenCard },
    data() {
        return {
            isShowTrans: false,
            activeToken: null
        };
    },
    watch: {
        otherWhithBalance(val) {
            gateStorage.bindTokens(val.map(t => {
                return { tokenId: t.tokenId, gateInfo: {} };
            }));
        }
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

.wallet-account-wrapper.__wrapper {
    padding-top: 0;
}

.account-head-move {
    width: 100%;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
}

.head {
    position: relative;
    text-align: center;
    margin-top: 20px;
    line-height: 40px;
}

.sync-block {
    display: inline-block;
}

.net-btn {
    position: absolute;
    right: 0;
}

.item {
    margin-top: 20px;
}

.token-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    .token-class {
        border-left: 1px solid #007aff;
        padding-left: 9px;
        width: 100%;
        box-sizing: border-box;
        font-family: $font-bold;
        margin: 20px 0 24px;
    }
}
</style>
