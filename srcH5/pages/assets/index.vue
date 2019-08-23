<template>
    <div class="assets-container">
        <account-head></account-head>
        <div class="token-list">
            <div class="title">{{ $t('mobileAssets.tokenListTitle') }}</div>
            <div v-show="!tokenList || !tokenList.length" class="no-data">{{ $t('hint.noData') }}</div>
            <tokenCard v-show="tokenList && tokenList.length"
                       v-for="token in tokenList" :key="token.tokenId"
                       :token="token"></tokenCard>
        </div>
    </div>
</template>

<script>
import tokenCard from './tokenCard.vue';
import accountHead from './head';

export default {
    components: { accountHead, tokenCard },
    watch: {
        showTokenIds(val) {
            this.$store.dispatch('addRateTokens', val);
        }
    },
    created() {
        this.$store.dispatch('startLoopBalance');
    },
    beforeMount() {
        this.$store.dispatch('startLoopExchangeRate');
    },
    computed: {
        tokenList() {
            return [
                ...this.defaultTokenList,
                ...this.otherWithBalance
            ];
        },
        defaultTokenList() {
            return this.$store.getters.defaultTokenList;
        },
        otherWithBalance() {
            return this.$store.getters.otherWithBalance;
        },
        showTokenIds() {
            return [
                ...this.defaultTokenList,
                ...this.otherWithBalance
            ].map(t => t.tokenId);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "~h5Assets/scss/vars.scss";

.assets-container {
    padding: 8px 24px;
}

.token-list {
    font-size: 14px;
    .title {
        @include font-bold();
        color: rgba(62,74,89,1);
        line-height: 18px;
    }
    .no-data {
        @include font-normal();
        text-align: center;
    }
}
</style>
