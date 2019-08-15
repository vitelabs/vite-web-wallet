<template>
    <div id="vite-wallet-app" class="trade-container">
        <div v-if="isDev" class="mock-bar top">
            <div @click="back">back</div>
        </div>
        <div class="trade-wrapper" :class="{'mock-bar': isDev}">
            <router-view></router-view>
        </div>
        <div v-if="isDev" class="mock-bar bottom">
            <span>交易</span>
            <span>资产</span>
            <span @click="goMining">挖矿</span>
            <span @click="goOrder">订单</span>
        </div>
    </div>
</template>

<script>
import getQuery from 'utils/query';

export default {
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
    },
    data() {
        const query = getQuery();
        return { isDev: (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test') && query.showMockBar === '1' };
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
    overflow: auto;
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
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    &.mock-bar {
        overflow: auto;
        margin-bottom: 20px;
    }
}
</style>
