<template>
    <div class="staking-detail">
        <div class="item">
            <div>{{ $t("stakingAmount") }}</div>
            <div class="bold">{{ totalStakingAmount }}</div>
            <div class="light">
                <span>{{ $t('tradeMining.dividends') }}</span> {{ `${expectedDividends} VX` }}
            </div>
        </div>

        <div class="item no-border">
            <div>{{ $t("tradeDividend.unlockAmount") }}</div>
            <div class="bold">
                {{ `${cancellingStake} VITE` }}
                <span v-show="viteBalanceInfo.cancellingStake" @click="showCancelStakeDetails" class="down-icon __pointer"></span>
            </div>
        </div>

        <div class="operations">
            <div class="btn add __pointer" @click="showVxConfirm">
                {{ $t("tradeMining.add") }}
            </div>
            <!-- <div class="btn unuse __pointer">
                {{ $t("tradeMining.add") }}
            </div> -->
            <div class="btn cancel __pointer" @click="showStakingList">
                {{ $t("tradeMining.withdrawList") }}
            </div>
        </div>

        <stakingList ref="stakingList" :cancelStake="cancelStake"></stakingList>
        <cancelStakeForMining ref="cancelStakeForMining"></cancelStakeForMining>
        <cancelling-details ref="cancelStakeDetail"></cancelling-details>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';
import stakingList from './stakingList';
import cancelStakeForMining from './cancelStakeForMining.vue';
import cancellingDetails from './cancellingDetails.vue';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { stakingList, cancelStakeForMining, cancellingDetails },
    mounted() {
        this.$store.dispatch('getCurrentPledgeForVxSum');
    },
    props: {
        showVxConfirm: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        viteBalanceInfo() {
            return this.$store.getters.exViteBalanceInfo;
        },
        cancellingStake() {
            const cancellingStake = this.viteBalanceInfo.cancellingStake || 0;
            return bigNumber.toBasic(cancellingStake, Vite_Token_Info.decimals);
        },
        stakingObj() {
            return this.$store.state.exchangeMine.userPledgeInfo;
        },
        canCancel() {
            return this.stakingObj.withdrawHeight <= this.height;
        },
        totalStakingAmount() {
            if (!this.stakingObj) {
                return 0;
            }
            return bigNumber.toBasic(this.stakingObj.totalStakeAmount || 0, Vite_Token_Info.decimals);
        },
        expectedDividends() {
            return this.$store.getters.stakingDividends;
        }
    },
    methods: {
        showStakingList() {
            this.$refs.stakingList.show();
        },
        cancelStake(cancelItem) {
            this.$refs.cancelStakeForMining.show(cancelItem);
        },
        showCancelStakeDetails() {
            this.$refs.cancelStakeDetail.show();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../../components/stakingDetail.scss";

.down-icon {
    display: inline-block;
    background: url('~assets/imgs/moreRecords.svg');
    background-size: 100% 100%;
    width: 16px;
    height: 16px;
    margin-bottom: -2px;
    margin-left: 4px;
}
</style>
