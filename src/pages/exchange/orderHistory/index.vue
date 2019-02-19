<template>
    <div class="order-history-ct">
        <Filters></Filters>
        <Table :list="data"></Table>
    </div>
</template>
<script>
import Filters from './filters';
import Table from './table';
import { order } from 'services/exchange';
export default {
    components: {
        Filters,
        Table
    },
    data(){
        return {
            data:[]
        };
    },
    beforeMount() {
        order({
            address: 'vite_272c94c456e72e698616500acd73b7ffd130708d99f05e4880',
            status: 2
        }).then(data => {
            this.data = data;
        });
    }
};
</script>
<style lang="scss" scoped>
.order-history-ct {
    height: 100%;
    overflow: hidden;
    padding: 20px 10px 10px;
}
</style>
