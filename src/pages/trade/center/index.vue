<template>
    <div class="trade-center-wrapper">
        <!-- <guide></guide> -->

        <layout>
            <center-head slot="lt"></center-head>
            <depth slot="r"></depth>
            <market slot="lb1"></market>
            <center-view slot="lb2"></center-view>
            <latest-tx slot="lb3"></latest-tx>
            <limit-price slot="lb4"></limit-price>
        </layout>

        <order-tab class="order-tab"></order-tab>
    </div>
</template>

<script>
import layout from './layout';
import depth from './depth/depth.vue';
import market from './market/market.vue';
import latestTx from './latestTx';
import limitPrice from './limitPrice/limitPrice.vue';
import centerHead from './head/head.vue';
import centerView from './view/view.vue';
import orderTab from './orderTab';
// import guide from './guide.vue';

export default {
    components: { layout, depth, market, latestTx, limitPrice, centerHead, centerView, orderTab },
    mounted() {
        this.$store.dispatch('exFetchActiveTxPair');
    }
};
</script>

<style lang="scss" scoped>
.trade-center-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
.order-tab {
    min-height: 300px;
}
</style>

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
        background-color: #007aff;
    }
}
</style>
