<template>
    <div class="order-history-ct">
        <Filters v-if="!isEmbed" @submit="submit($event)"></Filters>
        <Table :list="data" class="tb"></Table>
        <Pagination :currentPage="currentPage" :toPage="toPage"
                    :totalPage="totalPage" class="page-filter"
                    v-if="!isEmbed"></Pagination>
    </div>
</template>

<script>
import Pagination from 'components/pagination';
import { order } from 'services/trade';
import { subTask } from 'utils/proto/subTask';
import Table from './table';
import Filters from './filters';

const pageSize = 35;
let task = null;

export default {
    components: { Filters, Table, Pagination },
    props: {
        isEmbed: {
            type: Boolean,
            default: false
        },
        filterObj: {
            type: Object,
            default: () => {
                return {};
            }
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
            const activeAccount = this.$store.state.wallet.activeAcc;
            return activeAccount ? activeAccount.address : '';
        }
    },
    watch: {
        filterObj() {
            this.init();
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
                if (args.address !== this.defaultAddr
                    || this.filterObj.ttoken !== args.ttoken
                    || this.filterObj.ftoken !== args.ftoken) {
                    return;
                }

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
                    ...this.filterObj
                };
            });
        },
        unsubscribe() {
            task && task.stop();
            task = null;
        },

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
            if (!this.defaultAddr) return;

            if (this.isEmbed) {
                filters = { totoken: this.currentMarket };
            }

            filters = Object.assign({ pageNo: this.currentPage }, filters);

            order({
                address: this.defaultAddr,
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
    padding: 20px 10px 0;
    display: flex;
    flex-direction: column;

    .tb {
        height: 100%;
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
