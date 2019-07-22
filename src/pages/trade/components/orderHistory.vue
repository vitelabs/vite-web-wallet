<template>
    <history-table class="tb" :isShowPage="false" :list="historyOrderList"></history-table>
</template>

<script>
import { order } from 'services/trade';
import historyTable from './historyTable.vue';

const pageSize = 30;

export default {
    components: { historyTable },
    data() {
        return { historyOrderList: [] };
    },
    mounted() {
        this.fetchHistory();
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        latestOrder() {
            return this.$store.state.exchangeLatestOrder.latestOrder;
        }
    },
    watch: {
        activeTxPair() {
            this.fetchHistory();
        },
        defaultAddr() {
            this.fetchHistory();
        },
        latestOrder() {
            if (!this.latestOrder
                || this.latestOrder.symbol !== this.activeTxPair.symbol
                || this.latestOrder.address !== this.defaultAddr) {
                return;
            }

            const index = this.historyOrderList.findIndex(v => v.orderId === this.latestOrder.orderId);
            if (index < 0) {
                this.historyOrderList.push(this.latestOrder);
            } else {
                this.historyOrderList[index] = this.latestOrder;
            }

            this.historyOrderList = this.historyOrderList.sort((a, b) => b.createTime - a.createTime);
            this.historyOrderList = this.historyOrderList.slice(0, pageSize);
        }
    },
    methods: {
        fetchHistory() {
            if (!this.activeTxPair) {
                return;
            }

            this.historyOrderList = [];
            const address = this.defaultAddr;
            const symbol = this.activeTxPair.symbol;

            order({
                address,
                offset: 0,
                limit: pageSize,
                ...this.activeTxPair
            }).then(data => {
                if (this.defaultAddr !== address || symbol !== this.activeTxPair.symbol) {
                    return;
                }
                this.historyOrderList = data.order || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>

.tb {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
}
</style>
