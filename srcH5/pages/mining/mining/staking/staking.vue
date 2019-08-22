<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${miningTotal}`"
                   :title="$t('mobileMining.stakingTotalIncome', {token: 'VX'})">
            <is-staking></is-staking>
        </my-income>
        <list-title></list-title>
        <list-view class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="pledgeHeadList" :contentList="content"></mining-table>
        </list-view>
    </div>
</template>

<script>
import { miningPledge } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import myIncome from '../myIncome';
import isStaking from './isStaking';
import miningTable from '../table';
import listView from 'h5Components/listView.vue';
import listTitle from '../listTitle.vue';

export default {
    components: { myIncome, isStaking, miningTable, listView, listTitle },
    data() {
        return {
            isInit: false,
            miningTotal: 0,
            stakeCurrentPage: 0,
            stakeListTotal: 0,
            stakeList: [],
            pledgeHeadList: [
                {
                    text: this.$t('tradeMining.tbHead.pledge'),
                    cell: 'pledge'
                },
                { cell: 'amount' },
                { cell: 'date' }
            ]
        };
    },
    beforeMount() {
        this.fetchMiningStake();
    },
    watch: {
        address() {
            this.stakeListTotal = 0;
            this.stakeCurrentPage = 0;
            this.stakeList = [];
            this.isInit = false;
            this.fetchMiningStake();
        }
    },
    computed: {
        content() {
            return this.stakeList.map(item => {
                return {
                    pledge: `${ bigNumber.formatNum(item.pledgeAmount || 0, 8) } VITE`,
                    amount: {
                        amount: `${ bigNumber.formatNum(item.miningAmount || 0, 8) }`,
                        token: 'VX'
                    },
                    date: date(item.date * 1000, this.$i18n.locale)
                };
            });
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        reachEnd() {
            this.fetchMiningStake(this.stakeCurrentPage + 1);
        },
        fetchMiningStake(pageNumber) {
            const offset = (pageNumber || 0) * 30;
            if (this.isInit && offset >= this.stakeListTotal) {
                return;
            }

            miningPledge({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.miningTotal = data.miningTotal || 0;
                this.stakeListTotal = data.total || 0;
                this.stakeCurrentPage = pageNumber || 0;
                const list = data.miningList || [];
                this.stakeList = [].concat(this.stakeList, list);
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
