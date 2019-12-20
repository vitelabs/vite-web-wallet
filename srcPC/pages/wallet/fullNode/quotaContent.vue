<template>
    <div class="flex-wrapper">
        <div class="row flex-wrapper">
            <div class="row-item add-padding">
                <div class="title">{{ $t('walletFullNode.quotaContent.onlineReward') }}</div>
                <div class="light">{{ $t('walletFullNode.quotaContent.yesterday') }}</div>
                <div class="text">{{ info.totalYesterdayFullReward || '--' }} VITE</div>
                <div class="light">{{ $t('walletFullNode.quotaContent.all', {
                    num: info.totalFullReward || '--'
                }) }}</div>
            </div>
            <div class="row-item add-padding">
                <div class="title">{{ $t('walletFullNode.quotaContent.voteReward') }}</div>
                <div class="light">{{ $t('walletFullNode.quotaContent.yesterday') }}</div>
                <div class="text">{{ info.totalYesterdayVoteReward || '--' }} VITE</div>
                <div class="light">{{ $t('walletFullNode.quotaContent.all', {
                    num: info.totalVoteReward || '--'
                }) }}</div>
            </div>
        </div>
        <div class="row add-padding">
            <div class="title add-margin">{{ $t('walletFullNode.quotaContent.nodeInfo') }}</div>
            <div class="flex-wrapper">
                <div class="row-item">
                    <div class="light">{{ $t('walletFullNode.quotaContent.onlineNodes') }}</div>
                    <div class="text">{{ info.onlineNodeCount || '--' }}</div>
                </div>
                <div class="row-item">
                    <div class="light">{{ $t('walletFullNode.quotaContent.rewardNodes') }}</div>
                    <div class="text">{{ info.pledgeNodeCount || '--' }}</div>
                </div>
                <div class="row-item">
                    <div class="light">{{ $t('walletFullNode.quotaContent.stakeAmount') }}</div>
                    <div class="text">{{ info.pledgeAmount || '--' }} VITE</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getRewardPledgeFullStat } from 'pcServices/reward';

export default {
    data() {
        return { info: {} };
    },
    computed: {
        addr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        addr() {
            this.getRewardPledgeFullStat();
        }
    },
    methods: {
        getRewardPledgeFullStat() {
            getRewardPledgeFullStat({ address: this.addr }).then(data => {
                this.info = data || {};
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.flex-wrapper {
    display: flex;
    flex-direction: row;
}

.add-padding {
    padding: 15px 30px;
}

.row {
    flex: 1;
    margin-right: 10px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 10px 1px rgba(176, 192, 237, 0.42);
    @include font-family-bold();
    color: #1d2024;
    line-height: 16px;
    &:last-child {
        margin-left: 0px;
    }
    .row-item {
        flex: 1;
    }
    .title {
        font-size: 12px;
        margin-bottom: 12px;
        &.add-margin {
            margin-bottom: 20px;
        }
    }
    .text {
        font-size: 16px;
        line-height: 20px;
    }
    .light {
        @include font-family-normal();
        color: rgba(94,104,117,1);
        font-size: 12px;
    }
}
</style>
