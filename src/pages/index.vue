<template>
    <div class="app-wrapper">
        <index-layout v-if="layoutType === 'index'">
            <router-view/>
        </index-layout>

        <page-layout :active="active" v-else>
            <router-view/>
        </page-layout>

        <update></update>
        <first-notice></first-notice>
    </div>
</template>

<script>
import indexLayout from 'components/indexLayout.vue';
import pageLayout from 'components/pageLayout.vue';
import update from 'components/update.vue';
import firstNotice from 'components/firstNotice.vue';

const homeLayouts = ['account', 'transList', 'setting', 'quota'];

export default {
    components: {
        indexLayout, pageLayout, update, firstNotice
    },
    mounted() {
        this.changeLayout(this.$route.name);
        this.$router.afterEach((to, from)=>{
            this.changeLayout(to.name, from.name);
            this.active = to.name;
        });
    },
    data() {
        return {
            layoutType: 'index',
            active: this.$route.name
        };
    },
    methods: {
        changeLayout(to, from) {
            let toHome = homeLayouts.indexOf(to) !== -1;
            let fromHome = homeLayouts.indexOf(from) !== -1;

            if (toHome) {
                this.layoutType = 'home';
                return;
            }

            this.layoutType = 'index';
            if (!fromHome) {
                return;
            }
            viteWallet.Wallet.clearActiveAccount();

            // clearAll
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearTransList');
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
