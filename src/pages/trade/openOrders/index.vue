<template>
    <div class="open-order-ct">
        <Table :list="data" :filterObj="filterObj" :isEmbed="isEmbed"></Table>
    </div>
</template>

<script>
import Table from './table';

// Status Pending=0，PartialExecuted=1，FullyExecuted=2，Cancelled=3
// 0 buy 1 sell
// {
// "date": 12345678, //时间戳
// "fTokenShow": "0.00000000", //交易对fromToken简称
// "tTokenShow": "0.00000000", //交易对toToken简称
// "fToken": "0.00000000", //fromTokenId
// "tToken": "0.00000000", //toTokenId
// "side": 1, //方向
// "price": "0.00000000", //成交价
// "quantity": "0.00000000", //交易数量
// "amount": "0.00000000", //交易总额
// "filledQ": "0.00000000", //已成交数量
// "filledA": "0.00000000", //已成交总额
// "rate": "0.00000000", //成交率
// "average": "0.00000000", //均价
// "fee": "0.00000000", //手续费
// "orderId": "0.00000000", //订单Id
// "status": 1, //Pending=0，PartialExecuted=1，FullyExecuted=2，Cancelled=3
// "type": 1 //Limited=0(限价单),Market=1(市价单)
// }

export default {
    components: { Table },
    data() {
        return { data: [] };
    },
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
    }
};
</script>

<style lang="scss" scoped>
.open-order-ct {
    height: 100%;
    box-sizing: border-box;
    padding: 20px 10px 0px;
}
</style>
