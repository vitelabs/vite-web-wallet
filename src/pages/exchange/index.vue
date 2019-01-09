/**  vite-wallet name-exchange-index */

<template>
    <div class="__wrapper">
        <sec-title :isShowHelp="false"></sec-title>
        <tab-list></tab-list>
        <center v-if="active === 'exchange'"></center>
        <router-view></router-view>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import tabList from './tabList';
import center from './center';

export default {
    components: {
        secTitle, tabList, center
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

