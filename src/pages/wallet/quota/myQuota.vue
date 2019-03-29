<template>
    <div class="my-quota-wrapper">
        <div class="row">
            <div class="title">{{ $t('walletQuota.myQuota') }}</div>
            <div class="text">{{ quota || 0 }}</div>
        </div>
        <div class="row">
            <div class="title">{{ $t('walletQuota.maxTxNum') }}</div>
            <div class="text">{{ txNum || 0 }}</div>
        </div>
    </div>
</template>

<script>
import { timer } from 'utils/asyncFlow';

let quotaInst;

export default {
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const address = activeAccount.getDefaultAddr();

        return { address };
    },
    computed: {
        quota() {
            return this.$store.state.pledge.quotaAmount || 0;
        },
        txNum() {
            return this.$store.state.pledge.pledgeTransNum;
        }
    },
    mounted() {
        this.startLoopQuota();
    },
    beforeDestroy() {
        this.stopLoopQuota();
    },
    methods: {
        startLoopQuota() {
            this.stopLoopQuota();
            quotaInst = new timer(() => this.fetchQuota(), 1000);
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
    margin-top: 40px;
    padding: 35px 24px;
}

.row {
    font-family: $font-bold, arial, sans-serif;

    &:first-child {
        margin-bottom: 40px;
    }

    .title {
        font-size: 14px;
        color: #1d2024;
        letter-spacing: 0.35px;
        margin-bottom: 12px;
    }

    .text {
        font-size: 24px;
        color: #1d2024;
        line-height: 32px;
    }
}

@media only screen and (max-width: 550px) {
    .my-quota-wrapper {
        margin-top: 20px;
    }
}
</style>
