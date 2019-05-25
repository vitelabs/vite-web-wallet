<template>
    <ul class="ex-tab-list">
        <li class="ex-tab __pointer" :class="{ 'active': isShowFavorite }" @click="showFavorite">
            <span class="favorite-icon __pointer" :class="{'active': isShowFavorite}"></span>
        </li>
        <li v-for="(_t, i) in toTokenList" :key="i"
            :class="{
                'active': !isShowFavorite && _t.symbol === currentMarket,
                'active-side': (isShowFavorite && i === 0) || (toTokenList[i-1] && toTokenList[i-1].symbol === currentMarket)
            }" class="ex-tab __pointer"
            @click="changeToken(_t)"
        >{{ _t.symbol }}</li>
    </ul>
</template>

<script>
export default {
    computed: {
        isShowFavorite() {
            return this.$store.state.exchangeMarket.isShowFavorite;
        },
        currentMarket() {
            return this.$store.state.exchangeMarket.currentMarket;
        },
        toTokenList() {
            return this.$store.state.exchangeMarket.marketMap;
        }
    },
    methods: {
        showFavorite() {
            this.$store.commit('setIsShowFavorite', true);
            this.$store.commit('setCurrentMarket', null);
        },
        changeToken(_t) {
            this.$store.commit('setIsShowFavorite', false);
            this.$store.commit('setCurrentMarket', _t.symbol);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";
</style>
