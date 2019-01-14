<template>
    <layout>
        <depth slot="right"></depth>
        <market slot="leftT"></market>
        <latest-trans slot="leftB"></latest-trans>
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
