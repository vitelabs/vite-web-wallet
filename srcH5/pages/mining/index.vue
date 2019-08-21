<template>
    <div class="m-d-wrapper">
        <select-tab :tabList="tabList" v-model="activeTab"></select-tab>
        <div class="content-wrapper">
            <mining v-show="activeTab === 'mining'"></mining>
            <dividend v-show="activeTab === 'dividend'"></dividend>
        </div>
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
            tabList: [ 'mining', 'dividend' ],
            activeTab: 'mining'
        };
    }
};
</script>

<style lang="scss" scoped>
.m-d-wrapper {
    font-size: 12px;
    .content-wrapper {
        padding: 18px 24px;
    }
}
</style>
