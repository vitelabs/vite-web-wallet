<template>
    <open-table :changeList="changeList" :list="list"></open-table>
</template>

<script>
import { order } from 'services/trade';
import openTable from './openTable.vue';

const pageSize = 30;

export default {
    components: { openTable },
    mounted() {
        this.fetchOpenOrders();
    },
    data() {
        return {
            list: [],
            oldList: {},
            changeList: {}
        };
    },
    computed: {
        currentOpenOrders() {
            return this.$store.state.exchangeCurrentOpenOrders.list;
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        currentMarket() {
            return this.$store.state.exchangeMarket.currentMarket;
        },
        latestOrder() {
            return this.$store.state.exchangeLatestOrder.latestOrder;
        }
    },
    watch: {
        latestOrder() {
            this.$store.commit('exAddOpenOrder', this.latestOrder);
        },
        activeTxPair() {
            this.fetchOpenOrders();
        },
        defaultAddr() {
            this.fetchOpenOrders();
        },
        // [TODO] I don't want to change it, now.
        currentOpenOrders(data) {
            const list = [];
            const newList = {};

            data && data.forEach(_item => {
                newList[_item.orderId] = _item;
            });

            for (const orderId in this.oldList) {
                const _item = this.oldList[orderId];
                if (newList[orderId]) {
                    continue;
                }

                list.push(_item);
                this.changeList[orderId] = this.changeList[orderId] || {};
                this.changeList[orderId].status = 2; // Delete
                this.changeList[orderId].time = new Date().getTime();
                this.changeList[orderId].rawData = _item;
            }

            for (const orderId in newList) {
                list.push(newList[orderId]);

                if (this.oldList[orderId] && +this.oldList[orderId].executedPercent === +newList[orderId].executedPercent) {
                    continue;
                }

                this.changeList[orderId] = this.changeList[orderId] || {};

                if (this.oldList[orderId]) {
                    this.changeList[orderId].status = 0; // Change
                } else {
                    this.changeList[orderId].status = 1; // Add
                }
                this.changeList[orderId].time = new Date().getTime();
                this.changeList[orderId].rawData = newList[orderId];
            }

            for (const orderId in this.changeList) {
                if (newList[orderId] || this.oldList[orderId]) {
                    continue;
                }
                const rawData = this.changeList[orderId].rawData;
                rawData.executedPercent = 1;
                list.push(rawData);
            }

            setTimeout(() => {
                const currentTime = new Date().getTime();
                for (const orderId in this.changeList) {
                    if (currentTime - this.changeList[orderId].time < 2000) {
                        continue;
                    }

                    const item = this.changeList[orderId];
                    if (item.status === 2) {
                        let i;
                        for (i = 0; i < this.list.length; i++) {
                            if (this.list[i].orderId === orderId) {
                                break;
                            }
                        }
                        (i < this.list.length) && this.list.splice(i, 1);
                    }

                    delete this.changeList[orderId];
                }

                this.changeList = Object.assign({}, this.changeList);
            }, 2000);

            this.changeList = Object.assign({}, this.changeList);
            this.oldList = newList;
            this.list = list || [];
        }
    },
    methods: {
        fetchOpenOrders() {
            this.$store.commit('exClearLatestOrder', []);
            const address = this.defaultAddr;
            const currentMarket = this.currentMarket;

            order({
                address,
                offset: 0,
                limit: pageSize,
                status: 1,
                ...this.activeTxPair
            }).then(data => {
                if (this.defaultAddr !== address || currentMarket !== this.currentMarket) {
                    return;
                }
                this.$store.commit('exSetCurrentOpenOrders', data.order || []);
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>
