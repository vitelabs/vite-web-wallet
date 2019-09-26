<template>
    <div class="assets-container __wrapper">
        <account-head></account-head>
        <token-filter v-model="isHideZero"></token-filter>
        <div class="token-list">
            <div v-show="!filterTokenList || !filterTokenList.length" class="no-data">{{ $t('hint.noData') }}</div>
            <tokenCard v-show="filterTokenList && filterTokenList.length"
                       v-for="token in filterTokenList" :key="token.tokenId"
                       :token="token"></tokenCard>
        </div>
    </div>
</template>

<script>
import tokenCard from './tokenCard.vue';
import accountHead from './head';
import tokenFilter from './filter';

export default {
    components: { accountHead, tokenCard, tokenFilter },
    created() {
        this.$store.dispatch('startLoopBalance');
    },
    data() {
        return { isHideZero: false };
    },
    computed: {
        tokenList() {
            return this.$store.getters.allBalanceInfo;
        },
        showTokenIds() {
            return this.$store.getters.allBalanceInfo.map(t => t.tokenId);
        },
        filterTokenList() {
            if (!this.isHideZero) {
                return this.tokenList;
            }

            const filterList = [];
            this.tokenList.forEach(item => {
                if (!+item.balance && !+item.availableExAmount && !+item.totalExAmount) {
                    return;
                }
                filterList.push(item);
            });
            return filterList;
        }
    },
    watch: {
        showTokenIds(val) {
            this.$store.dispatch('addRateTokens', val);
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
