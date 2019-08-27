<template>
    <div class="trade-mining-section">
        <myIncome :miningTotal="`${miningTotal}`"
                  :title="$t('mobileMining.tradeTotalIncome', {token: 'VX'})">
        </myIncome>
        <list-title></list-title>
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="tradeHeadList" :contentList="content"></mining-table>
        </list-view>
    </div>
</template>

<script>
import walletTable from 'components/table/index.vue';
import { miningTrade } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import myIncome from './myIncome';
import miningTable from './table';
import listView from 'h5Components/listView.vue';
import listTitle from './listTitle.vue';

export default {
    components: { walletTable, myIncome, miningTable, listView, listTitle },
    data() {
        return {
            isInit: false,
            miningTotal: 0,
            tradeCurrentPage: 0,
            tradeListTotal: 0,
            tradeList: [],
            tradeHeadList: [
                {
                    text: this.$t('mobileMining.fee'),
                    cell: 'fee'
                },
                { cell: 'amount' },
                { cell: 'date' }
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
            this.isInit = false;
            this.fetchMiningTrade();
        }
    },
    computed: {
        content() {
            return this.tradeList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, 8) } ${ item.miningToken }`,
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
            this.fetchMiningTrade(this.tradeCurrentPage + 1);
        },
        fetchMiningTrade(pageNumber) {
            const offset = (pageNumber || 0) * 30;
            if (this.isInit && offset >= this.tradeListTotal) {
                return;
            }

            miningTrade({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.miningTotal = data.miningTotal || 0;
                this.tradeListTotal = data.total || 0;
                this.tradeCurrentPage = pageNumber || 0;
                const list = data.miningList || [];
                this.tradeList = [].concat(this.tradeList, list);
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
