<template>
    <div id="vite-wallet-app" class="app-wrapper" :class="{
        'dex': $route.name.indexOf('trade') !== -1,
        'wallet': $route.name.indexOf('trade') === -1
    }">
        <router-view/>
        <notice-list></notice-list>
    </div>
</template>

<script>
import noticeList from 'components/noticeList.vue';
import { emptySpace } from 'utils/storageSpace';
import { receiveInviteDialog } from 'components/dialog';
const inviteCodeKey = 'INVITE_CODE';

export default {
    components: { noticeList },
    mounted() {
        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
        this.$store.dispatch('startLoopExchangeBalance');
        this.$store.dispatch('exFetchLatestOrder');
        this.$store.dispatch('getInvitedCode').catch(() => {
            if (Number(this.$route.query['ldfjacia']) > 0) {// random for avoid bloked
                emptySpace.setItem(inviteCodeKey, this.$route.query['ldfjacia']);
                if (this.$route.name === 'tradeCenter') {
                    receiveInviteDialog();
                }
            }
        });
    },
    computed: {
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        currHDAcc: function () {
            this.$store.dispatch('startLoopBalance');
            this.$store.dispatch('startLoopExchangeBalance');
            this.$store.dispatch('getInvitedCode');
        },
        address: function () {
            this.$store.commit('clearDexBalance');
            this.$store.commit('commitClearBalance');
            this.$store.commit('commitClearPledge');
            this.$store.commit('commitClearTransList');
            this.address && this.$store.dispatch('exFetchLatestOrder');
            this.$store.dispatch('getInvitedCode').catch(console.log);
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
