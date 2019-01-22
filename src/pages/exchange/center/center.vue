<template>
    <layout>
        <center-head slot="lt"></center-head>
        <depth slot="r"></depth>
        <market slot="lb1"></market>
        <latest-trans slot="lb2"></latest-trans>
        <kline slot="lb3"></kline>
        <limit-price slot="lb4"></limit-price>
    </layout>
</template>

<script>
import layout from './layout';
import depth from './depth/depth.vue';
import market from './market/market.vue';
import latestTrans from './latestTrans';
import limitPrice from './limitPrice';
import centerHead from './head';
import kline from './kline';

export default {
    components: {
        layout, depth, market, latestTrans, limitPrice, centerHead, kline
    },
    created() {

    },
    data() {
        return {

        };
    },
    methods: {

    }
};
</script>

<style lang="scss" scoped>

</style>
