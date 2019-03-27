<template>
    <div class="wallet-wrapper">
        <account v-if="active === 'wallet'"></account>
        <router-view></router-view>
    </div>
</template>

<script>
import account from './account/account.vue';

export default {
    components: { account },
    mounted() {
        this.$router.afterEach(to => {
            this.active = to.name;
        });
    },
    data() {
        return { active: this.$route.name };
    }
};
</script>

<style lang="scss" scoped>
.wallet-wrapper {
    height: 100%;
}

.__wrapper {
    padding: 30px;
}

@media only screen and (max-width: 850px) {
    .__wrapper {
        padding: 15px;
    }
}
</style>

