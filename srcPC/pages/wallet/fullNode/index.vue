<template>
    <div class="full-node-wrapper">
        <fullNodetitle></fullNodetitle>
        <quota-content></quota-content>
        <div class="__second-title">{{ $t('submitStaking')}}</div>
        <add-quota></add-quota>
        <div class="__second-title">{{ $t('walletQuota.list.title') }}</div>
        <list @showCancelConfirm="showCancelConfirm"></list>
        <cancel-stake ref="cancelStakeDom"></cancel-stake>
    </div>
</template>

<script>
import fullNodetitle from './title.vue';
import addQuota from './addQuotaForNode.vue';
import list from './list.vue';
import quotaContent from './quotaContent.vue';
import cancelStake from './cancelStake.vue';

export default {
    components: { fullNodetitle, addQuota, list, quotaContent, cancelStake },
    methods: {
        showCancelConfirm(item) {
            this.$refs.cancelStakeDom.show(item);
        }
    }
};
</script>

<style lang="scss" scoped>
.__second-title {
    margin: 14px 0;
}
.full-node-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
