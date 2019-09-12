<template>
    <div class="order-history-ct">
        <!-- <Filters @submit="submit($event)"></Filters> -->
        <history-table :isShowPage="true"
                       :list="data" :currentPage="currentPage" :toPage="update"
                       :totalPage="totalPage"></history-table>
    </div>
</template>

<script>
import { order } from 'services/trade';
import historyTable from 'h5Components/historyTable.vue';
import Filters from './filters';

const pageSize = 100;

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
        submit(v) {
            this.filters = v;
            this.update();
        },
        update(pageNo = 1) {
            if (!this.defaultAddr) {
                return;
            }

            order({
                address: this.defaultAddr,
                limit: pageSize,
                total: 1,
                offset: (pageNo - 1) * pageSize,
                ...this.filters
            }).then(data => {
                this.totalPage = Math.ceil(data.total / pageSize);
                this.data = data.order || [];
                this.currentPage = pageNo;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.order-history-ct {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
