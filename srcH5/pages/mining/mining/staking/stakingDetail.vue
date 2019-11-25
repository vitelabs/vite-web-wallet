<template>
    <div class="head-detail">
        <div class="item">
            <div class="item-title">
                <img src="~h5Assets/imgs/staking_amount.svg" />{{ $t("stakingAmount") }}
            </div>
            <div class="bold">{{ totalStakingAmount }}</div>
        </div>
        <div class="item">
            <div class="item-title">
                <img src="~h5Assets/imgs/small_mine.svg" />{{ $t("tradeMining.dividends") }}
            </div>
            <div class="bold">{{ expectedDividends }}</div>
        </div>
        <div class="item btn add" @click="addStaking">
            {{ $t("tradeMining.add") }}
        </div>
        <div class="item btn cancel" @click="goTradeMiningList">
            {{ $t("tradeMining.withdrawList") }}
        </div>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber';
import { constant } from '@vite/vitejs';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
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
        expectedDividends() {
            return this.$store.getters.stakingDividends;
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
</style>
