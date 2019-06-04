<template>
    <page-layout>
        <div class="wallet-wrapper">
            <quota v-if="active === 'walletQuota' || active === 'wallet'"></quota>
            <router-view></router-view>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';
import quota from './quota/index';

export default {
    components: { quota, pageLayout },
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
    width: 100%;
    height: 100%;
}

.__wrapper {
    padding: 30px;
}
</style>

