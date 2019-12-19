<template>
    <div class="trade-mining-wrapper">
        <tab-list :tabList="tabList" :defaultTab="activeTab" v-model="tabName"></tab-list>
        <tradeMinComp class="section" v-if="tabName === 'miningTrade'"></tradeMinComp>
        <stakingMinComp class="section" v-if="tabName === 'miningStaking'"></stakingMinComp>
        <inviteMinComp class="section" v-if="tabName === 'miningInvite'"></inviteMinComp>
        <orderMinComp class="section" v-if="tabName === 'miningOrder'"></orderMinComp>
    </div>
</template>

<script>
import tabList from 'h5Components/tabList.vue';
import inviteMinComp from './invite/invite.vue';
import orderMinComp from './order.vue';
import tradeMinComp from './trade.vue';
import stakingMinComp from './staking/staking.vue';

export default {
    components: { tabList, inviteMinComp, orderMinComp, tradeMinComp, stakingMinComp },
    beforeMount() {
        this.$store.dispatch('getCurrentVxMineInfo');
        this.$store.dispatch('getMinThresholdForTradeAndMining');
    },
    props: {
        activeTab: {
            type: String,
            default: 'miningTrade'
        }
    },
    data() {
        return {
            tabList: {
                'miningTrade': 'mobileMining.miningTrade',
                'miningStaking': 'mobileMining.miningStaking',
                'miningInvite': 'mobileMining.miningInvite',
                'miningOrder': 'mobileMining.miningOrder'
            },
            tabName: this.activeTab
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
