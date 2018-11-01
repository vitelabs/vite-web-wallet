<template>
    <div class="account-wrapper" @click="closeQrCode">
        <div>
            <sync-block class="sync-block item"></sync-block>
            <account-head ref="accountHead" class="item"></account-head>
            <div class="token-list item">
                <tokenCard v-for="token in tokenList" :key="token.id"
                           :opt="token" :sendTransaction="showTrans"></tokenCard>
            </div>

            <transaction v-if="isShowTrans" :token="activeToken" :closeTrans="closeTrans"></transaction>
        </div>
    </div>
</template>

<script>
import syncBlock from 'components/syncBlock';
import accountHead from './head';
import tokenCard from './tokenCard';
import transaction from './transaction';

import timer from 'utils/asyncFlow';
import loopTime from 'loopTime';

let balanceInfoInst = null;

export default {
    components: {
        accountHead, syncBlock, tokenCard, transaction, confirm
    },
    beforeMount() {
        const activeAccount = this.$wallet.getActiveAccount();

        this.clearTime();
        balanceInfoInst = new timer(()=>{
            return this.$store.dispatch('getBalanceInfo', activeAccount);
        }, loopTime.ledger_getBalance);
        balanceInfoInst.start();
    },
    beforeDestroy () {
        this.clearTime();
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
        clearTime() {
            balanceInfoInst && balanceInfoInst.stop();
            balanceInfoInst = null;
        },
        showTrans(token) {
            if (!token.id) {
                return;
            }
            this.isShowTrans = true;
            this.activeToken = token;
        },
        closeTrans() {
            this.isShowTrans = false;
            this.activeToken = null;
        },
        closeQrCode(e) {
            let accountHead = this.$refs.accountHead;
            accountHead && accountHead.closeQrCode(e);
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss">
.account-wrapper {
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 100%;
    padding: 0 40px;
    .sync-block {
        width: 100%;
        text-align: center;
    }
}
.item {
    margin-top: 20px;
}
.token-list {
    display: flex;
    flex-wrap: wrap;
}

@media only screen and (max-width: 550px) {
    .account-wrapper {
        padding: 0 15px;
    }
    .token-list {
        display: block;
    }
}
</style>
