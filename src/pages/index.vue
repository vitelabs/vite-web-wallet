<template>
    <div id="vite-wallet-app" class="app-wrapper" :class="{
        'dex': $route.name.indexOf('trade') !== -1,
        'wallet': $route.name.indexOf('trade') === -1
    }">
        <router-view/>
        <notice-list></notice-list>
    </div>
</template>

<script>
import noticeList from 'components/noticeList.vue';

export default {
    components: { noticeList },
    mounted() {
        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
        this.$store.dispatch('startLoopExchangeBalance');
        this.$store.dispatch('exFetchLatestOrder');
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
            this.$store.dispatch('startLoopExchangeBalance');
        },
        address: function () {
            this.$store.commit('clearDexBalance');
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearPledge');
            this.$store.commit('commitClearTransList');
            this.address && this.$store.dispatch('exFetchLatestOrder');
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
