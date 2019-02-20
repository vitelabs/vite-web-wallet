<template>
    <div class="order-history-ct">
        <Filters @submit="submit($event)" v-if="!isBuiltIn"></Filters>
        <Table
            :list="data"
            class="tb"
        ></Table>
        <Pagination :currentPage="currentPage" :toPage="toPage" :totalPage="totalPage"></Pagination>
    </div>
</template>
<script>
import Filters from './filters';
import Table from './table';
import { order } from 'services/exchange';
import Pagination from 'components/pagination';
const pageSize=10;
export default {
    components: {
        Filters,
        Table,
        Pagination
    },
    props:{
        isBuiltIn:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            data: [],
            currentPage:0,
            totalPage:0
        };
    },
    beforeMount() {
        this.update();
    },
    methods: {
        toPage(){
            this.update(this.filters);
        },
        submit(v){
            this.filters=v;
            this.update(this.filters);
        },
        currentMarket(){
            return this.$store.state.exchangeMarket.currentMarket;
        },
        update(filters={}) {
            const account=this.$wallet.getActiveAccount();
            if (!account) return;
            const address=account.getDefaultAddr();
            if(this.isBuiltIn){
                filters={totoken:this.currentMarket}
            }
            order({
                address,...filters,pageNum:10,pageIndex:this.currentPage
            }).then(data => {
                this.totalPage=Math.ceil(this.data.totalSize/pageSize);
                this.data = data.orders||[];
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
