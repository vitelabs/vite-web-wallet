<template>
    <div class="account-wrapper">
        <sync-block class="sync-block item"></sync-block>
        <account-head class="item"></account-head>
        <div class="item">
            <tokenCard v-for="token in tokenList" :key="token.id"
                       :opt="token" :sendTansaction="showTrans"></tokenCard>
        </div>
        <div v-show="isShowTrans" class="transaction" @click="closeTrans">
            <transaction :token="activeToken" :closeTrans="closeTrans"></transaction>
        </div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import accountHead from './head';
import tokenCard from './tokenCard';
import transaction from './transaction';

import { timer } from 'utils/asyncFlow';
import loopTime from 'loopTime';

let balanceInfoInst = null;

export default {
    components: {
        accountHead, syncBlock, tokenCard, transaction
    },
    beforeMount() {
        const activeAccount = viteWallet.Wallet.getActiveAccount();

        balanceInfoInst = new timer(()=>{
            return this.$store.dispatch('getBalanceInfo', activeAccount);
        }, loopTime.ledger_getAccountByAccAddr);
        balanceInfoInst.start();
    },
    beforeDestroy () {
        balanceInfoInst && balanceInfoInst.stop();
        balanceInfoInst = null;
    },
    data() {
        return {
            isShowTrans: false,
            activeToken: null
        };
    },
    computed: {
        tokenList() {
            return this.$store.getters.tokenBalanceList;
        }
    },
    methods: {
        showTrans(token) {
            this.isShowTrans = true;
            this.activeToken = token;
        },
        closeTrans() {
            this.isShowTrans = false;
            this.activeToken = null;
        }
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
    overflow: auto;
    padding: 0 40px;
    .sync-block {
        width: 100%;
        text-align: center;
    }
}

.item {
    margin-top: 40px;
}

.transaction {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
}
</style>
