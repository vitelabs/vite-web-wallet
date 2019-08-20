<template>
    <div class="token __pointer">
        <tx-pair-info :showDetail="showDetail"></tx-pair-info>
        <detail ref="detailConfirm"></detail>
    </div>
</template>

<script>
import detail from './detail.vue';
import txPairInfo from './txPairInfo.vue';

export default {
    components: { detail, txPairInfo },
    methods: {
        showDetail(tab = 'token') {
            this.$refs.detailConfirm.tab = tab;
        }
    }
};
</script>

<style lang="scss" scoped>
.token {
    width: 100%;
    margin-bottom: 10px;
}
</style>
