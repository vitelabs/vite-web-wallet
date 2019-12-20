<template>
    <div class="my-quota-wrapper">
        <div class="row">
            <div class="row-item">
                <div class="title">{{ $t('walletFullNode.quotaContent.onlineReward') }}</div>
                <div class="text">{{ txNum || 0 }} UT</div>
            </div>
            <div class="row-item">
                <div class="title">{{ $t('walletFullNode.quotaContent.voteReward') }}</div>
                <div class="text">{{ txNum || 0 }} UT</div>
            </div>
        </div>
        <div class="row">
            <div class="title">{{ $t('walletQuota.myQuota') }}</div>
            <div class="text">{{ txNum || 0 }} UT</div>
        </div>
    </div>
</template>

<script>
import { timer } from 'utils/asyncFlow';

let quotaInst;

export default {
    mounted() {
        this.startLoopQuota();
    },
    beforeDestroy() {
        this.stopLoopQuota();
    },
    computed: {
        txNum() {
            return this.$store.state.pledge.pledgeTransNum;
        },
        addr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        addr() {
            this.startLoopQuota();
        }
    },
    methods: {
        startLoopQuota() {
            this.stopLoopQuota();
            quotaInst = new timer(() => this.$store.dispatch('fetchQuota'), 1000);
            quotaInst.start();
        },
        stopLoopQuota() {
            quotaInst && quotaInst.stop();
            quotaInst = null;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.my-quota-wrapper {
    display: flex;
    flex-direction: row;
}

.row {
    display: flex;
    flex: 1;
    margin-right: 10px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
    @include font-family-bold();
    color: #1d2024;
    &:last-child {
        margin-left: 0px;
    }

    .row-item {
        padding: 15px 30px;
        flex: 1;
    }
    .title {
        font-size: 14px;
        letter-spacing: 0.35px;
        margin-bottom: 14px;
    }
    .text {
        font-size: 18px;
        line-height: 22px;
    }
}
</style>
