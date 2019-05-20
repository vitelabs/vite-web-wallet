<template>
    <div class="ex_tb">
        <div class="head-row">
            <div v-for="h in $t('tradeOrderHistory.table.heads')" :key="h">
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
                }">{{ $t("tradeOrderHistory.side")[v.side] }}</div>
                <div>{{ v.price }} {{ v.ttokenShow }}</div>
                <div>{{ v.quantity }} {{ v.ftokenShow }}</div>
                <div>{{ v.filledQ }} {{v.ftokenShow }}</div>
                <div>{{ `${(v.rate*100).toFixed(2)}%` }}</div>
                <div>{{ v.average }} {{ v.ttokenShow }}</div>
                <div>{{ v.fee }} {{ v.ttokenShow }}</div>
                <div>{{ $t('tradeOrderHistory.table.rowMap.statusMap')[v.status] }}</div>
                <div @click="showDetail(v)" class="click-able">
                    {{ $t("tradeOrderHistory.table.rowMap.detail") }}
                </div>
            </div>
            <div class="no-data" v-show="!sortedList || !sortedList.length">
                <div>{{ $t('hint.noData') }}</div>
            </div>
        </div>
        <slot></slot>
        <confirm v-show="detailConfirm" :list="detailList" :close="close"
                 :title="$t('tradeOrderHistory.confirmTable.title')"
                 :heads="$t('tradeOrderHistory.confirmTable.heads')">
        </confirm>
    </div>
</template>

<script>
import d from 'dayjs';
import { orderDetail } from 'services/trade';
import confirm from '../components/alert';

export default {
    components: { confirm },
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            detailData: [],
            detailConfirm: false
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
        detailList() {
            return Object.keys(this.detailData).map(k => {
                const o = this.detailData[k];
                return [
                    d.unix(o.txTime).format('YYYY-MM-DD HH:mm'),
                    `${ o.price } ${ o.token }`,
                    `${ o.quantity } ${ o.ftokenShow }`,
                    `${ o.fee } ${ o.token }`,
                    `${ o.amount } ${ o.token }`
                ];
            });
        }
    },
    methods: {
        close() {
            this.detailData = [];
            this.detailConfirm = false;
        },
        showDetail(order) {
            orderDetail({
                orderId: order.orderId,
                ftoken: order.ftoken,
                ttoken: order.ttoken,
                pageNo: 1,
                pageSize: 100,
                type: order.side
            }).then(data => {
                this.detailData = data.details.map(v => {
                    v.token = order.ttokenShow;
                    v.ftokenShow = order.ftokenShow;
                    return v;
                });
            });

            this.detailConfirm = true;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../components/table.scss";

@include rowWith {
    width: 8%;

    &:first-child {
        width: 160px;
    }
    &:nth-child(2) {
        width: 180px;
    }

    &:nth-child(4),
    &:nth-child(5),
    &:nth-child(6),
    &:nth-child(8),
    &:nth-child(9) {
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
