/**  vite-wallet login */

<template>
    <div class="order-history-ct">
        <Filters
            @submit="submit($event)"
            v-if="!isEmbed"
        ></Filters>
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
</template>
<script>
import Filters from './filters';
import Table from './table';
import { order } from 'services/exchange';
import Pagination from 'components/pagination';
import { timer } from 'utils/asyncFlow';
const pageSize = 10;
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
    beforeMount() {
        if (this.isEmbed) {
            this.timer = new timer(() => this.update(), 5000);
            this.timer.start();
        }
        this.update();
    },
    beforeDestroy() {
        this.timer && this.timer.stop();
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
    display: flex;
    padding: 20px 10px 10px;
    flex-direction: column;
    .tb {
        flex: 1;
    }
    .page-filter {
        display: flex;
        justify-content: center;
        background: #fff;
    }
}
</style>
