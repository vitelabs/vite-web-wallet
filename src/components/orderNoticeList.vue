<template>
    <div class="order-notice-list">
        <notice v-for="(order, index) in latestOrders" :key="index"
                :type="order.type" :title="order.title"
                :close="order.close" :rawData="order"
                :describe="order.describe"></notice>
    </div>
</template>

<script>
import notice from 'components/notice';
import date from 'utils/date';

export default {
    components: { notice },
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
            this.updateLatestOrder();
        }
    },
    methods: {
        updateLatestOrder() {
            if (!this.latestOrder || [ 2, 4 ].indexOf(this.latestOrder.status) === -1) {
                return;
            }
            this.addNotice(this.latestOrder);
        },
        addNotice(latestOrder) {
            const type = latestOrder.status === 2 ? 'notice' : 'error';

            const orderNotice = {
                type,
                title: type === 'notice' ? this.$t('dealReminder.title') : this.$t('dealReminder.failTitle'),
                describe: this.$t(`dealReminder.${ type }`, {
                    time: date(latestOrder.createTime * 1000, 'zh'),
                    ftoken: latestOrder.tradeTokenSymbol,
                    ttoken: latestOrder.quoteTokenSymbol
                }),
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
    }
};
</script>

<style lang="scss" scoped>
.order-notice-list {
    transition: all 0.8s ease-in-out;
}
</style>
