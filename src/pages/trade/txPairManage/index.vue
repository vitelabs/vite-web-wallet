<template>
    <div class="tx-pair-manage">
        <sec-title :title="$t('tradeTxPairManage.title', { tokenSymbol })"
                   :isShowHelp="false" :isShowBack="true"></sec-title>

        <wallet-table class="tx-pair-list" :headList="headList" :contentList="showList">
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
                cell: 'status'
            }, { text: this.$t('tradeTxPairManage.operate') } ];
        },
        showList() {
            // [TODO] txPairList
            return [];
        }
    },
    methods: {
        fetchOperatorMarkets(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;
            operatorMarkets({
                operatorId: this.address,
                offset,
                tradeToken: this.tokenId
            }).then(data => {
                console.log(data);
                if (!data) {
                    return;
                }

                this.listTotal = data.total || 0;
                this.currentPage = pageNumber ? pageNumber - 1 : 0;
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
    .tx-pair-list {
        flex: 1;
    }
}
</style>
