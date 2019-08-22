<template>
    <div class="trade-mining-section">
        <my-income :miningTotal="`${miningTotal}`"
                   :title="$t('mobileMining.stakingTotalIncome', {token: 'VX'})">
            <is-staking></is-staking>
        </my-income>

        <wallet-table
            class="mint-trade-table tb"
            :headList="pledgeHeadList"
            :contentList="content">
            <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="stakeCurrentPage + 1"
                :toPage="fetchMiningStake"
                :totalPage="stakeTotalPage"
            ></pagination>
        </wallet-table>
    </div>
</template>

<script>
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination';
import { miningPledge } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import myIncome from '../myIncome';
import isStaking from './isStaking';

export default {
    components: { walletTable, pagination, myIncome, isStaking },
    data() {
        return {
            miningTotal: 0,
            stakeCurrentPage: 0,
            stakeListTotal: 0,
            stakeList: [],
            pledgeHeadList: [
                {
                    text: this.$t('tradeMining.tbHead.date'),
                    cell: 'date'
                },
                {
                    text: this.$t('tradeMining.tbHead.pledge'),
                    cell: 'pledge'
                },
                {
                    text: this.$t('tradeMining.tbHead.mining'),
                    cell: 'mining'
                }
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
            this.fetchMiningStake();
        }
    },
    computed: {
        content() {
            return this.stakeList.map(item => {
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
        stakeTotalPage() {
            return Math.ceil(this.stakeListTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        fetchMiningStake(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            miningPledge({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.miningTotal = data.miningTotal || 0;
                this.stakeListTotal = data.total || 0;
                this.stakeCurrentPage = pageNumber ? pageNumber - 1 : 0;
                this.stakeList = data.miningList || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>
