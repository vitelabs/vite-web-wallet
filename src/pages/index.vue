<template>
    <div class="app-wrapper">
        <index-layout v-if="layoutType === 'start'">
            <router-view/>
        </index-layout>

        <page-layout :active="active" v-else>
            <router-view/>
        </page-layout>

        <update></update>
        <first-notice v-if="active === 'start'"></first-notice>
    </div>
</template>

<script>
import indexLayout from 'components/indexLayout.vue';
import pageLayout from 'components/pageLayout.vue';
import update from 'components/update.vue';
import firstNotice from 'components/firstNotice.vue';
import { timer } from 'utils/asyncFlow';
import loopTime from 'config/loopTime';
import routeConfig from 'router/routes';

let balanceInfoInst = null;

export default {
    components: {
        indexLayout, pageLayout, update, firstNotice
    },
    mounted() {
        this.changeLayout(this.$route.name);

        this.$router.afterEach((to)=>{
            this.changeLayout(to.name);
            this.active = to.name;
        });

        this.$wallet.onLogin(() => {
            this.login();
        });

        this.$wallet.onLogout(() => {
            this.logout();
        });
    },
    data() {
        return {
            layoutType: 'start',
            active: this.$route.name
        };
    },
    methods: {
        login() {
            this.startLoopBalance();
        },
        logout() {
            this.stopLoopBalance();
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearTransList');
            this.$store.commit('commitClearPledge');
            this.$router.push({
                name: 'exchange'
            });
        },
        changeLayout(to) {
            let toHome = routeConfig.indexLayoutRoutes.indexOf(to) === -1;
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
    min-height: 720px;
}
@media only screen and (max-width: 1000px) {
    .app-wrapper {
        min-height: auto;
    }
}
</style>
