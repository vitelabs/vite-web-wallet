<template>
    <div class="trade-mining-section">
        <my-income class="staking-income-wrapper" :miningTotal="`${miningTotal}`"
                   :title="$t('mobileMining.stakingTotalIncome', {token: 'VX'})">
            <is-staking :totalDividend="totalDividend"></is-staking>
        </my-income>
        <list-title></list-title>
        <list-view v-show="content && content.length" class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="pledgeHeadList" :contentList="content"></mining-table>
        </list-view>
        <no-data v-show="!content || !content.length"></no-data>
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
import noData from 'h5Components/noData';

export default {
    components: { noData, myIncome, isStaking, miningTable, listView, listTitle },
    props: {
        totalDividend: {
            type: String,
            default: '0'
        }
    },
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
.staking-income-wrapper {
    background: url('~h5Assets/imgs/big_bg.png') no-repeat;
    background-size: cover;
}
.list-wrapper-view {
    max-height: 450px;
}
</style>
