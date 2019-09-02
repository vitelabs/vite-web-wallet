<template>
    <div class="order-wrapper __wrapper">
        <!-- <select-tab :tabList="tabList" v-model="activeTab"></select-tab> -->
        <div class="content-wrapper">
            <open-order v-show="activeTab === 'openOrders'"></open-order>
        <!-- <order-history v-show="activeTab === 'historyOrders'"></order-history> -->
        </div>
    </div>
</template>

<script>
// import selectTab from 'h5Components/selectTab';
import openOrder from './openOrders';
// import orderHistory from './orderHistory';

export default {
    components: { openOrder },
    data() {
        return {
            tabList: [ 'openOrders', 'historyOrders' ],
            activeTab: 'openOrders'
        };
    }
};
</script>

<style lang="scss" scoped>
.content-wrapper {
    padding: 22px 0px;
}
</style>
