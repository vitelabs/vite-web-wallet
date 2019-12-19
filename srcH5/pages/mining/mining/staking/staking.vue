<template>
    <div class="trade-mining-section">
        <my-income class="staking-income-wrapper" :total="`${miningTotal}`"
                   :title="$t('mobileMining.stakingTotalIncome', {token: 'VX'})">
        </my-income>

        <staking-detail :addStaking="addStaking"></staking-detail>

        <stakeForMining ref="stakeForMining"></stakeForMining>

        <list-title></list-title>

        <list-view v-show="content && content.length" class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="pledgeHeadList" :contentList="content"></mining-table>
        </list-view>
        <no-data v-show="!content || !content.length"></no-data>
    </div>
</template>

<script>
import date from 'utils/date';
import { timer } from 'utils/asyncFlow';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { miningPledge } from 'services/trade';

import noData from 'h5Components/noData';
import listView from 'h5Components/listView.vue';
import myIncome from 'h5Components/myIncome/index';

import miningTable from '../table';
import isStaking from './isStaking';
import listTitle from '../listTitle';
import stakingDetail from './stakingDetail';
import stakeForMining from './stakeForMining';

let stakingInfoTimer = null;

export default {
    components: { noData, myIncome, isStaking, miningTable, listView, listTitle, stakingDetail, stakeForMining },
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
        this.loopStakingInfo();
    },
    destroyed() {
        this.stopStakingInfo();
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
                    pledge: `${ bigNumber.formatNum(item.pledgeAmount || 0, 6) } VITE`,
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
        },
        stakingObj() {
            return this.$store.state.exchangeMine.userPledgeInfo;
        }
    },
    methods: {
        addStaking() {
            statistics.event(`H5${ this.$route.name }`, 'addQuota', this.address || '');
            this.$refs.stakeForMining.show();
        },
        stopStakingInfo() {
            stakingInfoTimer && stakingInfoTimer.stop();
            stakingInfoTimer = null;
        },
        loopStakingInfo() {
            this.stopStakingInfo();
            this.$store.dispatch('getAgentMiningPledgeInfo');
            stakingInfoTimer = new timer(() => this.$store.dispatch('getAgentMiningPledgeInfo'), 2000);
            stakingInfoTimer.start();
        },

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
