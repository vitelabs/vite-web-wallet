<template>
    <div class="trade-mining-section">
        <wallet-table
            class="mint-trade-table content tb"
            :headList="tradeHeadList"
            :contentList="content"
        >
            <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="tradeCurrentPage + 1"
                :toPage="fetchMiningTrade"
                :totalPage="tradeTotalPage"
            ></pagination>
        </wallet-table>
    </div>
</template>
<script>
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination';
import { miningTrade } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';


export default {
    components: { walletTable, pagination },
    data() {
        return {
            tradeCurrentPage: 0,
            tradeListTotal: 0,
            tradeList: [],
            tradeHeadList: [
                {
                    text: this.$t('tradeMining.tbHead.date'),
                    cell: 'date'
                },
                {
                    text: this.$t('tradeMining.tbHead.fee'),
                    cell: 'fee'
                },
                {
                    text: this.$t('tradeMining.tbHead.mining'),
                    cell: 'mining'
                }
            ]
        };
    },
    beforeMount() {
        this.fetchMiningTrade();
    },
    watch: {
        address() {
            this.tradeCurrentPage = 0;
            this.tradeListTotal = 0;
            this.tradeList = [];
            this.fetchMiningTrade();
        }
    },
    computed: {
        content() {
            return this.tradeList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, 8) } ${
                        item.miningToken
                    }`,
                    pledge: `${ bigNumber.formatNum(item.pledgeAmount || 0,
                        8) } VITE`,
                    mining: `${ bigNumber.formatNum(item.miningAmount || 0, 8) } VX`
                };
            });
        },
        tradeTotalPage() {
            return Math.ceil(this.tradeListTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        fetchMiningTrade(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            miningTrade({
                address: this.address,
                offset
            })
                .then(data => {
                    if (!data) {
                        return;
                    }

                    this.tradeListTotal = data.total || 0;
                    this.tradeCurrentPage = pageNumber ? pageNumber - 1 : 0;
                    this.tradeList = data.miningList || [];
                })
                .catch(err => {
                    console.warn(err);
                });
        }
    }
};
</script>
