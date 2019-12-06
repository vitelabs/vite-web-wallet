<template>
    <div class="invite-detail-wrapper">
        <invite-detail></invite-detail>
        <invite-trade class="invite-table"></invite-trade>
        <invite-order></invite-order>
    </div>
</template>

<script>
import inviteDetail from './inviteDetail.vue';
import inviteTrade from './inviteTrade.vue';
import inviteOrder from './inviteOrder.vue';

export default { components: { inviteDetail, inviteTrade, inviteOrder } };
</script>

<style lang="scss" scoped>
.invite-detail-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}
.invite-table {
    margin-bottom: 14px;
}
</style>
