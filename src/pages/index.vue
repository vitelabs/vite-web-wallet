<template>
    <div id="vite-wallet-app" class="app-wrapper" :class="{
        'dex': active.indexOf('trade') !== -1,
        'wallet': active.indexOf('trade') === -1
    }">
        <router-view/>
        <notice-list></notice-list>
    </div>
</template>

<script>
import noticeList from 'components/noticeList.vue';

export default {
    components: { noticeList },
    mounted() {
        this.$router.afterEach(to => {
            this.active = to.name;
        });

        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
    },
    data() {
        return { active: this.$route.name };
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        }
    },
    watch: {
        currHDAcc: function () {
            this.$store.dispatch('startLoopBalance');
        }
    }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
}
</style>
