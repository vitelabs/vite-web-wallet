<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="(h) in $t('tradeOpenOrders.table.heads')" :key="h">
                {{ h }}
            </div>
            <div>{{ $t('tradeAssets.operate') }}</div>
        </div>
        <div class="row-container">
            <div class="row" :class="{
                'active': !!changeList[v.orderId]
            }" v-for="v in sortedList" :key="v.orderId">
                <div>{{ v.createTime|d }}</div>
                <div>{{ `${v.tradeTokenSymbol}/${v.quoteTokenSymbol}` }}</div>
                <div :class="{
                    'buy': v.side===0,
                    'sell': v.side===1
                }">{{ $t("tradeOrderHistory.side")[v.side] }}</div>
                <div>{{ v.price + ' ' + v.quoteTokenSymbol }}</div>
                <div>{{ v.quantity + ' ' + v.tradeTokenSymbol }}</div>
                <div>{{ v.executedQuantity + ' ' + v.tradeTokenSymbol }}</div>
                <div>{{ `${(v.executedPercent*100).toFixed(2)}%` }}</div>
                <div>{{ v.executedAvgPrice + ' ' + v.quoteTokenSymbol }}</div>
                <div v-unlock-account v-on:unlocked="cancel(v)" class="click-able">
                    {{ $t("tradeOpenOrders.table.rowMap.cancel") }}
                </div>
            </div>
            <div class="no-data" v-show="!sortedList || !sortedList.length">
                <div>{{ $t('hint.noData') }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import d from 'dayjs';
import sendTx from 'utils/sendTx';
import { order } from 'services/trade';
import { initPwd } from 'components/password/index.js';

export default {
    props: {
        filterObj: {
            type: Object,
            default: () => {
                return {};
            }
        },
        isEmbed: {
            type: Boolean,
            default: false
        }
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
    data() {
        return {
            isSubscribe: false,
            sortIndex: 0,
            sortType: 1,
            addr: '',
            timer: null,
            list: [],
            oldList: {},
            changeList: {}
        };
    },
    filters: {
        d(v) {
            return d.unix(v).format('YYYY-MM-DD HH:mm');
        }
    },
    computed: {
        currentOpenOrders() {
            return this.$store.state.exchangeCurrentOpenOrders.list;
        },
        sortedList() {
            return this.list.slice(0).sort((a, b) => (b.date - a.date));
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        filterObj(val, oldVal) {
            if (oldVal.ttoken !== val.ttoken
                || oldVal.ftoken !== val.ftoken) {
                this.list = [];
                this.changeList = {};
                this.oldList = {};
            }
            this.init();
        },
        defaultAddr() {
            this.init();
        },
        currentOpenOrders(data) {
            if (!this.isSubscribe) {
                return;
            }

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
        init() {
            if (!this.isEmbed) {
                this.update();
                return;
            }

            this.unsubscribe();
            this.subscribe();
        },
        subscribe() {
            this.$store.dispatch('startOrderCurrent', this.filterObj);
            this.isSubscribe = true;
        },
        unsubscribe() {
            this.$store.dispatch('stopOrderCurrent', this.filterObj);
            this.isSubscribe = false;
        },
        update() {
            order({
                address: this.defaultAddr,
                status: 1,
                offset: 0,
                limit: 100,
                ...this.filterObj
            }).then(data => {
                this.list = data.order || [];
            });
        },
        cancel(order) {
            const failSubmit = e => {
                this.$toast(this.$t('tradeOpenOrders.confirm.failToast'), e);
            };

            const successSubmit = () => {
                this.$toast(this.$t('tradeOpenOrders.confirm.successToast'));
            };

            initPwd({
                title: this.$t('tradeOpenOrders.confirm.title'),
                content: this.$t('tradeOpenOrders.confirm.content'),
                submitTxt: this.$t('tradeOpenOrders.confirm.submitTxt'),
                cancelTxt: this.$t('tradeOpenOrders.confirm.cancelTxt'),
                submit: () => {
                    sendTx('dexTradeCancelOrder', {
                        orderId: order.orderId,
                        tradeToken: order.tradeToken
                    })
                        .then(successSubmit)
                        .catch(err => {
                            console.log(err);
                            const code = err && err.error ? err.error.code || -1
                                : err ? err.code : -1;
                            if (code === -37008) {
                                this.$toast(`${ this.$t('tradeOpenOrders.cancelErr') }(37008)`);
                                return;
                            }
                            failSubmit(err);
                        });
                }
            }, true);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../components/table.scss";

.ex_tb {
    height: 100%;
}
.row {
    transition: all 0.4s ease-in-out;
    &.active {
        background: rgba(0,122,255,0.07);;
    }
}

@include rowWith {
    width: 8%;

    &:nth-child(2) {
        width: 160px;
    }
    &:first-child {
        width: 130px;
    }
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(8) {
        width: 15%;
    }
}

.buy {
    color: #5bc500;
}

.sell {
    color: #ff0008;
}
</style>
