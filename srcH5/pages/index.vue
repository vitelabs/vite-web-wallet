<template>
    <div id="vite-wallet-app" class="trade-container">
        <router-view></router-view>
        <order-notice-list class="notice-list"></order-notice-list>
    </div>
</template>

<script>
import getDialog from 'h5Components/dialog/getDialog.js';
import receiveInvite from 'h5Components/receiveInvite.vue';
import orderNoticeList from 'components/orderNoticeList.vue';

export default {
    components: { orderNoticeList },
    mounted() {
        const receiveInviteDialog = getDialog(receiveInvite);
        receiveInviteDialog();

        this.$store.dispatch('startLoopExchangeRate');
        this.$store.dispatch('exFetchLatestOrder');
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
