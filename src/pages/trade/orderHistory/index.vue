<template>
    <div class="order-history-ct">
        <Filters v-if="!isEmbed" @submit="submit($event)"></Filters>
        <Table class="tb" :isShowPage="!isEmbed"
               :list="data" :currentPage="currentPage" :toPage="toPage"
               :totalPage="totalPage"></Table>
    </div>
</template>

<script>
import Pagination from 'components/pagination';
import { order } from 'services/trade';
import { subTask } from 'utils/proto/subTask';
import Table from '../historyTable.vue';
import Filters from './filters';

const pageSize = 35;
let task = null;

export default {
    components: { Filters, Table, Pagination },
    props: {
        isEmbed: {
            type: Boolean,
            default: false
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
    mounted() {
        this.init();
    },
    activated() {
        this.isEmbed && this.subscribe();
    },
    deactivated() {
        this.unsubscribe();
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
        activeTxPair() {
            if (!this.isEmbed) {
                return;
            }
            this.unsubscribe();
            this.subscribe();
        },
        defaultAddr() {
            this.init();
        }
    },
    methods: {
        init() {
            if (!this.isEmbed) {
                this.update();
                return;
            }

            this.unsubscribe();
            this.subscribe();
        },
        subscribe() {
            task = task || new subTask('orderQueryHistory', ({ args, data }) => {
                if (args.address !== this.defaultAddr || this.activeTxPair.symbol !== args.symbol) {
                    return;
                }

                data = data.order || data;

                this.data = data || [];
                this.data.forEach(ele => {
                    if (ele.status === 4) {
                        this.$toast(this.$t('tradeOrderHistory.table.rowMap.statusMap')[4]);
                    }
                });
            }, 2000);

            task.start(() => {
                return {
                    address: this.defaultAddr,
                    ...this.activeTxPair
                };
            });
        },
        unsubscribe() {
            task && task.stop();
            task = null;
        },

        toPage(pageNo) {
            this.update(Object.assign(this.filters, { offset: pageNo }));
        },
        submit(v) {
            this.filters = v;
            this.update(this.filters);
        },
        currentMarket() {
            return this.$store.state.exchangeMarket.currentMarket;
        },
        update(filters = {}) {
            if (!this.defaultAddr) return;

            if (this.isEmbed) {
                filters = { symbol: this.currentMarket };
            }

            filters = Object.assign({ offset: this.currentPage - 1 }, filters);

            order({
                address: this.defaultAddr,
                ...filters,
                limit: pageSize,
                total: 1
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
    padding: 20px 10px 0;
    display: flex;
    flex-direction: column;

    .tb {
        width: 100%;
        flex: 1;
        display: flex;
    }

    .page-filter {
        display: flex;
        justify-content: center;
        background: #fff;
        padding: 10px 0;
        border-top: 1px solid rgba(198,203,212,0.3);
    }
}
</style>
