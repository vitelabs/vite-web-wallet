/**  vite-wallet name-exchange-index */

<template>
    <div class="exchange-center-wrapper">
        <center v-if="active === 'exchange'"></center>
        <router-view></router-view>
    </div>
</template>

<script>
import center from './center/center.vue';

export default {
    components: {
        center
    },
    mounted() {
        this.$store.dispatch('startLoopExchangeRate');
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    destroyed() {
        this.$store.dispatch('stopLoopExchangeRate');
    },
    data() {
        return {
            active: this.$route.name,
            tabList: ['exchange', 'exchangeAssets', 'exchangeOpenOrders', 'exchangeOrderHistory']
        };
    }
};
</script>

<style lang="scss" scoped>
.exchange-center-wrapper {
    min-width: 1300px;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .router-wrapper {
        flex: 1;
        overflow: auto;
    }
}
</style>
