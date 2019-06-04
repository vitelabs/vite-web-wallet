<template>
    <page-layout>
        <div class="trade-wrapper">
            <router-view></router-view>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';

export default {
    components: { pageLayout },
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
        this.$store.dispatch('startLoopExchangeBalance');

        this.$router.afterEach(to => {
            this.active = to.name;
        });
    }
};
</script>

<style lang="scss" scoped>
.trade-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>
