<template>
    <ul class="ex-tab-list">
        <li
            v-for="(_t, i) in toTokenList"
            :key="i"
            class="ex-tab __pointer"
            :class="{'active': _t.token === activeTokenId}"
            @click="changeToken(_t)"
        >{{ _t.name }}</li>
    </ul>
</template>

<script>
export default {
    methods: {
        changeToken(_token) {
            this.$store.commit('setCurrentMarket', _token);
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
