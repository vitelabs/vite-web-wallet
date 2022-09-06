<template>
    <div class="ex_tb">
        <wallet-table class="trade-history-table"
                      :headList="headList" :contentList="showList"
                      :clickCell="clickCell">
            <span v-for="(v, i) in showList" :key="i"
                  :slot="`${i}sideKeyBefore`" :class="{
                      'buy': v.rawData.side === 0,
                      'sell': v.rawData.side === 1
            }">{{ $t("tradeOrderHistory.side")[v.rawData.side] }}</span>

            <pagination v-if="isShowPage" slot="tableBottom" class="__tb_pagination"
                        :currentPage="currentPage" :toPage="toPage"
                        :totalPage="totalPage"></pagination>
        </wallet-table>

        <confirm v-show="detailConfirm" :list="detailList" :close="close"
                 :title="$t('tradeOrderHistory.confirmTable.title')"
                 :heads="$t('tradeOrderHistory.confirmTable.heads')">
        </confirm>
    </div>
</template>

<script>
import d from 'dayjs';
import statistics from 'utils/statistics';
import { orderDetail } from 'services/trade';
import pagination from 'pcComponents/pagination';
import walletTable from 'pcComponents/table/index';
import confirm from './tradeList';

export default {
    components: { confirm, walletTable, pagination },
    props: {
        list: {
            type: Array,
            default: () => []
        },
        isShowPage: {
            type: Boolean,
            default: false
        },
        currentPage: null,
        toPage: null,
        totalPage: null
    },
    data() {
        return {
            detailData: [],
            detailConfirm: false
        };
    },
    computed: {
        sortedList() {
            return this.list.slice(0).sort((a, b) => (b.createTime - a.createTime));
        },
        showList() {
            const list = [];
            this.sortedList.forEach(v => {
                list.push({
                    createTime: this.filterDate(v.createTime),
                    symbol: `${ v.tradeTokenSymbol }/${ v.quoteTokenSymbol }`,
                    price: String(v.type) === '1' ? 'Market Price' : `${ v.price } ${ this.getOriginSymbol(v.quoteTokenSymbol) }`,
                    quantity: `${ v.quantity } ${ this.getOriginSymbol(v.tradeTokenSymbol) }`,
                    executedQuantity: `${ v.executedQuantity } ${ this.getOriginSymbol(v.tradeTokenSymbol) }`,
                    // executedPercent: `${ (v.executedPercent * 100).toFixed(2) }%`,
                    executedAvgPrice: `${ v.executedAvgPrice } ${ this.getOriginSymbol(v.quoteTokenSymbol) }`,
                    fee: `${ v.fee } ${ this.getOriginSymbol(v.quoteTokenSymbol) }`,
                    status: this.$t('tradeOrderHistory.table.rowMap.statusMap')[v.status],
                    amount: `${ v.executedAmount } ${ this.getOriginSymbol(v.quoteTokenSymbol) }`,
                    operate: this.$t('tradeOrderHistory.table.rowMap.detail'),
                    rawData: v
                });
            });
            return list;
        },
        detailList() {
            return Object.keys(this.detailData).map(k => {
                const o = this.detailData[k];
                return [
                    d.unix(o.time).format('YYYY-MM-DD HH:mm'),
                    `${ o.price } ${ this.getOriginSymbol(o.quoteTokenSymbol) }`,
                    `${ o.quantity } ${ this.getOriginSymbol(o.tradeTokenSymbol) }`,
                    `${ o.fee } ${ this.getOriginSymbol(o.quoteTokenSymbol) }`,
                    `${ o.amount } ${ this.getOriginSymbol(o.quoteTokenSymbol) }`
                ];
            });
        },
        headList() {
            const list = [];
            const cellList = [ 'createTime', 'symbol', 'sideKey', 'price',
                'quantity', 'executedQuantity', 'executedAvgPrice',
                'fee', 'amount', 'status', 'operate'
            ];
            for (let i = 0; i < cellList.length; i++) {
                list.push({
                    text: this.$t('tradeOrderHistory.table.heads')[i] || '',
                    cell: cellList[i],
                    cellClass: i === cellList.length - 1 ? 'click-able' : ''
                });
            }
            return list;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getOriginSymbol(symbol) {
            return symbol.split('-')[0];
        },
        clickCell(cell, item) {
            if (cell === 'operate') {
                return this.showDetail(item.rawData);
            }
        },
        filterDate(v) {
            return d.unix(v).format('YYYY-MM-DD HH:mm');
        },
        close() {
            this.detailData = [];
            this.detailConfirm = false;
        },
        showDetail(order) {
            statistics.event(this.$route.name, 'orderHistory-detail', this.address || '');

            orderDetail({
                orderId: order.orderId,
                symbol: order.symbol,
                offset: 0,
                limit: 100
            }).then(data => {
                this.detailData = (data.trade || []).map(v => {
                    v.fee = order.orderId === v.buyerOrderId ? v.buyFee : v.sellFee;
                    return v;
                });
            });

            this.detailConfirm = true;
        }
    }
};
</script>
