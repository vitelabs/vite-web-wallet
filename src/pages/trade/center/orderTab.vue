<template>
    <div class="order">
        <div class="ex-tab-list">
            <div @click="tap='openOrder'"
                 class="ex-tab active-side __pointer"
                 :class="{'active': tap === 'openOrder'}">
                {{ $t('tradeOpenOrders.title') }}
            </div>
            <div @click="tap='historyOrder'"
                 class="ex-tab active-side __pointer"
                 :class="{'active': tap === 'historyOrder'}">
                {{ $t('tradeOrderHistory.title') }}
            </div>
        </div>
        <openOrder v-show="tap==='openOrder'" class="item order-tab"></openOrder>
        <historyOrder v-show="tap==='historyOrder'" class="item order-tab"></historyOrder>
    </div>
</template>

<script>
import openOrder from '../components/orderOpen.vue';
import historyOrder from '../components/orderHistory.vue';

export default {
    components: { historyOrder, openOrder },
    data() {
        return { tap: 'openOrder' };
    }
};
</script>

<style lang="scss" scoped>
@import "./center.scss";

.order {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    margin-top: 0;
    border-radius: 2px;

    .tap {
        height: 34px;
        display: flex;
        border-bottom: 1px solid rgb(0, 122, 255);
        align-items: flex-end;

        > div {
            font-size: 14px;
            color: #24272b;
            cursor: pointer;
            margin: 0 10px;
            border-radius: 4px 4px 0 0;
            padding: 4px 13px;

            &.active {
                background: rgba(0, 122, 255, 1);
                color: #fff;
            }
        }
    }

    .item {
        flex: 1;
        margin: 0;
        padding: 0;
        overflow: hidden;
    }
}
</style>
