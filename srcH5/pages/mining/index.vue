<template>
    <div class="m-d-wrapper">
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
    margin-top: 10px;
}
.m-d-wrapper {
    font-size: 12px;
}
</style>
