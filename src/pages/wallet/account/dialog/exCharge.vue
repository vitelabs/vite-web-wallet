
<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title {{ $t(`tradeAssets.confirmrecharge.lable1`) }}
    .block__content.edit.space
        .token__title
            img(:src="token.icon")
            .symbol {{token.tokenSymbol}}
        .right.blue {{token.balance||'0'}}
    .block__title {{$t(`tradeAssets.confirmrecharge.lable2`) }}
        .err {{ errTips }}
    .block__content
        input(v-model="withdrawAmount" :placehodler="$t('tokenCard.withdraw.amountPlaceholder',{min})")
        .withdrawall(@click="withdrawAll") {{$t("tokenCard.withdraw.labels.all")}}
</template>
<script>
import {
    verifyAddr,
    getWithdrawInfo,
    getWithdrawFee,
    withdraw
} from 'services/gate';
import debounce from 'lodash/debounce';
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
                minimumWithdrawAmount: '',
                maximumWithdrawAmount: '',
                gatewayAddress: ''
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
            fetchingFee: true
        };
    },
    beforeMount() {
        getWithdrawInfo({ walletAddress: this.defaultAddr, tokenId: this.token.tokenId },
            this.token.gateInfo.url).then(data => (this.info = data));
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
            return (
                this.ammountErr
                || !this.isAddrCorrect
                || !this.withdrawAmount
                || !this.withdrawAddr
            );
        },
        min() {
            return this.info.minimumWithdrawAmount
                ? `${ bigNumber.toBasic(this.info.minimumWithdrawAmount,
                    this.token.decimals) } ${ this.token.tokenSymbol }`
                : '--';
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
            verifyAddr({ tokenId: this.token.tokenId, withdrawAddress: val },
                this.token.gateInfo.url).then(d => {
                this.isAddrCorrect = d;
            });
        }, 500),
        withdrawAmount: debounce(function (val) {
            this.withdrawAmountMin = ''; // 重置从全部提现过来的数据。
            this.fetchingFee = true;
            getWithdrawFee({
                tokenId: this.token.tokenId,
                walletAddress: this.defaultAddr,
                amount: bigNumber.toMin(val, this.token.decimals)
            },
            this.token.gateInfo.url).then(d => {
                this.feeMin = d;
                this.fetchingFee = false;
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
            const errorMap = {
                notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough'),
                overMax: this.$t('tokenCard.withdraw.balanceErrMap.overMax', {
                    max: `${ bigNumber.toBasic(this.info.maximumWithdrawAmount,
                        this.token.decimals) } ${ this.token.tokenSymbol }`
                }),
                lessMin: this.$t('tokenCard.withdraw.balanceErrMap.lessMin', {
                    min: `${ bigNumber.toBasic(this.info.minimumWithdrawAmount,
                        this.token.decimals) } ${ this.token.tokenSymbol }`
                })
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
            if (
                this.token.totalAmount
                && bigNumber.compared(this.token.totalAmount, '0') > 0
            ) {
                this.fetchingFee = true;
                getWithdrawFee({
                    tokenId: this.token.tokenId,
                    walletAddress: this.defaultAddr,
                    amount: this.token.totalAmount,
                    containsFee: true
                },
                this.token.gateInfo.url).then(fee => {
                    this.feeMin = fee;
                    this.fetchingFee = false;
                    this.withdrawAmountMin = bigNumber.minus(this.token.totalAmount,
                        this.feeMin);
                    this.withdrawAmount = bigNumber.toBasic(this.withdrawAmountMin,
                        this.token.decimals);
                });
            }
        },
        inspector() {
            return new Promise((res, rej) => {
                withdraw({
                    amount: bigNumber.plus(this.withdrawAmountMin
                                || bigNumber.toMin(this.withdrawAmount,
                                    this.token.decimals),
                    this.feeMin,
                    0),
                    withdrawAddress: this.withdrawAddr,
                    gateAddr: this.info.gatewayAddress,
                    tokenId: this.token.tokenId
                },
                this.token.gateInfo.url)
                    .then(d => {
                        this.$toast(this.$t('tokenCard.withdraw.successTips'));
                        res(d);
                    })
                    .catch(e => {
                        this.failTips = this.$t('tokenCard.withdraw.failTips');
                        rej(e);
                    });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./dialog.scss";
@include block;
</style>

