<template>
    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="(h) in $t('exchangeOpenOrders.table.heads')"
                :key="h"
            >{{h.replace("#tokenSymbol#","vite")}}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="v in list"
                :key="v.orderId"
            >
                <div>{{v.date}}</div>
                <div>{{`${v.ftokenShow}/${v.ttokenShow}`}}</div>
                <!-- //0:buy,1:sell -->
                <div :class="{buy:v.side===0,sell:v.side===1}">{{$t("exchangeOrderHistory.side")[v.side]}}</div>
                <div>{{v.price}}</div>
                <div>{{v.amount}}</div>
                <div>{{v.filledQ}}</div>
                <div>{{v.rate}}</div>
                <div>{{v.average}}</div>
                <div
                    @click="cancel()"
                    class="click-able"
                >{{$t("exchangeOpenOrders.table.rowMap.cancel")}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { order } from 'services/exchange';
export default {
    data() {
        return {
            list:[],
            sortIndex: 0,
            sortType: 1,
            acc:null,
            addr:''
        };
    },
    methods: {
        cancel() {}
    },
    beforeMount() {
        this.acc=this.$wallet.getActiveAccount();
        if(!this.acc)return;
        this.acc&&(this.addr=this.acc.getDefaultAddr());
        order({
            address: this.addr,
            status: 2
        }).then(data => {
            this.list = data.orders;
        });
    },
    computed: {}
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb {
    height: 100%;
    padding-bottom: 10px;
}
@include rowWith {
    width: 8%;
    &:first-child,
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6) {
        width: 15%;
    }
}
.buy {
    color: #ff0008;
}
.sell {
    color: #5bc500;
}
</style>
