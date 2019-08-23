<template>
    <div id="vite-wallet-app" class="trade-container">
        <div class="mock-bar top">
            <div @click="back">back</div>
        </div>
        <div class="trade-wrapper">
            <market v-if="!iframeSrc" :goTrade="goTrade"></market>
            <iframe v-if="iframeSrc" :src="iframeSrc" frameborder="0"></iframe>
        </div>
        <div class="mock-bar bottom">
            <span @click="goTrade">交易</span>
            <span @click="goAssets">资产</span>
            <span @click="goMining">挖矿</span>
            <span @click="goOrder">订单</span>
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
            // this.$router.back();
        },
        goAssets() {
            this.iframeSrc = `${ location.origin }/mobiledex#/assets?address=${ this.address }`;
        },
        goTrade(txPair) {
            let iframeSrc = `${ location.origin }/mobiledex?address=${ this.address }`;
            for (const key in txPair) {
                iframeSrc += `&${ key }=${ txPair[key] }`;
            }
            this.iframeSrc = iframeSrc;
        },
        goOrder() {
            this.iframeSrc = `${ location.origin }/mobiledex#/order?address=${ this.address }`;
        },
        goMining() {
            this.iframeSrc = `${ location.origin }/mobiledex#/mining?address=${ this.address }`;
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
        &.bottom {
            position: absolute;
            bottom: 0;
        }
    }
}
.trade-wrapper {
    position: absolute;
    top: 33px;
    bottom: 33px;
    left: 0;
    right: 0;
    overflow: auto;
    iframe {
        width: 100%;
        height: 100%;
    }
}
</style>
