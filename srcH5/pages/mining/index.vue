<template>
    <div class="m-d-wrapper __wrapper">
        <select-tab class="mining-select" :tabList="tabList" defaultTab="mining"
                    v-model="activeTab"></select-tab>
        <mining v-show="activeTab === 'mining'"></mining>
        <dividend v-show="activeTab === 'dividend'"></dividend>
    </div>
</template>

<script>
import selectTab from 'h5Components/selectTab';
import mining from './mining/mining';
import dividend from './dividend/dividend';

export default {
    components: { mining, dividend, selectTab },
    data() {
        return {
            tabList: { 'mining': this.$t('mobileMining.title'), 'dividend': this.$t('mobileDividend.title') },
            activeTab: 'mining'
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
