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

const orderStatusMap = {
    1: 'notice-partial',
    2: 'notice-all',
    4: 'error'
};

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
            if (!this.latestOrder || [ 1, 2, 4 ].indexOf(this.latestOrder.status) === -1) {
                return;
            }
            this.addNotice(this.latestOrder);
        },
        addNotice(latestOrder) {
            if (Number(latestOrder.executedAmount) === 0) {
                return;
            }
            const type = orderStatusMap[latestOrder.status];
            let title = '';
            let describe = '';
            if ([1, 2].indexOf(latestOrder.status) > -1) {
                title = this.$t(`dealReminder.title.${latestOrder.side ? 'sell' : 'buy'}`, {
                    ftoken: latestOrder.tradeTokenSymbol,
                    ttoken: latestOrder.quoteTokenSymbol,
                });
                describe = this.$t(`dealReminder.${ type }.${ latestOrder.side ? 'sell' : 'buy' }`, {
                    time: date(latestOrder.createTime * 1000, 'zh'),
                    ftoken: latestOrder.tradeTokenSymbol,
                    ttoken: latestOrder.quoteTokenSymbol,
                    executedPercent: (Number(latestOrder.executedPercent) * 100).toFixed(2),
                    amount: latestOrder.amount,
                    price: latestOrder.price
                });
            } else {
                title = this.$t('dealReminder.failTitle');
                describe = this.$('dealReminder.error', {
                    time: date(latestOrder.createTime * 1000, 'zh'),
                    ftoken: latestOrder.tradeTokenSymbol,
                    ttoken: latestOrder.quoteTokenSymbol,
                    amount: latestOrder.amount,
                });
            }

            const orderNotice = {
                type,
                title,
                describe,
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

            // Desktop only
            if (window.Notification && window.DESKTOP && window.ipcRenderer) {
                const notice =  new Notification(title, {
                    body: describe,
                    requireInteraction: true
                });

                notice.onclick = () => {
                    window.ipcRenderer.send('notificationClick');
                    notice.close();
                };
            } else {
                this.latestOrders.push(orderNotice);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.order-notice-list {
    transition: all 0.8s ease-in-out;
}
</style>
