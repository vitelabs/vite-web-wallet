<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="(h) in $t('exchangeOpenOrders.table.heads')" :key="h">
                {{ h }}
            </div>
        </div>
        <div class="row-container">
            <div class="row" v-for="v in sortedList" :key="v.orderId">
                <div>{{ (new Date(v.date*1000)).toLocaleString() }}</div>
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
import { order, cancelOrder } from 'services/exchange';
import powProcess from 'components/powProcess';
import { timer } from 'utils/asyncFlow';

const VoteDifficulty = '201564160';

export default {
    components: { 
        powProcess 
    },
    props: {
        filterObj: {
            type: Object,
            default: ()=>({})
        },
        isEmbed:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            list: [],
            sortIndex: 0,
            sortType: 1,
            acc: null,
            addr: '',
            timer:null
        };
    },
    methods: {
        update() {
            this.acc = this.$wallet.getActiveAccount();
            if (!this.acc) return;
            this.acc && (this.addr = this.acc.getDefaultAddr());
            order({
                address: this.addr,
                status: 1,
                pageNo:1,
                pageSize:100,
                ...this.filterObj
            }).then(data => {
                this.list = data.orders;
            });
        },
        cancel(order) {
            const failSubmit = e => {
                const code =
                    e && e.error ? e.error.code || -1 : e ? e.code : -1;
                if (code === -35002) {
                    let startTime = new Date().getTime();
                    const powTxt = Object.assign(
                        {},
                        this.$t('quotaConfirmPoW')
                    );
                    powTxt.leftBtn.click = () => {
                        this.$router.push({
                            name: 'walletQuota'
                        });
                    };
                    (powTxt.rightBtn.click = () => {
                        this.$refs.pow
                            .startPowTx(
                                e.accountBlock,
                                startTime,
                                VoteDifficulty
                            )
                            .then(successSubmit)
                            .catch(failSubmit);
                    }),
                    (powTxt.closeBtn = { show: true });
                    this.$confirm(powTxt);
                } else {
                    this.$toast(
                        this.$t('exchangeOpenOrders.confirm.failToast'),
                        e
                    );
                }
            };
            const successSubmit = () => {
                this.$toast(this.$t('exchangeOpenOrders.confirm.successToast'));
            };
            this.acc.initPwd(
                {
                    submitTxt: this.$t('exchangeOpenOrders.confirm.submitTxt'),
                    cancelTxt: this.$t('exchangeOpenOrders.confirm.cancelTxt'),
                    submit: () => {
                        cancelOrder({
                            orderId: order.orderId,
                            tradeToken: order.ftoken,
                            side: order.side,
                            quoteToken: order.ttoken
                        })
                            .then(successSubmit)
                            .catch(e => {
                                failSubmit(e);
                            });
                    }
                },
                true
            );
        }
    },
    beforeMount() {
        this.update();
        if(this.isEmbed){
            this.timer=new timer(()=>this.update(),5000);
            this.timer.start();
        }

    },
    beforeDestroy(){
        this.timer&&this.timer.stop();
    },
    watch: {
        filterObj() {
            this.update();
        }
    },
    computed: {
        sortedList(){
            return this.list.slice(0).sort((a,b)=>(b.date-a.date));
        },
        currentMarketNmae() {
            return this.$store.getters.currentMarketName;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../components/table.scss";

.ex_tb {
    height: 100%;
    margin-bottom: 10px;
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
}
.buy {
    color: #5bc500;
}
.sell {
    color: #ff0008;
}
</style>
