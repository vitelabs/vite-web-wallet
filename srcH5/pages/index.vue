<template>
    <div id="vite-wallet-app" class="trade-container">
        <div v-if="!isLoading" class="router-wrapper">
            <router-view></router-view>
        </div>
        <loading v-if="isLoading" loadingType="dot" class="ex-center-loading"></loading>
        <bottom-bar class="bottom-bar"></bottom-bar>
        <order-notice-list class="notice-list"></order-notice-list>
    </div>
</template>

<script>
import { receiveInviteDialog } from 'h5Components/dialog';
import orderNoticeList from 'components/orderNoticeList.vue';
import loading from 'components/loading';
import env from 'h5Utils/envFromURL';
import { setItem } from 'h5Utils/storage';
import { bridge } from 'h5Utils/bridge';
import bottomBar from 'h5Components/bottomBar';

export default {
    components: { orderNoticeList, bottomBar, loading },
    created() {
        bridge['wallet.currentAddress']().then(address => {
        // window.setTimeout(() => {
            this.isLoading = false;
            this.init();
            // this.$store.dispatch('setAddress', 'vite_869a06b8963bd5d88a004723ad5d45f345a71c0884e2c80e88');
            this.$store.dispatch('setAddress', address);
        // }, 5000);
        }).catch(err => {
            console.warn(err);
        });
    },
    mounted() {
        if (!this.isLoading) {
            this.init();
        }

        bridge.subscribe('nav.RRBtnClick', () => {
            receiveInviteDialog();
        });

        if (env.inviteeCode > 0) {
            setItem('inviteeCode', env.inviteeCode);
            receiveInviteDialog();
        }
    },
    data() {
        return { isLoading: !this.$store.state.account.address };
    },
    methods: {
        init() {
            this.$store.dispatch('startLoopExchangeBalance');
            this.$store.dispatch('exFetchLatestOrder');
        }
    }
};
</script>

<style lang="scss" scoped>
.trade-container {
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .router-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 49px;
        overflow: auto;
    }
    .bottom-bar {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 49px;
        box-sizing: border-box;
        background: rgba(255,255,255,1);
        box-shadow: 0px -2px 20px 0px rgba(0,0,0,0.05);
    }
}

.notice-list {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 101;
    box-sizing: border-box;
    width: 100%;
    max-height: 100%;
    overflow: auto;
}
</style>
