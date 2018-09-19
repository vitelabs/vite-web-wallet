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

let fetchAccountTimeout = null;
let lastFetchTime = null;
export default {
  data() {
    return { tokenInfo: Object.create(null) };
  },
  components: {
    accountHead,
    syncBlock,
    tokenCard
  },
  beforeMount() {
      this.updateBalance();
  },
  methods: {
    updateBalance(){
    const acc = viteWallet.Wallet.getAccInstance(this.$route.params);
    acc.getAccountByAccAddr().then(data => {
      _updateBalance({balanceInfo:data.result.balanceInfo})
    });
    acc.getUnconfirmedInfo().then(data => {
      _updateBalance({balanceInfo:data.result.balanceInfo})
    });
    function _updateBalance({ balanceInfo, unconfirmedInfo }) {
      if (balanceInfo) {
        balanceInfo.forEach(v => {
        v.balance=viteWallet.Token.toBasic(balance, v.mintage.decimals)
          if (this.tokenInfo[v.mintage.id]) {
            this.tokenInfo[v.mintage.id].accBalance = v.balance;
          } else {
            this.tokenInfo[v.mintage.id] = {
              symbol:v.symbol,
              tokenName: v.name,
              accBalance: v.balance,
              unConfirmedBalance: "--",
              unConfirmedNums: "--"
            };
          }
        });
      }
      if (unconfirmedInfo) {
        balanceInfo.forEach(v => {
            v.balance=viteWallet.Token.toBasic(balance, v.mintage.decimals)
          if (this.tokenInfo[v.mintage.id]) {
              this.tokenInfo[v.mintage.id].unConfirmedBalance=v.balance;
              this.tokenInfo[v.mintage.id].unConfirmedNums=v.unConfirmedNums;
          } else {
            this.tokenInfo[v.mintage.id] = {
              symbol:v.symbol,
              tokenName: v.name,
              accBalance: "--",
              unConfirmedBalance: v.balance,
            //   unConfirmedNums: v.unConfirmedNums
            }
          }
        });
      }
    }
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
