<template>
    <div class="order-history-ct">
        <Filters @submit="submit($event)"></Filters>
        <Table
            :list="data"
            class="tb"
        ></Table>
        <Pagination></Pagination>
    </div>
</template>
<script>
import Filters from "./filters";
import Table from "./table";
import { order } from "services/exchange";
import Pagination from "components/pagination";
export default {
    components: {
        Filters,
        Table,
        Pagination
    },
    data() {
        return {
            data: [],
            currentIndex:1
        };
    },
    beforeMount() {
        this.update();
    },
    methods: {
        submit(v){
            this.update(v)
        },
        update(filters={}) {
            const account=this.$wallet.getActiveAccount();
            if (!account) return;
            const address=account.getDefaultAddr()
            order({
                address,...filters,pageNum:10,pageIndex:this.currentIndex
            }).then(data => {
                this.data = data;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.order-history-ct {
    height: 100%;
    display: flex;
    padding: 20px 10px 10px;
    flex-direction: column;
    .tb {
        flex: 1;
    }
}
</style>
