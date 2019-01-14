<template>
    <div class="market-wrapper">
        <div class="market-head">
            <span @click="onlyShowFavorite" class="favorite-icon"></span>
            <span v-for="(token, i) in tokenList" :key="i"
                  class="tokenList">{{ token }}</span>
        </div>

        <div class="search">
            <span class="icon"></span>
            <vite-input v-model="searchText" placeholder="xxxxsearchxxxx"></vite-input>
        </div>

        <div class="__center-tb-row">
            <span class="__center-tb-item">
                market<span class="icon"></span>
            </span>
            <span class="__center-tb-item">
                price<span class="icon"></span>
            </span>
            <span class="__center-tb-item">
                upDown<span class="icon"></span>
            </span>
            <span class="__center-tb-item">
                num<span class="icon"></span>
            </span>
        </div>

        <div v-for="(transPair, i) in transPairs" :key="i" 
             class="__center-tb-row" @click="setActiveTransPair(transPair)">
            <span class="__center-tb-item">
                <span class="icon" @click="setFavorite(transPair)">s</span>{{ transPair.market }}
            </span>
            <span class="__center-tb-item">{{ transPair.price }}</span>
            <span class="__center-tb-item">{{ transPair.upDown }}</span>
            <span class="__center-tb-item">{{ transPair.num }}</span>
        </div>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';

export default {
    components: {
        viteInput
    },
    data() {
        return {
            tokenList: ['ds', 'sds', 'sdsd'],
            searchText: ''
        };
    },
    computed: {
        transPairs() {
            return this.$store.state.exchangeTransPairs.list;
        },
    },
    methods: {
        onlyShowFavorite() {

        },
        setFavorite(transPair) {
            console.log(transPair);
        },
        setActiveTransPair(transPair) {
            this.$store.commit('exchangeActiveTransPair', transPair);
        }
    }
};
</script>

<style lang="scss" scoped>
@import './center.scss';

</style>
