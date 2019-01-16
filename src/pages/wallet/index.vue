/**  vite-wallet login */

<template>
    <div>
        <account v-if="active === 'wallet'"></account>
        <router-view></router-view>
    </div>
</template>

<script>
import account from './account/account.vue';

export default {
    components: {
        account
    },
    mounted() {
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });
    },
    data() {
        return {
            active: this.$route.name,
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

