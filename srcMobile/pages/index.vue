<template>
    <div class="trade-container">
        <div class="trade-wrapper">
            <router-view></router-view>
        </div>
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
    width: 100%;
    height: 100%;
}
.trade-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
