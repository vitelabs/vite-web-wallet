<template>
    <div id="vite-wallet-app" class="trade-container">
        <router-view></router-view>
    </div>
</template>

<script>
import getDialog from 'h5Components/dialog/getDialog.js';
import receiveInvite from 'h5Components/receiveInvite.vue';

export default {
    mounted() {
        const receiveInviteDialog = getDialog(receiveInvite);
        receiveInviteDialog();

        this.$store.dispatch('startLoopBalance');
        this.$store.dispatch('startLoopExchangeBalance');
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
</style>
