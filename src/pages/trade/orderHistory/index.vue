<template>
    <div class="order-history-ct">
        <Filters @submit="submit($event)"></Filters>
        <history-table class="tb" :isShowPage="true"
                       :list="data" :currentPage="currentPage" :toPage="toPage"
                       :totalPage="totalPage"></history-table>
    </div>
</template>

<script>
import { order } from 'services/trade';
import historyTable from '../components/historyTable.vue';
import Filters from './filters';

const pageSize = 35;

export default {
    components: { Filters, historyTable },
    data() {
        return {
            data: [],
            currentPage: 1,
            totalPage: 0,
            filters: {}
        };
    },
    mounted() {
        this.update();
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    watch: {
        defaultAddr() {
            this.update();
        }
    },
    methods: {
        toPage(pageNo) {
            this.update(Object.assign(this.filters, { offset: pageNo }));
        },
        submit(v) {
            this.filters = v;
            this.update(this.filters);
        },
        update(filters = {}) {
            if (!this.defaultAddr) {
                return;
            }

            filters = Object.assign({ offset: this.currentPage - 1 }, filters);

            order({
                address: this.defaultAddr,
                limit: pageSize,
                total: 1,
                ...filters
            }).then(data => {
                this.totalPage = Math.ceil(data.total / pageSize);
                this.data = data.order || [];
                this.currentPage = filters.offset + 1;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.order-history-ct {
    height: 100%;
    padding-top: 10px;
    display: flex;
    flex-direction: column;

    .tb {
        width: 100%;
        flex: 1;
        display: flex;
    }
}
</style>
