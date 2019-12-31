<template>
    <div class="currency-wrapper">
        <div class="small-title bold">
            {{ $t('setting.theme') }}
        </div>

        <div class="setting common-list-wrapper __pointer">
            <span class="list-title" :class="{
                'down': !isShow,
                'up': isShow
            }" @click="toggleList">{{ $t(`setting.themeList.${theme}`) }}</span>
            <ul class="list" v-show="isShow">
                <li v-for="(item, index) in list" :key="index" v-show="item !== theme"
                    @click="setVal(item)">{{ $t(`setting.themeList.${index}`) }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isShow: false,
            list: [ 0, 1 ]
        };
    },
    computed: {
        theme() {
            return +this.$store.state.env.theme;
        }
    },
    methods: {
        setVal(theme) {
            this.$store.commit('setTheme', theme);
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
