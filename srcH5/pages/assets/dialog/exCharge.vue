
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
        input(v-model="withdrawAmount" :placeholder="$t(`tradeAssets.confirmrecharge.placeholder`)" @input='handleUserInputAmount')
        .all(@click="all") {{$t('tradeAssets.all')}}
</template>

<script>
import { getValidBalance } from 'utils/validations';
// import sendTx from 'utils/sendTx';
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
            isAll: false,
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
                this.errTips
        || !this.withdrawAmount
            );
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        handleUserInputAmount: debounce(function (e) {
            this.isAll = false;
            this.errTips = this.testAmount(e.target.value);
        }, 500),
        testAmount(val) {
            const errorMap = { notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough') };
            return getValidBalance({ balance: this.token.totalAmount, decimals: this.token.decimals, errorMap })(val);
        },
        all() {
            if (
                this.token.totalAmount
        && bigNumber.compared(this.token.totalAmount, '0') > 0
            ) {
                this.isAll = true;
                this.withdrawAmount = bigNumber.toBasic(this.token.totalAmount, this.token.decimals);
            }
        },
        inspector() {
            // return new Promise((res, rej) => {
            //     if (this.testAmount(this.withdrawAmount)) return;
            //     const amount = this.isAll ? this.token.totalAmount : bigNumber.toMin(this.withdrawAmount, this.token.decimals);
            //     sendTx({ methodName: 'dexFundUserDeposit', data: { tokenId: this.token.tokenId, amount } }).then(() => {
            //         this.$toast(this.$t('tradeAssets.confirmrecharge.successToast'));
            //         res();
            //     })
            //         .catch(e => {
            //             this.$toast(this.$t('tradeAssets.confirmrecharge.failToast'),
            //                 e);
            //             rej(e);
            //         });
            // });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Components/dialog/dialog.scss";
@include block;
</style>

