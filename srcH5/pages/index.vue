<template>
    <div id="vite-wallet-app" class="trade-container">
        <router-view></router-view>
    </div>
</template>

<script>
// import getDialog from 'components/getDialog.js';
// import { receiveInviteDialog } from 'components/dialog';

export default {
    mounted() {
        // console.log(getDialog(receiveInviteDialog));
        this.$store.commit('setLang', this.$i18n.locale);
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
