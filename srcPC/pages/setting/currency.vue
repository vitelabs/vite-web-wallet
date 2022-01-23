<template>
    <div class="currency-wrapper">
        <div class="small-title bold">{{ $t('setting.currency') }}</div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !isShow,
                'up': isShow
            }" @click="toggleList">{{ currency }}</span>
            <ul class="list" v-show="isShow">
                <li v-for="(item, index) in list" :key="index" v-show="item !== currency"
                    @click="setVal(item)">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { symbolList } from 'src/utils/currenySymbol';

export default {
    data() {
        return {
            isShow: false,
            list: symbolList
        };
    },
    computed: {
        currency() {
            return this.$store.state.env.currency.toUpperCase() ;
        }
    },
    methods: {
        setVal(currency) {
            this.$store.commit('setCurrency', currency);
            this.toggleList();
        },
        toggleList() {
            this.isShow = !this.isShow;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~pcAssets/scss/list/setting.scss";
@import "./setting.scss";
</style>
