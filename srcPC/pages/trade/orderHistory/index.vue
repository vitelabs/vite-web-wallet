<template>
    <div class="order-history-ct">
        <Filters @submit="submit($event)"></Filters>
        <history-table class="tb" :isShowPage="true"
                       :list="data" :currentPage="currentPage" :toPage="update"
                       :totalPage="totalPage"></history-table>
    </div>
</template>

<script>
import { order } from '@services/trade';
import historyTable from '../components/historyTable.vue';
import Filters from '../components/filters.vue';

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
@use "@assets/scss/theme.scss" as *;
.order-history-ct {
    height: 100%;
    padding-top: 10px;
    display: flex;
    flex-direction: column;

    .tb {
        width: 100%;
        flex: 1;
        overflow: auto;
        @include box_shadow();
    }
}
</style>
