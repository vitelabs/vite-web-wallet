<template>
    <div class="m-d-wrapper __wrapper">
        <select-tab class="mining-select" :tabList="tabList" :defaultTab="defaultTab"
                    v-model="activeTab"></select-tab>
        <mining v-show="activeTab === 'mining'" :activeTab="miningTab"></mining>
        <dividend v-show="activeTab === 'dividend'"></dividend>
    </div>
</template>

<script>
import selectTab from 'h5Components/selectTab';
import mining from './mining/mining';
import dividend from './dividend/dividend';
import getQuery from 'utils/query';

const query = getQuery() || {};

export default {
    components: { mining, dividend, selectTab },
    beforeMount() {
        const activeTabList = [ 'dividend', 'miningTrade', 'miningStaking', 'miningInvite', 'miningOrder' ];
        if (!query.activeTab || activeTabList.indexOf(query.activeTab) === -1) {
            return;
        }

        this.defaultTab = query.activeTab === 'dividend' ? query.activeTab : 'mining';
        this.activeTab = this.defaultTab;

        if (this.activeTab === 'mining') {
            this.miningTab = query.activeTab;
        }
    },
    data() {
        return {
            tabList: { 'mining': 'mobileMining.title', 'dividend': 'mobileDividend.title' },
            defaultTab: 'mining',
            activeTab: 'mining',
            miningTab: 'miningTrade'
        };
    }
};
</script>

<style lang="scss" scoped>
.mining-select {
    text-align: center;
    margin-top: 10px;
    /deep/.select-tab {
        width: 70px;
        &:first-child {
            border-radius: 2px 0px 0px 2px;
        }
        &:last-child {
            border-radius: 0px 2px 2px 0px;
        }
    }
}
.m-d-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 12px;
}
</style>
