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
import noticeList from 'pcComponents/noticeList.vue';
import { emptySpace } from 'pcUtils/storageSpace';
import { receiveInviteDialog } from 'pcComponents/dialog';
const inviteCodeKey = 'INVITE_CODE';

export default {
    components: { noticeList },
    beforeMount() {
        this.$store.commit('setLang', this.$i18n.locale);
        this.$store.dispatch('startLoopBalance');
        this.$store.dispatch('startLoopExchangeBalance');
        this.$store.dispatch('exFetchLatestOrder');
        try {
            if (Number(this.$route.query['ldfjacia']) > 0) {
                emptySpace.setItem(inviteCodeKey, this.$route.query['ldfjacia']);
            }
        } catch (err) {
            console.warn(err);
        }

        this.$store
            .dispatch('getInvitedCode')
            .then(code => Number(code) === 0 && this.checkInvite())
            .catch(() => {
                this.checkInvite();
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
    methods: {
        checkInvite() {
            if (Number(this.$route.query['ldfjacia']) > 0) {
                // random for avoid bloked
                if (this.$route.name === 'tradeCenter') {
                    receiveInviteDialog();
                }
            }
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
