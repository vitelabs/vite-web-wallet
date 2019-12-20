<template>
    <div>
        <fullNodetitle></fullNodetitle>
        <quota-content></quota-content>
        <div class="__second-title">{{ $t('submitStaking')}}</div>
        <add-quota></add-quota>
        <div class="__second-title">{{ $t('walletQuota.list.title') }}</div>
        <list></list>
    </div>
</template>

<script>
import fullNodetitle from './title';
import addQuota from './addQuotaForNode';
import list from './list';
import quotaContent from './quotaContent';

export default { components: { fullNodetitle, addQuota, list, quotaContent } };
</script>

<style lang="scss" scoped>
.__second-title {
    margin: 14px 0;
}
</style>
