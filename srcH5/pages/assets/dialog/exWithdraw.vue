
<template lang="pug">
extends /components/dialog/base.pug
block content
    .block__title {{ $t(`tradeAssets.confirmwithdraw.lable1`) }}
    .block__content.edit.space
        .token__title
            img(:src="token.icon")
            .symbol {{token.tokenSymbol}}
        .right.blue {{availableExBalance}}
    .block__title {{$t(`tradeAssets.confirmwithdraw.lable2`) }}
        .err {{ errTips }}
    .block__content
        input(v-model="withdrawAmount" :placeholder="$t(`tradeAssets.confirmwithdraw.placeholder`)" @input="handleUserInputAmount")
        .all(@click="all") {{$t('tradeAssets.all')}}
</template>

<script>
import debounce from 'lodash/debounce';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'h5Utils/sendTx';
import { getValidBalance } from 'h5Utils/validations';

export default {
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isWithdrawAll: false,
            withdrawAmount: '',
            dTitle: this.$t('tradeAssets.confirmwithdraw.title'),
            dSTxt: this.$t('tradeAssets.confirmwithdraw.btn'),
            errTips: '',
            fetchingFee: true
        };
    },
    computed: {
        dBtnUnuse() {
            return this.errTips || !this.withdrawAmount;
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        availableExBalance() {
            return bigNumber.toBasic(this.token.availableExAmount,
                this.token.decimals);
        }
    },
    methods: {
        handleUserInputAmount: debounce(function (v) {
            this.isWithdrawAll = false;
            this.errTips = this.testAmount(v.target.value);
        }, 500),
        testAmount(val) {
            const errorMap = { notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough') };
            return getValidBalance({
                balance: this.token.availableExAmount,
                decimals: this.token.decimals,
                errorMap
            })(val);
        },
        all() {
            if (
                this.token.availableExAmount
                && bigNumber.compared(this.token.availableExAmount, '0') > 0
            ) {
                this.isWithdrawAll = true;
                this.withdrawAmount = bigNumber.toBasic(this.token.availableExAmount,
                    this.token.decimals);
            }
        },
        inspector() {
            statistics.event('assets', 'exchange-withdraw-submit', this.defaultAddr || '');

            return new Promise((res, rej) => {
                if (this.testAmount(this.withdrawAmount)) {
                    return;
                }

                const amount = this.isWithdrawAll
                    ? this.token.availableExAmount
                    : bigNumber.toMin(this.withdrawAmount, this.token.decimals);
                sendTx({
                    methodName: 'dexFundUserWithdraw',
                    data: {
                        tokenId: this.token.tokenId,
                        amount
                    }
                }).then(() => {
                    this.$toast(this.$t('tradeAssets.confirmwithdraw.successToast'));
                    res();
                }).catch(e => {
                    this.$toast(this.$t('tradeAssets.confirmwithdraw.failToast'), e);
                    rej(e);
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Components/dialog/dialog.scss";
@include block;
</style>

