<template>
    <ul class="ex-tab-list">
        <li v-for="(_t, i) in toTokenList" :key="i"
            :class="{
                'active': _t.token === activeTokenId,
                'active-side': toTokenList[i-1] && toTokenList[i-1].token === activeTokenId
            }" class="ex-tab __pointer"
            @click="changeToken(_t)"
        >{{ _t.name }}</li>
    </ul>
</template>

<script>
export default {
    methods: {
        changeToken(_t) {
            this.$store.commit('setCurrentMarket', _t.token);
        }
    },
    computed: {
        activeTokenId() {
            return this.$store.state.exchangeMarket.currentMarket;
        },
        toTokenList() {
            return this.$store.state.exchangeMarket.marketMap;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";
</style>
