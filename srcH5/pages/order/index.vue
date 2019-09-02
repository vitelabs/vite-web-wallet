<template>
    <div class="order-wrapper __wrapper">
        <select-tab class="order-select" :tabList="tabList"
                    defaultTab="openOrders" v-model="activeTab"></select-tab>
        <div class="content-wrapper">
            <open-order v-show="activeTab === 'openOrders'"></open-order>
        <!-- <order-history v-show="activeTab === 'historyOrders'"></order-history> -->
        </div>
    </div>
</template>

<script>
import selectTab from 'h5Components/selectTab';
import openOrder from './openOrders';
// import orderHistory from './orderHistory';

export default {
    components: { openOrder, selectTab },
    data() {
        return {
            tabList: { 'openOrders': this.$t('tradeOpenOrders.title') }, // historyOrders
            activeTab: 'openOrders'
        };
    }
};
</script>

<style lang="scss" scoped>
.order-select {
    margin-top: 10px;
    /deep/.select-tab {
        border-radius: 2px;
    }
}
.content-wrapper {
    padding: 22px 0px;
}
</style>
