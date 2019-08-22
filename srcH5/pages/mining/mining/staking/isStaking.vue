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
import $ViteJS from 'utils/viteClient';
import statistics from 'utils/statistics';
import stakingDetail from './stakingDetail.vue';
import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';

let stakingInfoTimer = null;

export default {
    components: { stakingDetail },
    data() {
        return {
            stakingObj: null,
            vxConfirm: null
        };
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
            this.fetchStakingInfo();
        }
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
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
            statistics.event(this.$route.name,
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
            stakingInfoTimer = new timer(() => this.fetchStakingInfo(), 2000);
            stakingInfoTimer.start();
        },
        fetchStakingInfo() {
            $ViteJS.request('pledge_getAgentPledgeInfo', {
                pledgeAddr: this.address,
                agentAddr: constant.DexFund_Addr,
                beneficialAddr: constant.DexFund_Addr,
                bid: 1
            }).then(data => {
                this.stakingObj = data;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.quota-detail {
    padding: 15px 14px;
    border-top: 1px dashed rgba(211,223,239,1);
    .no-detail {
        width: 100%;
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
            margin-bottom: -4px;
            margin-right: 5px;
        }
    }
}
</style>
