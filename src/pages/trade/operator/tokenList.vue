<template>
    <div class="token-list-wrapper">
        <div class="__second-title">{{ $t('tradeOperator.tokenList') }}</div>
        <div class="token-list">
            <token-card v-for="(token, i) in tokenList" :key="i" :token="token"></token-card>
        </div>
    </div>
</template>

<script>
import { operatorTokens } from 'services/trade';
import tokenCard from './tokenCard';

export default {
    components: { tokenCard },
    created() {
        this.fetchOperatorTokens();
    },
    data() {
        return { tokenList: [] };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        fetchOperatorTokens() {
            operatorTokens(this.address).then(data => {
                this.tokenList = data.tokenList || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.__second-title {
    margin: 14px 0 0;
}
.token-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
</style>
