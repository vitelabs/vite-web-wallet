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
        input(v-model="withdrawAmount" :placeholder="$t('tokenCard.withdraw.amountPlaceholder',{min})")
        .all(@click="withdrawAll") {{$t("tokenCard.withdraw.labels.all")}}
    .block__title
        .tips-container {{$t("tokenCard.withdraw.labels.fee")}}
            i(class="tipsicon hoveraction" @click.self.stop="toggleTips")
                tooltips(v-show="isFeeTipsShow" v-click-outside="hideTips" :content="$t('tokenCard.withdraw.feeTips')" class="fee-tips")
    .block__content.edit.space
        div   {{$t("tokenCard.withdraw.labels.fee")}}
        div {{(fee||'--') }} <span class="light">{{token.tokenSymbol}}</span>
    .err_submit(v-if="failTips") {{failTips}}
        .dot

</template>

<script>
import { verifyAddr, getWithdrawInfo, getWithdrawFee, withdraw } from 'services/gate';
import debounce from 'lodash/debounce';
import { getValidBalance } from 'utils/validations';
import bigNumber from 'utils/bigNumber';
import tooltips from 'components/tooltips';
import { getTokenIcon } from 'utils/tokenParser';
import { execWithValid } from 'utils/execWithValid';


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
                'gatewayAddress': '',
                type: -1
            },
            withdrawAddr: '',
            withdrawAmountMin: '',
            withdrawAmount: '',
            feeMin: '',
            isAddrCorrect: true,
            dTitle: this.$t('tokenCard.withdraw.title'),
            dSTxt: this.$t('tokenCard.withdraw.title'),
            failTips: '',
            isFeeTipsShow: false,
            fetchingFee: true,
            verifingAddr: false
        };
    },
    beforeMount() {
        getWithdrawInfo({ walletAddress: this.defaultAddr, tokenId: this.token.tokenId }, this.token.gateInfo.url).then(data => (this.info = data));
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
            return this.ammountErr || !this.isAddrCorrect || !this.withdrawAmount || !this.withdrawAddr || this.verifingAddr || this.fetchingFee;
        },
        min() {
            return this.info.minimumWithdrawAmount ? `${ bigNumber.toBasic(this.info.minimumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` : '--';
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        withdrawAddr: debounce(function (val) {
            if (!val) {
                this.isAddrCorrect = true;
                return;
            }
            this.verifingAddr = true;
            verifyAddr({ tokenId: this.token.tokenId, withdrawAddress: val }, this.token.gateInfo.url).then(d => {
                this.isAddrCorrect = d.isValidAddress;
                this.verifingAddr = false;
            });
        }, 500),
        withdrawAmount: debounce(function (val) {
            this.withdrawAmountMin = '';// 重置从全部提现过来的数据。
            this.fetchingFee = true;
            getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: this.defaultAddr, amount: bigNumber.toMin(val, this.token.decimals) }, this.token.gateInfo.url).then(d => {
                this.feeMin = d.fee;
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
            return getValidBalance({
                balance: bigNumber.minus(this.token.totalAmount, this.feeMin),
                decimals: this.token.decimals,
                minNum: this.info.minimumWithdrawAmount,
                maxNum: this.info.maximumWithdrawAmount,
                errorMap
            })(val);
        },
        withdrawAll() {
            if (this.token.totalAmount && bigNumber.compared(this.token.totalAmount, '0') > 0) {
                this.fetchingFee = true;
                getWithdrawFee({ tokenId: this.token.tokenId, walletAddress: this.defaultAddr, amount: this.token.totalAmount, containsFee: true }, this.token.gateInfo.url).then(d => {
                    this.feeMin = d.fee;
                    this.fetchingFee = false;
                    this.withdrawAmountMin = bigNumber.minus(this.token.totalAmount, this.feeMin);
                    this.withdrawAmount = bigNumber.toBasic(this.withdrawAmountMin, this.token.decimals);
                });
            }
        },
        inspector: execWithValid(function () {
            return new Promise((res, rej) => {
                withdraw({ fee: this.feeMin, type: this.info.type, amount: bigNumber.plus(this.withdrawAmountMin || bigNumber.toMin(this.withdrawAmount, this.token.decimals), this.feeMin, 0), withdrawAddress: this.withdrawAddr, gateAddr: this.info.gatewayAddress, tokenId: this.token.tokenId }, this.token.gateInfo.url)
                    .then(d => {
                        this.$toast(this.$t('tokenCard.withdraw.successTips'));
                        res(d);
                    })
                    .catch(e => {
                        this.failTips = this.$t('tokenCard.withdraw.failTips');
                        rej(e);
                    });
            });
        })
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./dialog.scss";
@include block;
.block__title {
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
                @include font-family-normal();
            }
        }
    }
}
.err_submit{
    padding-left: 13px;
    position: relative;
    width: 100%;
    color: #FF2929;
    font-size: 14px;
    @include font-family-normal();
    margin-top: 6px;
    top: 14px;
    .dot {
        width: 6px;
        height: 6px;
        background: #FF2929;
        border-radius: 100%;
        position: absolute;
        left: 0;
        top: 10px;
    }
}
</style>

