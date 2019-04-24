<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title {{$t("tokenCard.withdraw.labels.balance")}}
    .block__content.edit.space
        .token__title
            img
            .symbol {{token.balance||'0'}}
        .right.blue {{token.tokenSymbol}}
    .block__title {{$t("tokenCard.withdraw.labels.address")}}
        .err {{isAddrCorrect?'':$t("tokenCard.withdraw.addressErr")}}
    input.block__content(v-model="withdrawAddr" :placehodler="$t('tokenCard.withdraw.addressPlaceholder')")
    .block__title {{$t("tokenCard.withdraw.labels.amount")}}
        .err {{ammountErr}}
    .block__content
        input(v-model="withdrawAmount" :placehodler="$t('tokenCard.withdraw.amountPlaceholder',{min})")
        .withdraw-all(@click="withdrawAll") {{$t("tokenCard.withdraw.labels.all")}}
    .block__title
        .tips-container {{$t("tokenCard.withdraw.labels.fee")}}
            i(class="tipsicon hoveraction" @click.self.stop="toggleTips")
                tooltips(v-show="isFeeTipsShow" v-click-outside="hideTips" :content="'cghjvhhgvhgvghghgv'")
    .block__content.edit.space
        div   {{$t("tokenCard.withdraw.labels.fee")}}
        div {{(fee||'--')+token.tokenSymbol}}
</template>

<script>
import { verifyAddr, getWithdrawInfo, getWithdrawFee, withdraw } from 'services/gate';
import { wallet } from 'utils/wallet';
import { debounce } from 'lodash';
import { getValidBalance } from 'utils/validations';
import bigNumber from 'utils/bigNumber';
import tooltips from 'components/tooltips';

export default {
    components: { tooltips },
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
            dTitle: this.$t('tokenCard.withdraw.title'),
            dSTxt: this.$t('tokenCard.withdraw.title'),
            isFeeTipsShow: false
        };
    },
    beforeMount() {
        debugger;
        getWithdrawInfo({ walletAddress: wallet.defaultAddr, tokenId: this.token.tokenId }, this.token.gateInfo.url).then(data => (this.info = data));
    },
    computed: {
        withdrawAmount: {
            get: function () {
                return bigNumber.toBasic(this.withdrawAmountMin, this.token.decimals);
            },
            set: function (val) {
                this.withdrawAmountMin = bigNumber.toMin(val, this.token.decimals);
            }
        },
        fee() {
            return bigNumber.toBasic(this.feeMin, this.token.decimals);
        },
        ammountErr() {
            return this.validateAmount(this.withdrawAmountMin);
        },
        dBtnUnuse() {
            return this.ammountErr || !this.isAddrCorrect || !this.withdrawAmount || !this.withdrawAddr;
        },
        min() {
            return this.info.minimumWithdrawAmount ? `${ bigNumber.toBasic(this.info.minimumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` : '--';
        }
    },
    watch: {
        withdrawAddr: debounce(function (val) {
            if (!val) {
                this.isAddrCorrect = true;
                return;
            }
            verifyAddr({ tokenId: this.token.tokenId, withdrawAddress: val }, this.token.gateInfo.url).then(d => {
                this.isAddrCorrect = d;
            });
        }, 500),
        withdrawAmountMin: debounce(function (val) {
            getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: wallet.defaultAddr, amount: val }, this.token.gateInfo.url).then(d => {
                this.feeMin = d;
            });
        }, 500)
    },
    methods: {
        toggleTips() {
            this.isFeeTipsShow = !this.isFeeTipsShow;
        },
        hideTips() {
            this.isFeeTipsShow = false;
        },
        validateAmount(val) {
            return getValidBalance({ balance: this.token.totalAmount, decimals: this.token.decimals, minNum: this.info.minimumWithdrawAmount, maxNum: this.info.maximumWithdrawAmount })(val);
        },
        withdrawAll() {
            if (this.token.totalAmount && bigNumber.compared(this.token.totalAmount, '0') > 0) {
                getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: wallet.defaultAddr, amount: this.token.totalAmount, containsFee: true }, this.token.gateInfo.url).then(fee => {
                    this.feeMin = fee;
                    this.withdrawAmountMin = bigNumber.minus(this.token.totalAmount, this.feeMin);
                });
            }
        },
        inspector() {
            return new Promise((res, rej) => {
                withdraw({ amount: bigNumber.plus(this.withdrawAmountMin, this.feeMin, 0), withdrawAddress: this.withdrawAddr, gateAddr: this.info.gatewayAddress, tokenId: this.token.tokenId }, this.token.gateInfo.url)
                    .then(d => {
                        this.$toast(this.$t('tokenCard.withdraw.successTips'));
                        res(d);
                    })
                    .catch(e => rej(e));
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
    .tips-container{
        overflow:visible;
    }
    .hoveraction {
        &.tipsicon {
            position: relative;
            display: inline-block;
            background: url(~assets/imgs/hover_help.svg);
            overflow: visible;
            width: 16px;
            height: 16px;
            vertical-align: sub;
            cursor: pointer;
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

