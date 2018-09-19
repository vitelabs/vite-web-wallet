<template>
    <div class="token-card">
        <div class="title"><img :src="iconMap[opt.tokenName]||iconMap['default']" class="icon" />
            <span class="tokenName">{{opt.symbol}}</span>
        </div>
        <div class="body">
            <div class="item">
                <span>账户余额</span>
                <span class="balance">{{opt.accBalance}}</span>
            </div>
            <div class="item">
                <span>在途金额</span>
                <span class="balance">{{opt.unConfirmedBalance}}</span>
            </div>
            <div class="tips">
                <span>{{opt.unConfirmedNums}}笔交易待确认</span>
            </div>
        </div>
        <div class="btn">发送交易</div>
    </div>
</template>

<script>
import bigNumber from "utils/bigNumber.js";
import viteIcon from "assets/imgs/vite.svg";
import vccIcon from "assets/imgs/vcc.svg";

let inputTimeout = null;
let fetchAccountTimeout = null;
let lastFetchTime = null;
const iconMap = {
  vite: viteIcon,
  vcc: vccIcon,
  default: viteIcon
};

export default {
  props: {
    opt: {
      type: Object,
      default: () => ({
        tokenName: "--",
        symbol: "--",
        accBalance: "--",
        unConfirmedBalance: "--",
        unConfirmedNums: "--"
      })
    }
  }
};
</script>
<style lang='scss' scoped>
.token-card {
  width: 254px;
  background: #fff;
  box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
}
.title {
  border-bottom: 1px solid #e5edf3;
  height: 56px;
  display: flex;
  align-items: center;
  .icon {
    margin-left: 25px;
  }
  .tokenName {
    margin-left: 10px;
    font-size: 18px;
  }
}
.body {
  padding: 0 30px 20px;
  .item {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    .balance {
      font-size: 20px;
      color: #007aff;
    }
  }
  .tips {
    margin-top: 8px;
    font-size: 12px;
    color: #5b638d;
    display: flex;
    justify-content: flex-end;
  }
}
.btn {
  background: #007aff;
  height: 44px;
  vertical-align: middle;
  line-height: 44px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  &:active {
  }
}
</style>
