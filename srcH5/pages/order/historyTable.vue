<template>
    <div class="__tb">
        <order-item v-for="v in sortedList" :key="v.orderId" :order="v">
            <span class="status">{{ $t('tradeOrderHistory.table.rowMap.statusMap')[v.status] }}</span>
        </order-item>
    </div>
</template>

<script>
import orderItem from 'h5Components/orderItem';

export default {
    components: { orderItem },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        sortedList() {
            return this.list.slice(0).sort((a, b) => (b.createTime - a.createTime));
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.__tb {
    width: 100%;
    height: 100%;
    overflow: auto;
}
.status {
    font-size: 14px;
    @include font-normal();
    color: rgba(62,74,89,0.45);
    line-height: 18px;
}
</style>
