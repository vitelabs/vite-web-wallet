<template>
    <div class="tx-pair-manage">
        <sec-title :title="$t('tradeTxPairManage.title', { tokenSymbol })"
                   :isShowHelp="false" :isShowBack="true"></sec-title>

        <wallet-table class="tx-pair-manage-table" :headList="headList" :contentList="showList">

            <span v-for="(v, i) in showList" :key="i" :slot="`${i}operateBefore`">
                <span v-show="v.status === 3" class="__pointer click-able">
                    {{ $t('tradeTxPairManage.openTxPair') }}</span>
                <span v-show="v.status === 0" class="__pointer click-able">
                    {{ $t('tradeTxPairManage.historyIncome') }}</span>
                <span v-show="v.status === 1">{{ $t('tradeTxPairManage.stopTrans') }}</span>
                <span v-show="v.status === 2">{{ $t('tradeTxPairManage.resetTrans') }}</span>
                <span v-show="v.status === 1 || v.status === 2" class="__pointer click-able">
                    {{ $t('tradeTxPairManage.changeFee') }}</span>
                <span v-show="v.status === 1 || v.status === 2" class="__pointer click-able">
                    {{ $t('tradeTxPairManage.changeOwner') }}</span>
                <span v-show="v.status === 1 || v.status === 2" class="__pointer click-able">
                    {{ $t('tradeTxPairManage.incomeList') }}</span>
            </span>

            <pagination slot="tableBottom" class="__tb_pagination"
                        :totalPage="totalPage"
                        :toPage="fetchOperatorMarkets"
                        :currentPage="currentPage"></pagination>
        </wallet-table>
    </div>
</template>

<script>
import { operatorMarkets } from 'services/trade';
import pagination from 'components/pagination.vue';
import walletTable from 'components/table/index.vue';
import secTitle from 'components/secTitle.vue';
// import BigNumber from 'utils/bigNumber';

export default {
    components: { pagination, walletTable, secTitle },
    created() {
        this.fetchOperatorMarkets();
    },
    data() {
        return {
            tokenId: this.$route.params.tokenId,
            tokenSymbol: this.$route.params.tokenSymbol,
            txPairList: [],
            listTotal: 0,
            currentPage: 0
        };
    },
    computed: {
        marketList() {
            return this.$store.state.exchangeMarket.marketMap;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.listTotal / 30);
        },
        headList() {
            return [ {
                text: this.$t('tradeTxPairManage.symbol'),
                cell: 'symbol'
            }, {
                text: this.$t('tradeTxPairManage.income'),
                cell: 'income'
            }, {
                text: this.$t('tradeTxPairManage.fee'),
                cell: 'fee'
            }, {
                text: this.$t('tradeTxPairManage.status'),
                cell: 'statusTxt'
            }, {
                text: this.$t('tradeTxPairManage.operate'),
                cell: 'operate'
            } ];
        },
        showList() {
            const list = [];

            this.txPairList.forEach(item => {
                const status = this.getStatus(item);
                list.push({
                    symbol: `${ item.tradeTokenSymbol }/${ item.quoteTokenSymbol }`,
                    income: item.income || '--',
                    fee: item.takerFeeRate && item.makerFeeRate ? `Taker(${ item.takerFeeRate }%) / Maker(${ item.makerFeeRate }%)` : '--',
                    status,
                    statusTxt: this.$t('tradeTxPairManage.statusList')[status],
                    rawData: item
                });
            });

            this.marketList.forEach(item => {
                list.push({
                    symbol: `${ this.tokenSymbol }/${ item.originalSymbol }`,
                    income: '--',
                    fee: '--',
                    status: 3,
                    statusTxt: this.$t('tradeTxPairManage.statusList')[3],
                    rawData: item
                });
            });
            return list;
        }
    },
    methods: {
        getStatus(item) {
            if (item.transferStatus === 1) {
                return 0;
            }
            return item.openStatus + 1;
        },

        fetchOperatorMarkets(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;
            operatorMarkets({
                operatorId: this.address,
                offset,
                tradeToken: this.tokenId
            }).then(data => {
                if (!data) {
                    return;
                }

                this.listTotal = data.total || 0;
                this.currentPage = pageNumber ? pageNumber - 1 : 0;
                // this.txPairList = [
                //     {
                //         'tradeToken': 'xxx',
                //         'quoteToken': 'xxx',
                //         'tradeTokenSymbol': 'BTC-000',
                //         'quoteTokenSymbol': 'BTC-000',
                //         'income': '2.222',
                //         'makerFeeRate': 0.222,
                //         'takerFeeRate': 0.222,
                //         'transferStatus': 1,
                //         'openStatus': 1
                //     }
                // ];
                this.txPairList = data.tradePairList || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tx-pair-manage {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .tx-pair-manage-table {
        flex: 1;
    }
    .click-able {
        margin-right: 20px;
    }
}
</style>
