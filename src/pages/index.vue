<template>
    <div class="app-wrapper">
        <page-layout v-if="active.indexOf('start') !== 0" :active="active">
            <router-view/>
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
import { timer } from 'utils/asyncFlow';
import loopTime from 'config/loopTime';
import routeConfig from 'router/routes';

let balanceInfoInst = null;

export default {
    components: {
        update, firstNotice, pageLayout
    },
    mounted() {
        this.changeLayout(this.$route.name);
        this.$router.afterEach((to)=>{
            this.active = to.name;
        });

        // Listen login status to loopBalance
        this.$wallet.onLogin(() => {
            this.startLoopBalance();
        });
        this.$wallet.onLogout(() => {
            this.stopLoopBalance();
        });
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
            let toHome = routeConfig.indexLayoutRoutes.indexOf(this.active) === -1;
            this.layoutType = toHome ? 'home' : 'start';
        },

        startLoopBalance() {
            this.stopLoopBalance();
            let activeAccount = this.$wallet.getActiveAccount();
            balanceInfoInst = new timer(()=>{
                return this.$store.commit('commitBalanceInfo', activeAccount);
            }, loopTime.ledger_getBalance);
            balanceInfoInst.start();
        },
        stopLoopBalance() {
            balanceInfoInst && balanceInfoInst.stop();
            balanceInfoInst = null;
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearTransList');
            this.$store.commit('commitClearPledge');
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
