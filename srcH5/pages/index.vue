<template>
    <div id="vite-wallet-app" class="trade-container">
        <router-view></router-view>
        <order-notice-list class="notice-list"></order-notice-list>
    </div>
</template>

<script>
import { receiveInviteDialog } from 'h5Components/dialog';
import orderNoticeList from 'components/orderNoticeList.vue';

export default {
    components: { orderNoticeList },
    mounted() {
        console.log(this.$route.query);
        if (Number(this.$route.query['ldfjacia']) > 0) {
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
