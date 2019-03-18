<template>
    <div class="app-wrapper">
        <page-layout v-if="active.indexOf('start') !== 0" :active="active">
            <router-view />
        </page-layout>

        <router-view v-else />

        <update></update>
        <first-notice v-if="active === 'start'"></first-notice>
    </div>
</template>

<script>
import pageLayout from 'components/pageLayout';
import update from 'components/update.vue';
import firstNotice from 'components/firstNotice.vue';

export default {
    components: {
        update,
        firstNotice,
        pageLayout
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
            active: this.$route.name
        };
    },
    watch: {
        active: function() {
            this.changeLayout();
            this.$offKeyDown();
        }
    },
    methods: {
        changeLayout() {
            let toHome = this.active.indexOf('start') !== -1;
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
