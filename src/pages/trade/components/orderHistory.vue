<template>
    <history-table class="tb" :isShowPage="false" :list="data"></history-table>
</template>

<script>
import { subTask } from 'utils/proto/subTask';
import historyTable from './historyTable.vue';

let task = null;

export default {
    components: { historyTable },
    data() {
        return {
            data: [],
            timer: null
        };
    },
    mounted() {
        this.init();
    },
    destroyed() {
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
            this.init();
        },
        defaultAddr() {
            this.init();
        },
        currentMarket() {
            return this.$store.state.exchangeMarket.currentMarket;
        }
    },
    methods: {
        init() {
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
                // this.data.forEach(ele => {
                //     if (ele.status === 4) {
                //         this.$toast(this.$t('tradeOrderHistory.table.rowMap.statusMap')[4]);
                //     }
                // });
            }, 2000);

            this.activeTxPair && task.start(() => {
                return {
                    symbol: this.currentMarket,
                    address: this.defaultAddr,
                    ...this.activeTxPair
                };
            });
        },
        unsubscribe() {
            task && task.stop();
            task = null;
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
