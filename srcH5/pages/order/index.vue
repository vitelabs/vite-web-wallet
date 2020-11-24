<template>
    <div class="order-wrapper __wrapper">
        <select-tab v-if="!hideSelectTab" class="order-select" :tabList="tabList"
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
import getQuery from 'utils/query';

const query = getQuery() || {};

export default {
    components: { selectTab, openOrder, orderHistory },
    beforeMount() {
        this.activeTab = query.activeTab === 'historyOrders' ? query.activeTab : 'openOrders';
        this.hideSelectTab = query.hideSelectTab === 'true';
    },
    data() {
        return {
            tabList: {
                'openOrders': 'tradeOpenOrders.title',
                'historyOrders': 'tradeOrderHistory.title'
            },
            activeTab: 'openOrders',
            hideSelectTab: false
        };
    }
};
</script>

<style lang="scss" scoped>
.order-select {
    margin-top: 10px;
    text-align: center;
    /deep/.select-tab {
        width: 86px;
        &:first-child {
            border-radius: 2px 0px 0px 2px;
        }
        &:last-child {
            border-radius: 0px 2px 2px 0px;
        }
    }
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
