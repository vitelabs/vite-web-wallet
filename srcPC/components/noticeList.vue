<template>
    <div class="notice-list">
        <update></update>
        <order-notice-list></order-notice-list>
    </div>
</template>

<script>
import update from 'pcComponents/update.vue';
import orderNoticeList from 'components/orderNoticeList.vue';

export default { components: { update, orderNoticeList } };
</script>

<style lang="scss" scoped>
.notice-list {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 101;
    max-height: 100%;
    overflow: auto;
    transition: all 0.8s ease-in-out;
}

@media only screen and (max-width: 500px) {
    .notice-list {
        z-index: 0;
    }
}
</style>
