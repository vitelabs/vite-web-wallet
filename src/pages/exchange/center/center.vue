<template>
    <layout>
        <center-head slot="lt"></center-head>
        <depth slot="r"></depth>
        <market slot="lb1"></market>
        <latest-tx slot="lb2"></latest-tx>
        <center-view slot="lb3"></center-view>
        <limit-price slot="lb4"></limit-price>
    </layout>
</template>

<script>
import layout from './layout';
import depth from './depth/depth.vue';
import market from './market/market.vue';
import latestTx from './latestTx';
import limitPrice from './limitPrice';
import centerHead from './head/head.vue';
import centerView from './view/view.vue';

export default {
    components: {
        layout, depth, market, latestTx, limitPrice, centerHead, centerView
    },
    created() {
        this.$store.dispatch('exFetchActiveTxPair');
    }
};
</script>

<style lang="scss">
.ex-center-loading {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    .dot {
        position: relative;
        top: 50%;
        left: 50%;
        margin-top: -11px;
        margin-left: -17px;
    }
    .dot > div {
        background-color: #007AFF;
    }
}
</style>
