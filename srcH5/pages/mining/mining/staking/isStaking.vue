<template>
    <div class="quota-detail">
        <div v-if="!stakingObj || +!stakingObj.totalStakeCount" @click="addStaking" class="no-detail __pointer">
            {{ $t("tradeMining.addQuota") }}
        </div>
        <div v-else class="amount-detail">
            <div class="item-title">
                <img :src="vxIcon" /> {{ $t('tradeMining.dividends')}}
                <span>{{ expectedDividends || '--' }} VX</span>
            </div>
        </div>
    </div>
</template>

<script>
import vxIcon from 'assets/imgs/vx.png';

export default {
    props: {
        addStaking: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return { vxIcon };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        stakingObj() {
            return this.$store.state.exchangeMine.userPledgeInfo;
        },
        expectedDividends() {
            return this.$store.getters.stakingDividends;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";
@import "~h5Components/myIncome/amountDetail.scss";

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

.amount-detail {
    padding-top: 14px;
    img {
        box-sizing: border-box;
        border-radius: 20px;
        margin-right: 4px;
    }
}
</style>
