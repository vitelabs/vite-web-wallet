<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title {{$t("tokenCard.withdraw.labels.balance")}}
    .block__content.edit.space
        .token__title
            img(:src="token.icon||getIcon(token.tokenId)")
            .symbol {{token.tokenSymbol}}
        .right.blue {{token.balance||'0'}}
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
                tooltips(v-show="isFeeTipsShow" v-click-outside="hideTips" :content="$t('tokenCard.withdraw.feeTips')" class="fee-tips")
    .block__content.edit.space
        div   {{$t("tokenCard.withdraw.labels.fee")}}
        div {{(fee||'--') }} <span class="light">{{token.tokenSymbol}}</span>
    .err(v-if="failTips") {{failTips}}
        .dot

</template>

<script>
import { verifyAddr, getWithdrawInfo, getWithdrawFee, withdraw } from 'services/gate';
import { wallet } from 'utils/wallet';
import { debounce } from 'lodash';
import { getValidBalance } from 'utils/validations';
import bigNumber from 'utils/bigNumber';
import tooltips from 'components/tooltips';
import getTokenIcon from 'utils/getTokenIcon';

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
            withdrawAmount: '',
            feeMin: '',
            isAddrCorrect: true,
            dTitle: this.$t('tokenCard.withdraw.title'),
            dSTxt: this.$t('tokenCard.withdraw.title'),
            failTips:'',
            isFeeTipsShow: false,
            fetchingFee: true
        };
    },
    beforeMount() {
        getWithdrawInfo({ walletAddress: wallet.defaultAddr, tokenId: this.token.tokenId }, this.token.gateInfo.url).then(data => (this.info = data));
    },
    computed: {
        fee() {
            return bigNumber.toBasic(this.feeMin, this.token.decimals);
        },
        ammountErr() {
            if (!this.withdrawAmount) {
                return;
            }
            return this.validateAmount(this.withdrawAmount);
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
        withdrawAmount: debounce(function (val) {
            this.withdrawAmountMin = '';// 重置从全部提现过来的数据。
            this.fetchingFee = true;
            getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: wallet.defaultAddr, amount: bigNumber.toMin(val, this.token.decimals) }, this.token.gateInfo.url).then(d => {
                this.feeMin = d;
                this.fetchingFee = false;
            });
        }, 500)
    },
    methods: {
        getIcon(id) {
            return getTokenIcon(id);
        },
        toggleTips() {
            this.isFeeTipsShow = !this.isFeeTipsShow;
        },
        hideTips() {
            this.isFeeTipsShow = false;
        },
        validateAmount(val) {
            const errorMap = {
                notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough'),
                overMax: this.$t('tokenCard.withdraw.balanceErrMap.overMax', { max: `${ bigNumber.toBasic(this.info.maximumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` }),
                lessMin: this.$t('tokenCard.withdraw.balanceErrMap.lessMin', { min: `${ bigNumber.toBasic(this.info.minimumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` })
            };
            return getValidBalance({ balance: bigNumber.minus(this.token.totalAmount, this.feeMin), decimals: this.token.decimals, minNum: this.info.minimumWithdrawAmount, maxNum: this.info.maximumWithdrawAmount, errorMap })(val);
        },
        withdrawAll() {
            if (this.token.totalAmount && bigNumber.compared(this.token.totalAmount, '0') > 0) {
                this.fetchingFee = true;
                getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: wallet.defaultAddr, amount: this.token.totalAmount, containsFee: true }, this.token.gateInfo.url).then(fee => {
                    this.feeMin = fee;
                    this.fetchingFee = false;
                    this.withdrawAmountMin = bigNumber.minus(this.token.totalAmount, this.feeMin);
                    this.withdrawAmount = bigNumber.toBasic(this.withdrawAmountMin, this.token.decimals);
                });
            }
        },
        inspector() {
            return new Promise((res, rej) => {
                withdraw({ amount: bigNumber.plus(this.withdrawAmountMin || bigNumber.toMin(this.withdrawAmount, this.token.decimals), this.feeMin, 0), withdrawAddress: this.withdrawAddr, gateAddr: this.info.gatewayAddress, tokenId: this.token.tokenId }, this.token.gateInfo.url)
                    .then(d => {
                        this.$toast(this.$t('tokenCard.withdraw.successTips'));
                        res(d);
                    })
                    .catch(e => {
                        this.failTips=this.$t('tokenCard.withdraw.failTips');
                        rej(e);
                    });
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
        color: #FF2929;
        font-size: 12px;
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
        overflow: visible;
    }
    .hoveraction {
        &.tipsicon {
            margin-left: 4px;
            background-repeat: no-repeat;
            position: relative;
            display: inline-block;
            background: url(~assets/imgs/hover_help.svg);
            overflow: visible;
            width: 16px;
            height: 16px;
            vertical-align: sub;
            cursor: pointer;
            .fee-tips{
                color: #5E6875;
                min-width: 150px;
                font-family: $font-normal;
            }
        }
    }
}
.err{
    padding-left: 13px;
    position: relative;
    width: 100%;
    color: #FF2929;
    font-size:14px;
    font-family:$font-normal;
    .dot {
        width: 6px;
        height: 6px;
        background: #FF2929;
        border-radius: 100%;
        position: absolute;
        left: 0;
        top: 6px;
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
    .light{
        color: #5E6875;
    }
    .withdraw-all{
        border-radius: 2px;
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
        align-items: center;
        img{
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
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

