<template>
    <div id="vite-wallet-app" class="trade-container">
        <div class="mock-bar top">
            <span @click="back">back</span>
            <span @click="assets">Go Assets</span>
        </div>
        <div class="trade-wrapper">
            <market v-if="!iframeSrc" :goTrade="goTrade"></market>
            <iframe v-if="iframeSrc" :src="iframeSrc" frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
import market from './market/market.vue';

export default {
    components: { market },
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
    },
    data() {
        return { iframeSrc: '' };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        back() {
            this.iframeSrc = '';
        },
        goTrade(txPair) {
            this.iframeSrc = `${ location.origin }/mobiledex?address=${ this.address }&lang=${ this.$i18n.locale }&symbol=${ txPair && txPair.symbol ? txPair.symbol : '' }&currency=${ this.$store.state.env.currency }`;
        },
        assets() {
            this.iframeSrc = `${ location.origin }/mobiledex#/assets?address=${ this.address }&lang=${ this.$i18n.locale }&currency=${ this.$store.state.env.currency }`;
        }
    }
};
</script>

<style lang="scss" scoped>
.trade-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    font-size: 18px;
    .mock-bar {
        width: 100%;
        z-index: 1000;
        background: #fff;
        padding: 4px;
        box-sizing: border-box;
        &.top {
            position: sticky;
            top: 0;
        }
    }
}
.trade-wrapper {
    position: absolute;
    top: 33px;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
