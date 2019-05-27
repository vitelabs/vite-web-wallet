
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
        input(v-model="withdrawAmount" :placeholder="$t(`tradeAssets.confirmrecharge.placeholder`)")
        .all(@click="withdrawAll") {{$t('tradeAssets.all')}}
</template>
<script>
import { getValidBalance } from 'utils/validations';
import sendTx from 'utils/sendTx';
import debounce from 'lodash/debounce';
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
            isWithdrawAll: false,
            withdrawAmount: '',
            dTitle: this.$t('tradeAssets.confirmrecharge.title'),
            dSTxt: this.$t('tradeAssets.confirmrecharge.btn'),
            errTips: '',
            fetchingFee: true
        };
    },
    computed: {
        dBtnUnuse() {
            return (
                this.ammountErr
        || !this.withdrawAmount
            );
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        handleUserInputAmount: debounce(function (v) {
            this.isWithdrawAll = false;
            this.errTips = this.testAmount(v);
        }, 500),
        testAmount(val) {
            const errorMap = { notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough') };
            return getValidBalance({ balance: this.token.totalAmount, decimals: this.token.decimals, errorMap })(val);
        },
        withdrawAll() {
            if (
                this.token.totalAmount
        && bigNumber.compared(this.token.totalAmount, '0') > 0
            ) {
                this.isWithdrawAll = true;
                this.withdrawAmount = bigNumber.toBasic(this.token.totalAmount, this.token.decimals);
            }
        },
        inspector() {
            return new Promise((res, rej) => {
                if (this.testAmount(this.withdrawAmount)) return;
                const amount = this.isWithdrawAll ? this.token.totalAmount : bigNumber.toMin(this.withdrawAmount, this.token.decimals);
                try {
                    sendTx('dexFundUserWithdraw', { tokenId: this.token.tokenId, amount });
                    this.$toast(this.$t('tradeAssets.confirmrecharge.successToast'));
                    res();
                } catch (e) {
                    this.$toast(this.$t('tradeAssets.confirmrecharge.failToast'), e);
                    rej(e);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./dialog.scss";
@include block;
</style>

