<template>
    <div id="vite-wallet-app" class="trade-container">
        <div v-if="isDev" class="mock-mobile-top">
            <div @click="back">back</div>
        </div>
        <div class="trade-wrapper">
            <router-view></router-view>
        </div>
        <div v-if="isDev" class="mock-mobile-bottom">
            <span>交易</span>
            <span>资产</span>
            <span @click="goMining">挖矿</span>
            <span @click="goOrder">订单</span>
        </div>
    </div>
</template>

<script>

export default {
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
    },
    computed: {
        isDev() {
            return process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test';
        }
    },
    methods: {
        back() {
            this.$router.back();
        },
        goOrder() {
            this.$router.push({ name: 'openOrders' });
        },
        goMining() {
            this.$router.push({ name: 'mining' });
        }
    }
};
</script>

<style lang="scss" scoped>
.trade-container {
    width: 100%;
    height: 100%;
    .mock-mobile-top {
        position: sticky;
        top: 0;
        z-index: 1000;
    }
    .mock-mobile-bottom {
        position: absolute;
        bottom: 0;
        z-index: 1000;
    }
}
.trade-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
