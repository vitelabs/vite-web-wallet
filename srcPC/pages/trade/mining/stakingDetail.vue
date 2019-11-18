<template>
    <div class="staking-detail">
        <div class="item">
            <div>{{ $t("stakingAmount") }}</div>
            <div class="bold">{{ totalStakingAmount }}</div>
        </div>

        <div class="item no-border">
            <div>{{ $t('tradeMining.dividends') }}</div>
            <div class="bold">{{ `${expectedDividends} VX` }}</div>
        </div>

        <div class="operations">
            <div class="btn add __pointer" @click="showVxConfirm">
                {{ $t("tradeMining.add") }}
            </div>
            <div class="btn cancel __pointer" @click="showStakingList">
                {{ $t("tradeMining.withdraw") }}
            </div>
        </div>

        <stakingList ref="stakingList" :cancelStake="cancelStake"></stakingList>
        <cancelStakeForMining ref="cancelStakeForMining"></cancelStakeForMining>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';
import stakingList from './stakingList';
import cancelStakeForMining from './cancelStakeForMining.vue';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { stakingList, cancelStakeForMining },
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../components/stakingDetail.scss";

.down-icon {
    display: inline-block;
    background: url('~assets/imgs/dividendInfo.svg');
    background-size: 100% 100%;
    width: 16px;
    height: 16px;
    margin-bottom: -4px;
}
</style>
