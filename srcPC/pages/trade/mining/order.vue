<template>
    <div class="trade-mining-section">
        <wallet-table
            class="mint-trade-table content tb"
            :headList="headList"
            :contentList="content"
        >
            <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="currentPage + 1"
                :toPage="updateData"
                :totalPage="taotalPage"
            ></pagination>
        </wallet-table>
    </div>
</template>
<script>
import { getOrderMiningDetail } from 'services/trade';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination.vue';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';


export default {
    components: { walletTable, pagination },
    data() {
        return {
            currentPage: 0,
            listTotal: 0,
            miningList: [],
            headList: [
                {
                    text: this.$t('orderMining.tbHead.date'),
                    cell: 'date'
                },
                {
                    text: this.$t('orderMining.tbHead.ratio'),
                    cell: 'ratio'
                },
                {
                    text: this.$t('orderMining.tbHead.mining'),
                    cell: 'mining'
                }
            ]
        };
    },
    beforeMount() {
        this.updateData();
    },
    watch: {
        address() {
            this.listTotal = 0;
            this.currentPage = 0;
            this.miningList = [];
            this.updateData();
        }
    },
    computed: {
        content() {
            return this.miningList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    ratio: `${ bigNumber.multi(item.miningRatio, 100, 2) }%`,
                    mining: `${ bigNumber.formatNum(item.miningAmount || 0, 8) } VX`
                };
            });
        },
        taotalPage() {
            return Math.ceil(this.listTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        updateData(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            getOrderMiningDetail({
                address: this.address,
                offset
            })
                .then(data => {
                    if (!data) {
                        return;
                    }

                    this.listTotal = data.total || 0;
                    this.currentPage = pageNumber ? pageNumber - 1 : 0;
                    this.miningList = data.miningList || [];
                })
                .catch(err => {
                    console.warn(err);
                });
        }
    }
};
</script>
