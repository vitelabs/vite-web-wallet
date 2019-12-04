<template>
    <div class="trade-mining-section shadow">
        <div class="quota-detail">
            <div v-if="!stakingObj" @click="_stake" class="no-detail __pointer">
                {{ $t("tradeMining.addQuota") }}
            </div>
            <staking-detail v-else :showVxConfirm="_stake"></staking-detail>
        </div>
        <wallet-table
            class="mint-trade-table no-shadow tb"
            :headList="pledgeHeadList"
            :contentList="content"
        >
            <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="stakeCurrentPage + 1"
                :toPage="fetchMiningStake"
                :totalPage="stakeTotalPage"
            ></pagination>
        </wallet-table>
        <stakeForMining ref="stakeForMining"></stakeForMining>
    </div>
</template>

<script>
import statistics from 'utils/statistics';
import { execWithValid } from 'pcUtils/execWithValid';
import stakingDetail from './stakingDetail.vue';
import { timer } from 'utils/asyncFlow';
import walletTable from 'pcComponents/table/index.vue';
import pagination from 'pcComponents/pagination';
import { miningPledge } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import stakeForMining from './stakeForMining.vue';

let stakingInfoTimer = null;

export default {
    components: { walletTable, pagination, stakingDetail, stakeForMining },
    data() {
        return {
            stakeCurrentPage: 0,
            stakeListTotal: 0,
            stakeList: [],
            isShowVxConfirm: false,
            vxConfirm: null,
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
        this.loopStakingInfo();
        this.fetchMiningStake();
    },
    destroyed() {
        this.vxConfirm && this.vxConfirm.$destroy() && (this.vxConfirm = null);
        this.stopStakingInfo();
    },
    watch: {
        address() {
            this.stakeListTotal = 0;
            this.stakeCurrentPage = 0;
            this.stakeList = [];
            this.$store.dispatch('getAgentMiningPledgeInfo');
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
        },
        stakingObj() {
            return this.$store.state.exchangeMine.userPledgeInfo;
        }
    },
    methods: {
        _stake() {
            statistics.event(this.$route.name, 'addQuota', this.address || '');
            this.stake();
        },
        stake: execWithValid(function () {
            this.$refs.stakeForMining.show();
        }),

        stopStakingInfo() {
            stakingInfoTimer && stakingInfoTimer.stop();
            stakingInfoTimer = null;
        },
        loopStakingInfo() {
            this.stopStakingInfo();
            stakingInfoTimer = new timer(() => this.$store.dispatch('getAgentMiningPledgeInfo'), 2000);
            stakingInfoTimer.start();
        },

        fetchMiningStake(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            miningPledge({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

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

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.quota-detail {
    box-sizing: border-box;
    .no-detail {
        box-sizing: border-box;
        padding: 16px 30px;
        width: 100%;
        line-height: 48px;
        text-align: center;
        font-size: 16px;
        @include font-family-bold();
        color: rgba(0,122,255,1);
        font-weight: 600;
        &:before {
            content: ' ';
            display: inline-block;
            width: 13px;
            height: 13px;
            background: url('~assets/imgs/addStaking.svg');
            background-size: 100% 100%;
            margin-right: 6px;
            margin-bottom: -1px;
        }
    }
}
</style>
