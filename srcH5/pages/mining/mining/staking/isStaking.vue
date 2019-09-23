<template>
    <div class="quota-detail">
        <div v-if="!stakingObj" @click="_showVxConfirm(1)" class="no-detail __pointer">
            {{ $t("tradeMining.addQuota") }}
        </div>
        <staking-detail v-else :stakingObj="stakingObj"
                        :showVxConfirm="_showVxConfirm"></staking-detail>
    </div>
</template>

<script>
import { insertTo } from 'h5Utils/insertTo';
import VxConfirm from './vxConfirm.vue';
import statistics from 'utils/statistics';
import stakingDetail from './stakingDetail.vue';
import { timer } from 'utils/asyncFlow';

let stakingInfoTimer = null;

export default {
    components: { stakingDetail },
    data() {
        return { vxConfirm: null };
    },
    beforeMount() {
        this.loopStakingInfo();
    },
    destroyed() {
        this.vxConfirm && this.vxConfirm.$destroy() && (this.vxConfirm = null);
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
            return this.$store.state.exchangeMine.userPledgeInfo;
        }
    },
    methods: {
        hideVxConfirm() {
            if (!this.vxConfirm) {
                return;
            }
            this.vxConfirm.destroyInstance();
            this.vxConfirm = null;
        },
        _showVxConfirm(actionType) {
            statistics.event(`H5${ this.$route.name }`,
                actionType === 1 ? 'addQuota' : 'withdrawQuota',
                this.address || '');
            this.showVxConfirm(actionType);
        },
        showVxConfirm(actionType) {
            this.vxConfirm = insertTo(VxConfirm, {
                actionType,
                stakingObj: this.stakingObj,
                close: () => {
                    this.hideVxConfirm();
                }
            });
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

.quota-detail {
    padding: 0px 8px 14px;
    border-top: 1px dashed rgba(211,223,239,1);
    .no-detail {
        width: 100%;
        padding-top: 14px;
        text-align: center;
        font-size: 14px;
        @include font-bold();
        color: rgba(62,74,89,1);
        line-height: 18px;
        &::before {
            content: ' ';
            display: inline-block;
            width: 22px;
            height: 22px;
            background: url('~h5Assets/imgs/add_quota.svg');
            background-size: 100% 100%;
            margin-bottom: -5px;
            margin-right: 5px;
        }
    }
}
</style>
