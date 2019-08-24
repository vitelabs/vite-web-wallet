<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${miningTotal}`"
                   :title="$t('mobileMining.orderTotalIncome', {token: 'VX'})">
        </my-income>
        <list-title></list-title>
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="headList" :contentList="content"></mining-table>
        </list-view>
    </div>
</template>

<script>
import { getOrderMiningDetail } from 'services/tradeOperation';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import myIncome from './myIncome';
import miningTable from './table';
import listView from 'h5Components/listView.vue';
import listTitle from './listTitle.vue';

export default {
    components: { myIncome, miningTable, listView, listTitle },
    data() {
        return {
            isInit: false,
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
            this.isInit = false;
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
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        reachEnd() {
            this.updateData(this.currentPage + 1);
        },
        updateData(pageNumber) {
            const offset = (pageNumber || 0) * 30;
            if (this.isInit && offset >= this.listTotal) {
                return;
            }

            getOrderMiningDetail({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.miningTotal = data.miningTotal;
                this.listTotal = data.total || 0;
                this.currentPage = pageNumber || 0;
                const list = data.miningList || [];
                this.miningList = [].concat(this.miningList, list);
                this.isInit = true;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.list-wrapper-view {
    max-height: 450px;
}
</style>
