<template>
    <div class="token-card">
        <div class="title"><img :src="opt.tokenIcon" class="icon"/><span class="tokenName">{{opt.tokenName}}</span></div>
        <div class="body">
            <div class="item"><span>账户余额</span><span class="balance">{{opt.accBalance}}</span></div>
            <div class="item"><span>在途金额</span><span class="balance">{{opt.unConfirmedBalance}}</span></div>
            <div class="tips"><span>{{opt.unConfirmedNums}}笔交易待确认</span></div>
        </div>
        <div class="btn">发送交易</div>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber.js';
import viteIcon from 'assets/imgs/vite.svg';

let inputTimeout = null;
let fetchAccountTimeout = null;
let lastFetchTime = null;

export default {
    data() {
        return {
            address: this.$route.params.address,
            accountName: '',
            balanceInfos: [],
            fundFloat: {},
            blockHeight: '0'
        };
    },
    props: {
        opt: {
            type: Object,
            default: () => ({
                tokenName: '--',
                accBalance: '--',
                unConfirmedBalance: '--',
                unConfirmedNums: '--',
                tokenIcon: viteIcon
            })
        }
    },
    destroyed() {
        window.clearTimeout(inputTimeout);
        inputTimeout = null;
        this.clearAccountTimeout();
    },
    methods: {
        formatAmountList(balanceList) {
            balanceList = balanceList || [];
            let list = [];
            balanceList.forEach(({ Balance, TokenSymbol }) => {
                list.push({
                    balance: bigNumber.amountToBasicString(Balance),
                    tokenSymbol: TokenSymbol
                });
            });
            return list;
        },
        clearAccountTimeout() {
            window.clearTimeout(fetchAccountTimeout);
            fetchAccountTimeout = null;
        },
        fetchAccount(isFirst) {
            let reFetch = () => {
                fetchAccountTimeout = window.setTimeout(() => {
                    this.clearAccountTimeout();
                    this.fetchAccount();
                }, viteWallet.Block.getLoopBlockTime());
            };

            let nowFetchTime = new Date().getTime();
            lastFetchTime = nowFetchTime;

            viteWallet.Account.get(this.address)
                .then(({ name, balanceInfos, fundFloat, blockHeight }) => {
                    if (lastFetchTime !== nowFetchTime) {
                        return;
                    }

                    this.accountName = name;
                    this.fundFloat = fundFloat || {};
                    this.blockHeight = blockHeight;
                    this.balanceInfos = balanceInfos
                        ? this.formatAmountList(balanceInfos)
                        : []; // deal with balanceinfo
                    this.fundFloat.balanceInfos = fundFloat.balanceInfos
                        ? this.formatAmountList(fundFloat.balanceInfos)
                        : []; // deal with fundinfo
                    reFetch();
                })
                .catch(err => {
                    console.warn(err);
                    isFirst && window.alert(this.$t('transList.valid.err'));
                    reFetch();
                });
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
    color:#fff;
    cursor: pointer;
    &:active{
        
    }
  }
</style>
