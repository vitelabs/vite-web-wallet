<template>
    <div class="trade-mining-section">
        <my-income :total="`${miningTotal}`"
                   :title="$t('mobileMining.orderTotalIncome', {token: 'VX'})">
            <div class="amount-detail">
                <div class="item-title" v-for="item in typeList" :key="item.name">
                    <img :src="item.h5Icon" /> {{ $t('tradeMining.dividends')}}
                    <span>{{ estimateInfo[item.name] || '--' }}</span>
                </div>
            </div>
        </my-income>
        <list-title></list-title>
        <list-view v-show="content && content.length" class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="headList" :contentList="content"></mining-table>
        </list-view>
        <no-data v-show="!content || !content.length"></no-data>
    </div>
</template>

<script>
import { getOrderMining, getOrderMiningEstimate } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import myIncome from 'h5Components/myIncome/index';
import miningTable from './table';
import listView from 'h5Components/listView.vue';
import listTitle from './listTitle.vue';
import noData from 'h5Components/noData';

export default {
    components: { noData, myIncome, miningTable, listView, listTitle },
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
            ],
            estimateInfo: {}
        };
    },
    beforeMount() {
        this.updateData();
        this.fetchEstimate();
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
        typeList() {
            return this.$store.getters.tokenShowTypeList;
        },
        content() {
            return this.miningList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    ratio: `${ bigNumber.multi(item.miningRatio, 100, 2) }%`,
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

            getOrderMining({
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
        },
        fetchEstimate() {
            this.estimateInfo = {};

            getOrderMiningEstimate({ address: this.address }).then(data => {
                if (!data || !data.orderMiningStat) {
                    return;
                }
                const orderMiningStat = data.orderMiningStat;
                for (const tokenName in orderMiningStat) {
                    const amount = orderMiningStat[tokenName];
                    orderMiningStat[tokenName] = `${ bigNumber.formatNum(amount || 0, 8) } VX`;
                }
                this.estimateInfo = data.orderMiningStat;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Components/myIncome/amountDetail.scss";

.list-wrapper-view {
    max-height: 450px;
}
.item-title {
    margin-top: 14px;
}
</style>
