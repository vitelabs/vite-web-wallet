<template>
    <div class="quota-wrapper">
        <quota-head></quota-head>
        <div class="content">
            <my-quota class="my-quota __form_border"></my-quota>
            <pledge-tx class="pledge-tx"></pledge-tx>
        </div>
        <list></list>
    </div>
</template>

<script>
import quotaHead from './quotaHead';
import myQuota from './myQuota';
import pledgeTx from './pledgeTx';
import list from './list';
import viteInput from 'components/viteInput';

export default { components: { quotaHead, myQuota, pledgeTx, list, viteInput } };
</script>

<style lang="scss" scoped>
@import "../form.scss";

.quota-wrapper {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 14px;
    .my-quota {
        box-sizing: border-box;
        min-width: 170px;
        margin-right: 10px;
        padding: 22px 30px;
    }
    .pledge-tx {
        flex: 1;
        max-width: 100%;
        box-sizing: border-box;
        padding: 6px 30px 20px 30px;
    }
}
</style>
