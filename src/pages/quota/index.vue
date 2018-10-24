<template>
    <div class="quota-wrapper">
        <quota-head></quota-head>
        <div class="content">
            <my-quota></my-quota>
            <pledge-tx></pledge-tx>
        </div>
    </div>
</template>

<script>
import quotaHead from './quotaHead';
import myQuota from './myQuota';
import pledgeTx from './pledgeTx';

export default {
    components: {
        quotaHead, myQuota, pledgeTx
    },
    mounted() {
        console.log('?????????/');
    }
};
</script>

<style lang="scss" scoped>

</style>

