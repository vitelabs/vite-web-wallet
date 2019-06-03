<template>
    <div>
        <!-- <guide></guide> -->
        <layout>
            <center-head slot="lt"></center-head>
            <depth slot="r"></depth>
            <market slot="lb1"></market>
            <center-view slot="lb2"></center-view>
            <latest-tx slot="lb3"></latest-tx>
            <limit-price slot="lb4"></limit-price>
        </layout>
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
// import guide from './guide.vue';

export default {
    components: { layout, depth, market, latestTx, limitPrice, centerHead, centerView },
    mounted() {
        this.$store.dispatch('exFetchActiveTxPair');
    }
};
</script>
