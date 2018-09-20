<template>
    <div class="account-wrapper">
        <sync-block class="sync-block item"></sync-block>
        <account-head class="item"></account-head>
        <div class="token-list item">
            <tokenCard v-for="(item) in tokenInfo" :opt="item" :key="item.id"></tokenCard>
            <tokenCard v-for="(item) in tokenInfo" :opt="item" :key="item.id"></tokenCard>
        </div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import accountHead from './head.vue';
import tokenCard from './tokenCard';

import { timer } from 'utils/asyncFlow';
import loopTime from 'loopTime';

let balanceInfoInst = null;

export default {
    components: {
        accountHead,
        syncBlock,
        tokenCard
    },
    beforeMount() {
        const activeAccount = viteWallet.Wallet.getActiveAccount();

        balanceInfoInst = new timer(()=>{
            return this.$store.dispatch('getBalanceInfo', activeAccount);
        }, loopTime.ledger_getAccountByAccAddr);
        balanceInfoInst.start();
    },
    computed:{
        tokenInfo(){
            return this.$store.getters.tokenBalanceList;
        }
    },
    beforeDestroy () {
        balanceInfoInst && balanceInfoInst.stop();
        balanceInfoInst = null;
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.account-wrapper {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 40px;
    .sync-block {
        width: 100%;
        text-align: center;
    }
}

.item {
    margin-top: 40px;
    &.token-list {
        display: flex;
    }
}
</style>
