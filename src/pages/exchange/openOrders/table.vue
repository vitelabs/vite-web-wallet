<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="(h) in $t('exchangeOpenOrders.table.heads')" :key="h">
                {{ h }}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div class="row" :class="{
                'active': !!changeList[v.orderId]
            }" v-for="v in sortedList" :key="v.orderId">
                <div>{{ v.date|d }}</div>
                <div>{{ `${v.ftokenShow}/${v.ttokenShow}` }}</div>
                <div :class="{
                    'buy': v.side===0,
                    'sell': v.side===1
                }">{{ $t("exchangeOrderHistory.side")[v.side] }}</div>
                <div>{{ v.price + ' ' + v.ttokenShow }}</div>
                <div>{{ v.quantity + ' ' + v.ftokenShow }}</div>
                <div>{{ v.filledQ + ' ' + v.ftokenShow }}</div>
                <div>{{ `${(v.rate*100).toFixed(2)}%` }}</div>
                <div>{{ v.average + ' ' + v.ttokenShow }}</div>
                <div v-unlock-account v-on:unlocked="cancel(v)" class="click-able">
                    {{ $t("exchangeOpenOrders.table.rowMap.cancel") }}
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
import { subTask } from 'utils/proto/subTask';
import { order, cancelOrder } from 'services/exchange';

const VoteDifficulty = '201564160';
let task = null;

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
            list: [],
            sortIndex: 0,
            sortType: 1,
            acc: null,
            addr: '',
            timer: null,
            changeList: {}
        };
    },
    filters: {
        d(v) {
            return d.unix(v).format('YYYY-MM-DD HH:mm');
        }
    },
    computed: {
        sortedList() {
            return this.list.slice(0).sort((a, b) => (b.date - a.date));
        },
        currentMarketNmae() {
            return this.$store.getters.currentMarketName;
        }
    },
    watch: {
        filterObj() {
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
            task = task || new subTask('orderQueryCurrent', ({ args, data }) => {
                const currentAcc = this.$wallet.getActiveAccount();
                const currentAddr = currentAcc ? currentAcc.getDefaultAddr() : '';

                if (args.address !== currentAddr
                    || this.filterObj.ttoken !== args.ttoken
                    || this.filterObj.ftoken !== args.ftoken) {
                    return;
                }

                const oldList = {};
                this.list && this.list.forEach(_item => {
                    oldList[_item.orderId] = {};
                    oldList[_item.orderId].rate = _item.rate;
                });

                data && data.forEach(_item => {
                    const orderId = _item.orderId;
                    if (!oldList[orderId] || oldList[orderId].rate === _item.rate) {
                        return;
                    }

                    this.changeList[orderId] = this.changeList[orderId] || {};
                    this.changeList[orderId].rate = oldList[orderId].rate;
                    this.changeList[orderId].time = new Date().getTime();
                });

                setTimeout(() => {
                    const currentTime = new Date().getTime();
                    for (const key in this.changeList) {
                        console.log(this.changeList[key].time);
                        if (currentTime - this.changeList[key].time >= 2000) {
                            delete this.changeList[key];
                        }
                    }
                    this.changeList = Object.assign({}, this.changeList);
                }, 2000);

                this.changeList = Object.assign({}, this.changeList);
                this.list = data || [];
            }, 2000);

            task.start(() => {
                this.acc = this.$wallet.getActiveAccount();
                this.addr = this.acc ? this.acc.getDefaultAddr() : '';
                return {
                    address: this.addr,
                    ...this.filterObj
                };
            });
        },
        unsubscribe() {
            task && task.stop();
            task = null;
        },
        update() {
            this.acc = this.$wallet.getActiveAccount();
            if (!this.acc) return;
            this.acc && (this.addr = this.acc.getDefaultAddr());

            order({
                address: this.addr,
                status: 1,
                pageNo: 1,
                pageSize: 100,
                ...this.filterObj
            }).then(data => {
                this.list = data.orders || [];
            });
        },
        cancel(order) {
            const failSubmit = e => {
                this.$toast(this.$t('exchangeOpenOrders.confirm.failToast'), e);
            };

            const successSubmit = () => {
                this.$toast(this.$t('exchangeOpenOrders.confirm.successToast'));
            };

            const config = {
                pow: true,
                powConfig: {
                    isShowCancel: false,
                    difficulty: VoteDifficulty
                }
            };

            this.acc.initPwd({
                submitTxt: this.$t('exchangeOpenOrders.confirm.submitTxt'),
                cancelTxt: this.$t('exchangeOpenOrders.confirm.cancelTxt'),
                submit: () => {
                    sendTx(cancelOrder, {
                        orderId: order.orderId,
                        tradeToken: order.ftoken,
                        side: order.side,
                        quoteToken: order.ttoken
                    }, config)
                        .then(successSubmit)
                        .catch(e => {
                            failSubmit(e);
                        });
                }
            });
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
        background: #5bc500;
    }
}

@include rowWith {
    width: 8%;

    &:first-child,
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(8) {
        width: 15%;
    }

    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
        text-align: right;
        justify-content: right;
    }
}

.buy {
    color: #5bc500;
}

.sell {
    color: #ff0008;
}
</style>
