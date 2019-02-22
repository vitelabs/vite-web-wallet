<template>
    <div class="ex_tb">
        <div class="head-row">
            <div
                v-for="h in $t('exchangeOrderHistory.table.heads')"
                :key="h"
            >{{h}}
            </div>
            <div></div>
        </div>
        <div class="row-container">
            <div
                class="row"
                v-for="v in sortedList"
                :key="v.orderId"
            >
                <div>{{new Date(v.date*1000).toLocaleString()}}</div>
                <div>{{`${v.ftokenShow}/${v.ttokenShow}`}}</div>
                <div :class="{buy:v.side===0,sell:v.side===1}">{{$t("exchangeOrderHistory.side")[v.side]}}</div>
                <div>{{v.price}} {{v.ttokenShow}}</div>
                <div>{{v.amount}} {{v.ftokenShow}}</div>
                <div>{{v.filledQ}} {{v.ftokenShow}}</div>
                <div>{{`${(v.rate*100).toFixed(2)}%`}}</div>
                <div>{{v.average}} {{v.ttokenShow}}</div>
                <div>{{v.fee}} {{v.ttokenShow}}</div>
                <div>{{$t('exchangeOrderHistory.table.rowMap.statusMap')[v.status]}}</div>
                <div @click="showDetail(v)"  class="click-able">{{$t("exchangeOrderHistory.table.rowMap.detail")}}</div>
            </div>
        </div>
        <confirm
            v-show="detailConfirm"
            :list="detailList"
            :close="close"
            :heads="$t('exchangeOrderHistory.confirmTable.heads')"
        >

        </confirm>
    </div>
</template>
<script>
import confirm from '../components/alert';
import {orderDetail} from 'services/exchange';
export default {
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    components:{
        confirm
    },
    data() {
        return {
            detailData:[],
            detailConfirm:false
        };
    },
    methods: {
        close(){
            this.detailData=[];
            this.detailConfirm=false;
        },
        showDetail(order){
            orderDetail({orderId:order.orderId,ftoken:order.ftoken,ttoken:order.ttoken,pageNo:1,pageSize:100}).then(data=>{
                this.detailData=data.details.map(v=>{
                    v.token=order.ttokenShow;
                    return v;
                });
            });
            this.detailConfirm=true;
        },
    },
    computed: {
        sortedList(){
            return this.list.slice(0).sort((a,b)=>(b.date-a.date));
        },
        detailList(){
            return Object.keys(this.detailData).map(k=>{
                const o=this.detailData[k];
                return [new Date(o.txTime*1000).toLocaleString(),`${o.price} ${o.token}`,`${o.quantity} ${o.token}`,`${o.fee} ${o.token}`,`${o.amount} ${o.token}`];

            });
        }
    }
};
</script>
<style lang="scss" scoped>
@import "../components/table.scss";
.ex_tb {
    box-shadow: none;
}
@include rowWith {
    width: 8%;
    &:first-child{
        min-width: 160px;
    }
    &:first-child,
    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(8),
    &:nth-child(9) {
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
