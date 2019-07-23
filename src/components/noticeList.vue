<template>
    <div class="notice-list">
        <update></update>
        <notice v-for="(order, index) in latestOrders" :key="index"
                type="notice" :title="$t('dealReminder.title')"
                :close="order.close" :rawData="order"
                :describe="$t('dealReminder.describe', {
                    time: order.time,
                    ftoken: order.ftoken,
                    ttoken: order.ttoken
        })"></notice>
    </div>
</template>

<script>
import notice from 'components/notice';
import update from 'components/update.vue';
import date from 'utils/date';

export default {
    components: { notice, update },
    data() {
        return { latestOrders: [] };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        latestOrder() {
            return this.$store.state.exchangeLatestOrder.latestOrder;
        }
    },
    watch: {
        address: function () {
            this.address && this.$store.dispatch('exFetchLatestOrder');
        },
        latestOrder: function () {
            // [TODO] notice type
            if (this.latestOrder && this.latestOrder.status === 4) {
                this.$toast(this.$t('tradeOrderHistory.table.rowMap.statusMap')[4]);
            }
            this.updateLatestOrder();
        }
    },
    methods: {
        updateLatestOrder() {
            if (!this.latestOrder || this.latestOrder.status !== 2) {
                return;
            }

            // this.addNotice()
            const orderNotice = {
                time: date(this.latestOrder.createTime * 1000, 'zh'),
                ftoken: this.latestOrder.tradeTokenSymbol,
                ttoken: this.latestOrder.quoteTokenSymbol,
                close: data => {
                    let i;
                    for (i = 0; i < this.latestOrders.length; i++) {
                        if (this.latestOrders[i] === data) {
                            break;
                        }
                    }
                    if (i >= this.latestOrders.length) {
                        return;
                    }

                    data.timeout && clearTimeout(data.timeout);
                    this.latestOrders.splice(i, 1);
                },
                timeout: setTimeout(() => {
                    orderNotice.close(orderNotice);
                }, 4000)
            };
            this.latestOrders.push(orderNotice);
        }
        // addNotice() {
        //     const orderNotice = {
        //         time: date(this.latestOrder.createTime * 1000, 'zh'),
        //         ftoken: this.latestOrder.tradeTokenSymbol,
        //         ttoken: this.latestOrder.quoteTokenSymbol,
        //         close: data => {
        //             let i;
        //             for (i = 0; i < this.latestOrders.length; i++) {
        //                 if (this.latestOrders[i] === data) {
        //                     break;
        //                 }
        //             }
        //             if (i >= this.latestOrders.length) {
        //                 return;
        //             }

        //             data.timeout && clearTimeout(data.timeout);
        //             this.latestOrders.splice(i, 1);
        //         },
        //         timeout: setTimeout(() => {
        //             orderNotice.close(orderNotice);
        //         }, 4000)
        //     };
        //     this.latestOrders.push(orderNotice);
        // }
    }
};
</script>

<style lang="scss" scoped>
.notice-list {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 101;
    max-height: 100%;
    overflow: auto;
    transition: all 0.8s ease-in-out;
}

@media only screen and (max-width: 500px) {
    .notice-list {
        z-index: 0;
    }
}
</style>
