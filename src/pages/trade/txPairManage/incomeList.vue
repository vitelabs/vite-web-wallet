<template>
    <confirm class="big no-padding-confirm" :showMask="true"
             :closeIcon="true" :close="close"
             :title="$t('tradeTxPairManage.incomeList')">
        <div class="total-income">
            <div class="total-income-title">{{ $t('tradeTxPairManage.historyAllIncome') }}</div>
            <div class="income">{{ showTotalIncome }}</div>
        </div>
        <wallet-table class="income-list-table"
                      :headList="headList" :contentList="contentList">
            <pagination slot="tableBottom" class="__tb_pagination"
                        :currentPage="currentPage + 1" :toPage="fetchIncomeList"
                        :totalPage="totalPage"></pagination>
        </wallet-table>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination.vue';
import { operatorIncome } from 'services/trade';
import date from 'utils/date';
import BigNumber from 'utils/bigNumber';

export default {
    components: { confirm, walletTable, pagination },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        txPair: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    mounted() {
        this.fetchIncomeList();
    },
    data() {
        return {
            isLoading: false,
            currentPage: 0,
            totalNum: 0,
            totalIncome: '',
            list: []
        };
    },
    computed: {
        showTotalIncome() {
            return this.totalIncome ? BigNumber.onlyFormat(this.totalIncome) : 0;
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.totalNum / 30);
        },
        headList() {
            return [ {
                text: this.$t('tradeTxPairManage.incomeListHead.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeTxPairManage.incomeListHead.txNum'),
                cell: 'tradeQuantity'
            }, {
                text: this.$t('tradeTxPairManage.incomeListHead.feeRate'),
                cell: 'feeRate'
            }, {
                text: this.$t('tradeTxPairManage.incomeListHead.feeIncome'),
                cell: 'income'
            } ];
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    date: date(item.date * 1000, this.$i18n.locale),
                    tradeQuantity: BigNumber.onlyFormat(item.tradeQuantity),
                    feeRate: item.takerFeeRate && item.makerFeeRate ? `Taker(${ (item.takerFeeRate * 100).toFixed(3) }%) / Maker(${ (item.makerFeeRate * 100).toFixed(3) }%)` : '--',
                    income: BigNumber.onlyFormat(item.income)
                });
            });
            return list;
        }
    },
    methods: {
        fetchIncomeList(pageNum) {
            const offset = pageNum ? (pageNum - 1) * 30 : 0;

            operatorIncome({
                operatorId: this.activeAddr,
                tradeToken: this.txPair.txPairDetail.tradeToken,
                quoteToken: this.txPair.txPairDetail.quoteToken,
                offset,
                limit: 30
            }).then(data => {
                this.totalNum = data.total || 0;
                this.totalIncome = data.income || 0;
                this.list = data ? data.incomeList || [] : [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.total-income {
    padding: 14px 30px;
    height: 64px;
    box-sizing: border-box;
    background: rgba(0,122,255,0.05);
    line-height: 18px;
    font-size: 12px;
    .total-income-title {
        @include font-family-normal();
        color: rgba(94,104,117,1);
    }
    .income {
        @include font-family-bold();
        color: rgba(29,32,36,1);
    }
}
</style>

