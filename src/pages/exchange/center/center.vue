<template>
    <layout>
        <depth slot="r"></depth>
        <market slot="lb1"></market>
        <latest-trans slot="lb2"></latest-trans>
        <limit-price slot="lb4"></limit-price>
    </layout>
</template>

<script>
import layout from './layout';
import depth from './depth/depth.vue';
import market from './market/market.vue';
import latestTrans from './latestTrans';
import limitPrice from './limitPrice';

export default {
    components: {
        layout, depth, market, latestTrans, limitPrice
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
