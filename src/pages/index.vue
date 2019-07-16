<template>
    <div id="vite-wallet-app" class="app-wrapper" :class="{
        'dex': $route.name.indexOf('trade') !== -1,
        'wallet': $route.name.indexOf('trade') === -1
    }">
        <router-view/>
        <!-- [TODO] Hide trade -->
        <!-- <notice-list></notice-list> -->
    </div>
</template>

<script>
// [TODO] Hide trade
// import noticeList from 'components/noticeList.vue';

export default {
    // [TODO] Hide trade
    // components: { noticeList },
    mounted() {
        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
        // [TODO] Hide trade
        // this.$store.dispatch('exFetchLatestOrder');
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        currHDAcc: function () {
            this.$store.dispatch('startLoopBalance');
        },
        address: function () {
            // [TODO] Hide trade
            // this.address && this.$store.dispatch('exFetchLatestOrder');
        }
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>
