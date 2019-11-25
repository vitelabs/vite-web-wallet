<template>
    <div class="quota-detail">
        <div v-if="!stakingObj || +!stakingObj.totalStakeCount" @click="addStaking" class="no-detail __pointer">
            {{ $t("tradeMining.addQuota") }}
        </div>
        <staking-detail v-else :addStaking="addStaking"></staking-detail>
        <stakeForMining ref="stakeForMining"></stakeForMining>
    </div>
</template>

<script>
import statistics from 'utils/statistics';
import stakingDetail from './stakingDetail.vue';
import { timer } from 'utils/asyncFlow';
import stakeForMining from './stakeForMining';

let stakingInfoTimer = null;

export default {
    components: { stakeForMining, stakingDetail },
    beforeMount() {
        this.loopStakingInfo();
    },
    destroyed() {
        this.stopStakingInfo();
    },
    watch: {
        address() {
            this.loopStakingInfo();
        }
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        stakingObj() {
            console.log(this.$store.state.exchangeMine.userPledgeInfo);
            return this.$store.state.exchangeMine.userPledgeInfo;
        }
    },
    methods: {
        addStaking() {
            statistics.event(`H5${ this.$route.name }`, 'addQuota', this.address || '');
            this.$refs.stakeForMining.show();
        },
        stopStakingInfo() {
            stakingInfoTimer && stakingInfoTimer.stop();
            stakingInfoTimer = null;
        },
        loopStakingInfo() {
            this.stopStakingInfo();
            this.$store.dispatch('getAgentMiningPledgeInfo');
            stakingInfoTimer = new timer(() => this.$store.dispatch('getAgentMiningPledgeInfo'), 2000);
            stakingInfoTimer.start();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.no-detail {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    font-size: 14px;
    @include font-bold();
    color: rgba(62,74,89,1);
    line-height: 18px;
    padding: 14px 8px;
    border-top: 1px dashed rgba(211,223,239,1);
    &::before {
        content: ' ';
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url('~h5Assets/imgs/add_quota.svg');
        background-size: 100% 100%;
        margin-right: 5px;
    }
}
</style>
