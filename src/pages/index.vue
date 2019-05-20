<template>
    <div id="vite-wallet-app" class="app-wrapper" :class="{
        'dex': active.indexOf('trade') !== -1,
        'wallet': active.indexOf('trade') === -1
    }">
        <page-layout v-if="active.indexOf('start') !== 0" :active="active">
            <router-view />
        </page-layout>

        <router-view v-else />

        <notice-list></notice-list>
        <first-notice v-if="active === 'start'"></first-notice>
    </div>
</template>

<script>
import pageLayout from 'components/pageLayout';
import firstNotice from 'components/firstNotice.vue';
import noticeList from 'components/noticeList.vue';

export default {
    components: {
        firstNotice,
        pageLayout,
        noticeList
    },
    mounted() {
        this.changeLayout(this.$route.name);
        this.$router.afterEach(to => {
            this.active = to.name;
        });

        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
    },
    data() {
        return {
            layoutType: 'start',
            active: this.$route.name,
            address: ''
        };
    },
    watch: {
        active: function () {
            this.changeLayout();
            this.$offKeyDown();
        }
    },
    methods: {
        changeLayout() {
            const toHome = this.active.indexOf('start') !== -1;
            this.layoutType = toHome ? 'home' : 'start';
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
