<template>
    <div class="depth-wrapper">
        <depth-table :depthData="depthBuy"></depth-table>
        <div class="price"></div>
        <depth-table :depthData="depthSell"></depth-table>
    </div>
</template>

<script>
import depthTable from './depthTable';

export default {
    components: {
        depthTable
    },
    created() {

    },
    data() {
        return {
        };
    },
    computed: {
        depthBuy() {
            return this.$store.state.exchangeDepth.buy;
        },
        depthSell() {
            return this.$store.state.exchangeDepth.sell;
        }
    },
    methods: {

    }
};
</script>

<style lang="scss" scoped>

</style>
