<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title 账户余额
    .block__content.edit.space
        .token__title
            img
            .symbol {{token.balance}}
        .right.blue {{token.tokenSymbol}}
    .block__title 提现地址
        .err {{isAddrCorrect?'':'地址格式错误'}}
    input.block__content(v-model="withdrawAddr")
    .block__title 提现金额
        .err {{ammountErr}}
    .block__content
        input(v-model="withdrawAmount")
        .withdraw-all(@click="withdrawAll") 全部
    .block__title 手续费
    .block__content.edit.space
        div   提现手续费
        div {{fee+token.tokenSymbol}}
</template>

<script>
import { verifyAddr, getWithdrawInfo, getWithdrawFee, withdraw } from 'services/gate';
import { wallet } from 'utils/wallet';
import { debounce } from 'lodash';
import { getValidBalance } from 'utils/validations';
import bigNumber from 'utils/bigNumber';
export default {
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            info: {
                'minimumWithdrawAmount': '',
                'maximumWithdrawAmount': '',
                'gatewayAddress': ''
            },
            withdrawAddr: '',
            withdrawAmountMin: '',
            feeMin: '',
            isAddrCorrect: true,
            dTitle: '提现',
            dSTxt: '提现'
        };
    },
    beforeMount() {
        getWithdrawInfo({ walletAddress: wallet.defaultAddr, tokenId: this.token.tokenId }).then(data => (this.info = data));
    },
    computed: {
        withdrawAmount: {
            get: function () {
                return bigNumber.toBasic(this.withdrawAmountMin, this.token.decimals);
            },
            set: function (val) {
                if (this.ammountErr) {
                    return;
                }
                this.withdrawAmountMin = bigNumber.toMin(val, this.token.decimals);
            }
        },
        fee() {
            return bigNumber.toBasic(this.feeMin, this.token.decimals);
        },
        ammountErr() {
            return getValidBalance({ balance: this.token.balance, decimals: this.token.decimals, minNum: this.minimumWithdrawAmount, maxNum: this.maximumWithdrawAmount })(this.withdrawAmount);
        },
        dBtnUnuse() {
            return this.ammountErr || !this.isAddrCorrect;
        }
    },
    watch: {
        withdrawAddr: debounce(function (val) {
            verifyAddr({ tokenId: this.token.tokenId, withdrawAddress: val }).then(d => {
                this.isAddrCorrect = d;
            });
        }, 500),
        withdrawAmount: debounce(function (val) {
            getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: wallet.defaultAddr, amount: bigNumber.toMin(val, this.token.decimals) }).then(d => {
                this.feeMin = d;
            });
        }, 500)
    },
    methods: {
        withdrawAll() {
            if (this.token.totalAmount && bigNumber.compared(this.token.totalAmount, '0') > 0) {
                getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: wallet.defaultAddr, amount: this.token.totalAmount, containsFee: true }).then(fee => {
                    this.feeMin = fee;
                    this.withdrawAmountMin = bigNumber.minus(this.token.totalAmount, this.feeMin);
                });
            }
        },
        inspector() {
            return new Promise((res, rej) => {
                withdraw({ amount: bigNumber.plus(bigNumber.toMin(this.withdrawAmount, this.token.decimals), this.fee, 0), withdrawAddress: this.withdrawAddr, gateAddr: this.info.gatewayAddress, tokenId: this.token.tokenId }).then(d => res(d)).catch(e => rej(e));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.block__title {
    height: 16px;
    font-size: 14px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(29, 32, 36, 1);
    line-height: 16px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .err{
        color: red;
    }
    &:first-child {
        margin-top: 0;
    }
    .title_icon {
        float: right;
        &.copy {
            margin-right: 10px;
        }
    }
}
.block__content {
    position: relative;
    height: 40px;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 14px;
    word-break: break-all;
    width: 100%;
    line-height: 40px;
    box-sizing: border-box;
    margin-top: 16px;
    padding: 10px 15px;
    align-items: center;
    display: flex;
    width: 100%;
    input{
        width: 100%;
    }
    .withdraw-all{
        background: #007AFF;
        color: #fff;
        cursor: pointer;
        font-size: 12px;
        padding: 0 6px;
        height: 18px;
        line-height: 18px;
        float: right;
        display: flex;
        word-break: keep-all;
    }
    .token__title{
        display: flex;
        justify-content: center;
    }
    &.edit{
        text-align: left;
        background: rgba(243, 246, 249, 1);
    }
    &.space{
        display: flex;
        justify-content: space-between;
    }
}
</style>

