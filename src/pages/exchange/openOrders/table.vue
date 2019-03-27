<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="(h) in $t('exchangeOpenOrders.table.heads')" :key="h">
                {{ h }}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div class="row" v-for="v in sortedList" :key="v.orderId">
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
        <powProcess ref="pow"></powProcess>
    </div>
</template>

<script>
import d from 'dayjs';
import powProcess from 'components/powProcess';
import { quotaConfirm } from 'components/quota/index';
import { subTask } from 'utils/proto/subTask';
import { order, cancelOrder } from 'services/exchange';

const VoteDifficulty = '201564160';
let task = null;

export default {
    components: { powProcess },
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
            timer: null
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

                this.list = data || [];
            });

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
                const code = e && e.error ? e.error.code || -1 : e ? e.code : -1;

                if (code !== -35002) {
                    this.$toast(this.$t('exchangeOpenOrders.confirm.failToast'), e);
                    return;
                }

                const startTime = new Date().getTime();

                quotaConfirm(true, {
                    rightBtnClick: () => {
                        this.$refs.pow
                            .startPowTx(e.accountBlock, startTime, VoteDifficulty)
                            .then(successSubmit)
                            .catch(failSubmit);
                    }
                });
            };

            const successSubmit = () => {
                this.$toast(this.$t('exchangeOpenOrders.confirm.successToast'));
            };

            this.acc.initPwd({
                submitTxt: this.$t('exchangeOpenOrders.confirm.submitTxt'),
                cancelTxt: this.$t('exchangeOpenOrders.confirm.cancelTxt'),
                submit: () => {
                    cancelOrder({
                        orderId: order.orderId,
                        tradeToken: order.ftoken,
                        side: order.side,
                        quoteToken: order.ttoken
                    }).then(successSubmit).catch(e => {
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
