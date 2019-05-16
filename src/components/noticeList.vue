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
import { subTask } from 'utils/proto/subTask';

let task = null;

export default {
    components: { notice, update },
    destroyed() {
        task && task.stop();
        task = null;
    },
    data() {
        return { latestOrders: [] };
    },
    computed: {
        address() {
            return this.$store.state.wallet.activeAcc ? this.$store.state.wallet.activeAcc.address : '';
        }
    },
    watch: {
        address: function () {
            this.address && this.startLatestOrder();
        }
    },
    methods: {
        startLatestOrder() {
            task && task.stop();
            task = null;

            task = new subTask('latestOrder', ({ args, data }) => {
                // console.log('成交提醒', data);

                if (this.address !== args.address || !data) {
                    return;
                }

                const orderNotice = {
                    time: date(data.date * 1000, 'zh'),
                    ftoken: data.ftokenShow,
                    ttoken: data.ttokenShow,
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
            }, 2000);

            task.start(() => {
                return { address: this.address };
            });
        }
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
