<template>
    <div id="vite-wallet-app" class="trade-container">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
    }
};
</script>

<style lang="scss" scoped>
.trade-container {
    height: 100%;
    width: 100%;
    overflow: auto;
}
</style>
