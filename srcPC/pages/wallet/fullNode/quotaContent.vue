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
        <!--<div class="row-item add-padding">
                <div class="title">{{ $t('walletFullNode.quotaContent.voteReward') }}</div>
                <div class="light">{{ $t('walletFullNode.quotaContent.yesterday') }}</div>
                <div class="text">{{ info.totalYesterdayVoteReward || '&#45;&#45;' }} VITE</div>
                <div class="light">{{ $t('walletFullNode.quotaContent.all', {
                    num: info.totalVoteReward || '&#45;&#45;'
                }) }}</div>
            </div>-->
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
                    <div class="text">{{ (info.pledgeAmount||0)|formatNum  }} VITE</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getRewardPledgeFullStat } from 'pcServices/reward';

export default {
    created() {
        this.getRewardPledgeFullStat();
    },
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
    border-radius: 2px;
    line-height: 16px;
    @include bg_color_2();
    @include box_shadow();
    @include font-family-bold();
    @include font_color_1();
    &:last-child {
        margin-right: 0px;
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
        @include gray_font_color_1();
        font-size: 12px;
    }
}
</style>
