/**  vite-wallet name-exchange-index */

<template>
    <div class="__wrapper">
        <tab-list></tab-list>
        <center v-if="active === 'exchange'"></center>
        <router-view></router-view>
    </div>
</template>

<script>
import tabList from './tabList';
import center from './center';

export default {
    components: {
        tabList, center
    }, 
    mounted() {
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    data() {
        return {
            active: this.$route.name
        };
    }
};
</script>

<style lang="scss" scoped>

</style>

