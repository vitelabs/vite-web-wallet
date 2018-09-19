<template>
  <div class="account-wrapper">
    <sync-block class="sync-block item"></sync-block>
    <account-head class="item"></account-head>
    <div class="token-list item">
      <tokenCard v-for="(item,i) in tokenInfo" :class="{'mg-left':i!==0}" :key="item.id"></tokenCard>
    </div>
  </div>
</template>

<script>
import syncBlock from "components/syncBlock";
import accountHead from "./head.vue";
import tokenCard from "./tokenCard";
import timer from "utils/asyncFlow";
import loopTime from "loopTime";

let balanceInfoInst=null;
let unConfirmedInst=null;
export default {
  data() {
    return { tokenInfo: Object.create(null) };
  },
  components: {
    accountHead,
    syncBlock,
    tokenCard
  },
  beforeMount(){
    const acc=viteWallet.Wallet.getAccInstance(this.$route.params);
    balanceInfoInst=new timer(()=>{
      return this.$store.dispatch('getBalanceInfo',acc);
    },loopTime.ledger_getAccountByAccAddr);
    unConfirmedInst=new timer(()=>{
      return this.$store.dispatch('getunConfirmedInfo',acc)
    },loopTime.ledger_getUnconfirmedInfo)
  },
  computed(){
    this.$store.getters.tokenBalanceList
  },
  beforeDestroy(){
    balanceInfoInst.stop();
    unConfirmedInst.stop();
    unConfirmedInst=null;
    unConfirmedInst=null;
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
    > .mg-left {
      margin-left: 40px;
    }
  }
}
</style>
