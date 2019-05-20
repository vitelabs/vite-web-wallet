<template>
    <div class="open-order-ct">
        <Table :list="data" :filterObj="filterObj" :isEmbed="isEmbed"></Table>
    </div>
</template>

<script>
import Table from './table';

export default {
    components: { Table },
    data() {
        return { data: [] };
    },
    props: {
        filterObj: {
            type: Object,
            default: () => {
                return {};
            }
        },
        isEmbed: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss" scoped>
.open-order-ct {
    height: 100%;
    box-sizing: border-box;
    padding: 20px 10px 0px;
}
</style>
