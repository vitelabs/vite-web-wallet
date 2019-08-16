<template>
    <div class="trade-mining-section">
        <div class="content">
            <div class="quota-detail">
                <div
                    v-if="!stakingObj"
                    @click="_showVxConfirm(1)"
                    class="no-detail __pointer"
                >
                    {{ $t("tradeMining.addQuota") }}
                </div>
                <staking-detail
                    v-else
                    :stakingObj="stakingObj"
                    :showVxConfirm="_showVxConfirm"
                ></staking-detail>
            </div>
            <wallet-table
                class="mint-trade-table tb"
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
        </div>
    </div>
</template>
<script>
import { insertTo } from 'utils/insertTo';
import VxConfirm from './vxConfirm.vue';
import $ViteJS from 'utils/viteClient';
import statistics from 'utils/statistics';
import { execWithValid } from 'utils/execWithValid';
import stakingDetail from './stakingDetail.vue';
import { constant } from '@vite/vitejs';
import { timer } from 'utils/asyncFlow';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination';
import { miningPledge } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';

let stakingInfoTimer = null;

export default {
    components: { walletTable, pagination, stakingDetail },
    data() {
        return {
            stakeCurrentPage: 0,
            stakeTotal: 0,
            stakeListTotal: 0,
            stakeList: [],
            stakingObj: null,
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
        hideVxConfirm() {
            this.vxConfirm
                && this.vxConfirm.destroyInstance()
                && (this.vxConfirm = null);
        },
        _showVxConfirm(actionType) {
            statistics.event(this.$route.name,
                actionType === 1 ? 'addQuota' : 'withdrawQuota',
                this.address || '');
            this.showVxConfirm(actionType);
        },
        showVxConfirm: execWithValid(function (actionType) {
            debugger;
            this.vxConfirm = insertTo(VxConfirm, {
                actionType,
                stakingObj: this.stakingObj,
                close: () => {
                    this.hideVxConfirm();
                }
            });
        }),

        stopStakingInfo() {
            stakingInfoTimer && stakingInfoTimer.stop();
            stakingInfoTimer = null;
        },
        loopStakingInfo() {
            this.stopStakingInfo();
            stakingInfoTimer = new timer(() => this.fetchStakingInfo(), 2000);
            stakingInfoTimer.start();
        },
        fetchStakingInfo() {
            $ViteJS
                .request('pledge_getAgentPledgeInfo', {
                    pledgeAddr: this.address,
                    agentAddr: constant.DexFund_Addr,
                    beneficialAddr: constant.DexFund_Addr,
                    bid: 1
                })
                .then(data => {
                    this.stakingObj = data;
                })
                .catch(err => {
                    console.warn(err);
                });
        },

        fetchMiningStake(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            miningPledge({
                address: this.address,
                offset
            })
                .then(data => {
                    if (!data) {
                        return;
                    }

                    this.stakeListTotal = data.total || 0;
                    this.stakeCurrentPage = pageNumber ? pageNumber - 1 : 0;
                    this.stakeTotal = data.miningTotal
                        ? bigNumber.formatNum(data.miningTotal, 8)
                        : 0;
                    this.stakeList = data.miningList || [];
                })
                .catch(err => {
                    console.warn(err);
                });
        }
    }
};
</script>
