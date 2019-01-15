<template>
    <layout>
        <depth slot="r"></depth>
        <market slot="lb1"></market>
        <latest-trans slot="lb2"></latest-trans>
    </layout>
</template>

<script>
import layout from './layout';
import depth from './depth';
import market from './market';
import latestTrans from './latestTrans';

export default {
    components: {
        layout, depth, market, latestTrans
    },
    created() {
        // ....
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
