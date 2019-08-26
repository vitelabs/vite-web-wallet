<template>
    <div id="vite-wallet-app" class="trade-container">
        <router-view></router-view>
        <order-notice-list class="notice-list"></order-notice-list>
    </div>
</template>

<script>
import { receiveInviteDialog } from 'h5Components/dialog';
import orderNoticeList from 'components/orderNoticeList.vue';
import env from 'h5Utils/envFromURL';
import { setItem } from 'h5Utils/storage';
import bridge from 'h5Utils/bridge';

export default {
    components: { orderNoticeList },
    mounted() {
        bridge['nav.RRBtnClick'](() => {
            console.log('isDialog??');
            receiveInviteDialog();
        });

        if (env.inviteeCode > 0) {
            setItem('inviteeCode', env.inviteeCode);
            receiveInviteDialog();
        }
    }
};
</script>

<style lang="scss" scoped>
.trade-container {
    height: 100%;
    width: 100%;
    overflow: auto;
}
.notice-list {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 101;
    max-height: 100%;
    overflow: auto;
    transition: all 0.8s ease-in-out;
}
</style>
