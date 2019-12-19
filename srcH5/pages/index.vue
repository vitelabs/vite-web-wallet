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
import confirm from 'h5Components/confirm/confirm.vue';

export default {
    components: { orderNoticeList, bottomBar, loading, confirm },
    created() {
        bridge['wallet.currentAddress']().then(address => {
            console.log('get address', address);

            this.isLoading = false;
            this.init();
            this.$store.dispatch('setAddress', address);
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
@import "~assets/scss/vars.scss";

.trade-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
    .router-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 50px;
        overflow: hidden;
    }
    .bottom-bar {
        position: absolute;
        z-index: -1;
        bottom: 0;
        width: 100%;
        height: 50px;
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

.bnb-conf {
    z-index: 1000;
    text-align: center;
    .bnb-img {
        width: 100px;
        height: 100px;
        margin: 30px 0;
    }
    .help-t {
        @include font-family-bold();
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 12px;
        word-break: break-all;
        text-align: left;
        .link {
            color: #118bff;
        }
    }

    .help-txt {
        text-align: left;
        opacity: 0.66;
        font-size: 12px;
        color: #333;
        line-height: 22px;
        margin-bottom: 10px;
        word-break: break-all;
        @include font-family-bold();
    }
    .__notice {
        text-align: left;
    }
}
</style>
