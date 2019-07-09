<template>
    <div class="trade-container">
        <page-layout>
            <div class="trade-wrapper">
                <router-view></router-view>
            </div>
        </page-layout>
    </div>
</template>

<script>
import pageLayout from 'components/pageLayout/index';

export default {
    components: { pageLayout },
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
        this.$store.dispatch('startLoopExchangeBalance');
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
