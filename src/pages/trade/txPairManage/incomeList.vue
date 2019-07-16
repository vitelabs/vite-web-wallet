<template>
    <confirm class="big" :closeIcon="true"
             :title="$t('tradeTxPairManage.incomeList')">
        <div class="total-income">
            <div class="total-income-title"></div>
            <div class="income">{{ totalIncome }}</div>
        </div>
        <wallet-table>
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
        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.totalNum / 30);
        },
        headList() {
            return [ {
                text: this.$t('tradeDividend.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeDividend.VX'),
                cell: 'vxQuantity'
            }, {
                text: `BTC ${ this.$t('tradeDividend.amount') }`,
                cell: 'BTC'
            }, {
                text: `ETH ${ this.$t('tradeDividend.amount') }`,
                cell: 'ETH'
            }, {
                text: `USD ${ this.$t('tradeDividend.amount') }`,
                cell: 'USD'
            }, {
                text: `VITE ${ this.$t('tradeDividend.amount') }`,
                cell: 'VITE'
            }, {
                text: this.$t('tradeDividend.price'),
                cell: 'price'
            } ];
        }
        // contentList() {
        //     const list = [];

        //     this.list.forEach(item => {
        //         const dividendStat = item.dividendStat || {};

        //         list.push({
        //             date: date(item.date * 1000, this.$i18n.locale),
        //             vxQuantity: bigNumber.formatNum(item.vxQuantity, 4),
        //             ETH: dividendStat.ETH ? this.formatNum(dividendStat.ETH.dividendAmount || 0, 'ETH') : 0,
        //             VITE: dividendStat.VITE ? this.formatNum(dividendStat.VITE.dividendAmount || 0, 'VITE') : 0,
        //             BTC: dividendStat.BTC ? this.formatNum(dividendStat.BTC.dividendAmount || 0, 'BTC') : 0,
        //             USD: dividendStat.USD ? this.formatNum(dividendStat.USD.dividendAmount || 0, 'USD') : 0,
        //             price: this.getPrice(dividendStat)
        //         });
        //     });
        //     return list;
        // }
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
    box-sizing: border-box;
    background: rgba(0,122,255,0.05);
    line-height: 16px;
    .total-income-title {
        font-size: 12px;
        font-family: font-family-normal();
        color: rgba(94,104,117,1);
    }
    .income {
        font-size: 12px;
        font-family: font-family-bold();
        color: rgba(29,32,36,1);
    }
}
</style>

