/**  vite-wallet login */

<template>
    <div class="order-history-ct">
        <Filters
            @submit="submit($event)"
            v-if="!isEmbed"
        ></Filters>
        <div class="combine">
            <Table
                :list="data"
                class="tb"
            ></Table>
            <Pagination
                :currentPage="currentPage"
                :toPage="toPage"
                :totalPage="totalPage"
                class="page-filter"
                v-if="!isEmbed"
            ></Pagination>
        </div>
    </div>
</template>
<script>
import Filters from './filters';
import Table from './table';
import { order } from 'services/exchange';
import Pagination from 'components/pagination';
import { timer } from 'utils/asyncFlow';
const pageSize = 35;
let task=null;
export default {
    components: {
        Filters,
        Table,
        Pagination
    },
    props: {
        isEmbed: {
            type: Boolean,
            default: false
        },
        filterObj: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            data: [],
            currentPage: 1,
            totalPage: 0,
            filters: {},
            timer: null
        };
    },
    mounted(){
        this.update();
    },
    activated() {
        if(this.isEmbed){
            task=new timer(()=>this.update(),1000);
            task.start();
        }
    },
    deactivated() {
        task && task.stop();
    },
    watch: {
        filterObj() {
            this.update();
        }
    },
    methods: {
        toPage(pageNo) {
            this.update(Object.assign(this.filters, { pageNo }));
        },
        submit(v) {
            this.filters = v;
            this.update(this.filters);
        },
        currentMarket() {
            return this.$store.state.exchangeMarket.currentMarket;
        },
        update(filters = {}) {
            const account = this.$wallet.getActiveAccount();
            if (!account) return;
            const address = account.getDefaultAddr();
            if (this.isEmbed) {
                filters = { totoken: this.currentMarket };
            }
            filters = Object.assign({ pageNo: this.currentPage }, filters);
            order({
                address,
                ...filters,
                pageSize,
                ...this.filterObj
            }).then(data => {
                this.totalPage = Math.ceil(data.totalSize / pageSize);
                this.data = data.orders || [];
                this.currentPage = filters.pageNo;
            });
        }
    }
};
</script>
<style lang="scss" scoped>
.order-history-ct {
    height: 100%;
    padding: 20px 10px 10px;
    .tb {
        flex: 1;
    }
    .combine {
        box-shadow: 0px 2px 48px 1px rgba(176, 192, 237, 0.42);
    }
    .page-filter {
        display: flex;
        justify-content: center;
        background: #fff;
        padding: 10px 0;
    }
}
</style>
