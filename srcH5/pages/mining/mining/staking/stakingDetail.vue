<template>
    <my-income class="my-divident" :isShowMiningLink="false"
               :isShowLockLink="false" :isShowCancelling="true"
               :isShowTotal="false" :title="$t('mobileMining.myStaking')">
        <div class="head-detail">
            <div class="item">
                <div class="item-title">{{ $t("stakingAmount") }}</div>
                <div class="bold">{{ totalStakingAmount }}</div>
            </div>
            <div class="item">
                <div class="item-tilte">{{ $t("tradeDividend.unlockAmount") }}</div>
                <div class="bold">{{ cancellingStake }}</div>
            </div>
            <div class="item btn add" @click="addStaking">
                {{ $t("tradeMining.add") }}
            </div>
            <div class="item btn cancel" @click="goTradeMiningList">
                {{ $t("tradeMining.withdrawList") }}
            </div>
        </div>
    </my-income>
</template>

<script>
import myIncome from 'h5Components/myIncome/index';
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { myIncome },
    mounted() {
        this.$store.dispatch('getCurrentPledgeForVxSum');
    },
    props: {
        addStaking: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        stakingObj() {
            return this.$store.state.exchangeMine.userPledgeInfo;
        },
        totalStakingAmount() {
            if (!this.stakingObj) {
                return 0;
            }
            return bigNumber.toBasic(this.stakingObj.totalStakeAmount || 0, Vite_Token_Info.decimals);
        },
        viteBalanceInfo() {
            return this.$store.getters.exViteBalanceInfo;
        },
        cancellingStake() {
            const cancellingStake = this.viteBalanceInfo.cancellingStake || 0;
            return bigNumber.toBasic(cancellingStake, Vite_Token_Info.decimals);
        }
    },
    methods: {
        goTradeMiningList() {
            this.$router.push({ name: 'miningStakingList' });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Components/myIncome/headDetail.scss";

.my-divident {
    background: rgba(0,122,255,0.06);
    margin-top: 14px;
}
</style>
