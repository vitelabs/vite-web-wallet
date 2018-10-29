<template>
    <div class="my-quota-wrapper">
        <div class="row">
            <div class="title">{{ $t('quota.myQuota') }}</div>
            <div class="text">{{ quota || 0 }}</div>
        </div>
        <div class="row">
            <div class="title">{{ $t('quota.maxTxNum') }}</div>
            <div class="text">{{ txNum || 0 }}</div>
        </div>
    </div>
</template>

<script>
import timer from 'utils/asyncFlow';

let quotaInst;

export default {
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
        let address = activeAccount.getDefaultAddr();
        return {
            address
        };
    },
    computed: {
        quota() {
            let quotaAmount = this.$store.state.pledge.quotaAmount || 0;
            
            if (this.$i18n.locale === 'zh') {
                if (viteWallet.BigNumber.compared(quotaAmount, 10000) < 0) {
                    return quotaAmount;
                }
                return viteWallet.BigNumber.dividedToNumber(quotaAmount, 10000, 2) + ' 万';
            }
            if (viteWallet.BigNumber.compared(quotaAmount, 1000) < 0) {
                return quotaAmount;
            }
            return viteWallet.BigNumber.dividedToNumber(quotaAmount, 1000, 3) + ' k';
        },
        txNum() {
            return this.$store.state.pledge.pledgeTransNum;
        }
    },
    mounted() {
        this.startLoopQuota();
    },
    methods: {
        startLoopQuota() {
            this.stopLoopQuota();
            quotaInst = new timer(()=>{
                return this.fetchQuota();
            }, 1000);
            quotaInst.start();
        },
        stopLoopQuota() {
            quotaInst && quotaInst.stop();
            quotaInst = null;
        },
        fetchQuota() {
            return this.$store.dispatch('fetchQuota', this.address);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.my-quota-wrapper {
    padding: 35px 24px;
}
.row {
    font-family: $font-bold;
    &:first-child {
        margin-bottom: 40px;
    }
    .title {
        font-size: 14px;
        color: #1D2024;
        letter-spacing: 0.35px;
        margin-bottom: 12px;
    }
    .text {
        font-size: 24px;
        color: #1D2024;
        line-height: 32px;
    }
}
</style>
