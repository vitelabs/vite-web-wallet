<template>
    <div class="trade-mining-wrapper">
        <tab-list :tabList="tabList" defaultTab="trade" v-model="tabName"></tab-list>
        <tradeMinComp class="section" v-if="tabName === 'trade'"></tradeMinComp>
        <stakingMinComp class="section" v-if="tabName === 'staking'"></stakingMinComp>
        <inviteMinComp class="section" v-if="tabName === 'invite'"></inviteMinComp>
        <orderMinComp class="section" v-if="tabName === 'order'"></orderMinComp>
    </div>
</template>

<script>
import tabList from 'h5Components/tabList.vue';
import inviteMinComp from './invite.vue';
import orderMinComp from './order.vue';
import tradeMinComp from './trade.vue';
import stakingMinComp from './staking/staking.vue';

export default {
    components: { tabList, inviteMinComp, orderMinComp, tradeMinComp, stakingMinComp },
    beforeMount() {
        this.$store.dispatch('getCurrentVxMineInfo');
        this.$store.dispatch('getMinThresholdForTradeAndMining');
    },
    data() {
        return {
            currVxMineInfo: null,
            tabList: {
                'trade': this.$t('mobileMining.miningTrade'),
                'staking': this.$t('mobileMining.miningStaking'),
                'invite': this.$t('mobileMining.miningInvite'),
                'order': this.$t('mobileMining.miningOrder')
            },
            tabName: 'trade'
        };
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.trade-mining-wrapper {
    flex: 1;
    padding: 10px 24px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .section {
        flex: 1;
        display: flex;
        flex-direction: column;
    }
}
</style>
