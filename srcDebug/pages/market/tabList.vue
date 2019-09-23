<template>
    <ul class="ex-tab-list">
        <li class="ex-tab __pointer" :class="{ 'active': isShowFavorite }" @click="showFavorite">
            <span class="tab favorite-icon __pointer" :class="{'active': isShowFavorite}"></span>
        </li>
        <li v-for="(c, i) in quoteTokenCategory" :key="i"
            :class="{
                'active': !isShowFavorite && c === curentCategory,
                'active-side': (isShowFavorite && i === 0) || (quoteTokenCategory[i-1] === curentCategory)
            }" class="ex-tab __pointer"
            @click="changeCategory(c)"
        ><span class="tab">{{ c }}</span></li>
    </ul>
</template>

<script>
export default {
    computed: {
        isShowFavorite() {
            return this.$store.state.exchangeMarket.isShowFavorite;
        },
        curentCategory() {
            return this.$store.state.exchangeMarket.curentCategory;
        },
        quoteTokenCategory() {
            return this.$store.state.exchangeMarket.quoteTokenCategory;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        showFavorite() {
            this.$store.commit('setIsShowFavorite', true);
            this.$store.commit('setCurentCategory', null);
        },
        changeCategory(category) {
            this.$store.commit('setIsShowFavorite', false);
            this.$store.commit('setCurentCategory', category);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";
</style>
