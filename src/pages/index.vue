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
import {timer} from 'utils/asyncFlow';
import loopTime from 'config/loopTime';

const homeLayouts = ['account', 'transList', 'setting', 'quota', 'SBP', 'vote'];
let balanceInfoInst = null;

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
                this.startLoopBalance();
                return;
            }
        
            this.stopLoopBalance();
            this.layoutType = 'index';
            if (!fromHome) {
                return;
            }

            // clear all
            let activeAccount = this.$wallet.getActiveAccount();
            activeAccount && activeAccount.lock();
            activeAccount && activeAccount.releasePWD();
            this.$wallet.clearActiveAccount();
                        
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearTransList');
            this.$store.commit('commitClearPledge');
        },

        startLoopBalance() {
            this.stopLoopBalance();
            let activeAccount = this.$wallet.getActiveAccount();
            balanceInfoInst = new timer(()=>{
                return this.$store.dispatch('getBalanceInfo', activeAccount);
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
}
</style>
