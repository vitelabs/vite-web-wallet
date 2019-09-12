<template>
    <div class="order-wrapper __wrapper">
        <select-tab class="order-select" :tabList="tabList"
                    defaultTab="openOrders" v-model="activeTab"></select-tab>
        <div class="content-wrapper">
            <open-order v-show="activeTab === 'openOrders'"></open-order>
            <order-history v-show="activeTab === 'historyOrders'"></order-history>
        </div>
    </div>
</template>

<script>
import selectTab from 'h5Components/selectTab';
import openOrder from './openOrders';
import orderHistory from './orderHistory';

export default {
    components: { selectTab, openOrder, orderHistory },
    data() {
        return {
            tabList: {
                'openOrders': this.$t('tradeOpenOrders.title'),
                'historyOrders': this.$t('tradeOrderHistory.title')
            },
            activeTab: 'openOrders'
        };
    }
};
</script>

<style lang="scss" scoped>
.order-select {
    margin-top: 10px;
    text-align: center;
}
.order-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.content-wrapper {
    flex: 1;
    padding: 22px 0px 5px;
    overflow: auto;
}
</style>
