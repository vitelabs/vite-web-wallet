<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${miningTotal}`"
                   :title="$t('mobileMining.orderTotalIncome', {token: 'VX'})">
        </my-income>
        <mining-table :headList="headList" :contentList="content"></mining-table>

        <!-- <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="currentPage + 1"
                :toPage="updateData"
                :totalPage="taotalPage"
            ></pagination> -->
    </div>
</template>
<script>
import { getOrderMiningDetail } from 'h5Services/tradeOperation';
import pagination from 'components/pagination.vue';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import myIncome from './myIncome';
import miningTable from './table';

export default {
    components: { pagination, myIncome, miningTable },
    data() {
        return {
            miningTotal: 0,
            currentPage: 0,
            listTotal: 0,
            miningList: [],
            headList: [
                {
                    text: this.$t('orderMining.tbHead.ratio'),
                    cell: 'ratio'
                },
                { cell: 'amount' },
                { cell: 'date' }
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
                    ratio: `${ (item.ratio * 100).toFixed(2) }%`,
                    amount: {
                        amount: `${ bigNumber.formatNum(item.miningAmount || 0, 8) }`,
                        token: 'VX'
                    }
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

                    this.miningTotal = data.miningTotal;
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
