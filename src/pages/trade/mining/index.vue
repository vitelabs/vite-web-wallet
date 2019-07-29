<template>
    <div class="trade-mining-wrapper">
        <h1>{{ $t('tradeMining.comingHint') }}</h1>
        <div class="trade-mining-section">
            <section-title :title="$t('tradeMining.txTitle')" :amount="`${tradeTotal} VX`"></section-title>
            <wallet-table class="mint-trade-table content tb"
                          :headList="tradeHeadList" :contentList="tradeContent">
                <pagination slot="tableBottom" class="__tb_pagination"
                            :currentPage="tradeCurrentPage + 1" :toPage="fetchMiningTrade"
                            :totalPage="tradeTotalPage"></pagination>
            </wallet-table>
        </div>

        <div class="trade-mining-section">
            <section-title :title="$t('tradeMining.quotaTitle')" :amount="`${stakeTotal} VX`"></section-title>
            <div class="content">
                <div class="quota-detail">
                    <div v-if="!stakingObj" @click="showVxConfirm(1)"
                         class="no-detail __pointer">{{ $t('tradeMining.addQuota') }}</div>
                    <staking-detail v-if="stakingObj"
                                    :stakingObj="stakingObj" :showVxConfirm="showVxConfirm"></staking-detail>
                </div>
                <wallet-table class="mint-trade-table tb"
                              :headList="pledgeHeadList" :contentList="stakeContent" >
                    <pagination slot="tableBottom" class="__tb_pagination"
                                :currentPage="stakeCurrentPage + 1" :toPage="fetchMiningStake"
                                :totalPage="stakeTotalPage"></pagination>
                </wallet-table>
            </div>
        </div>
        <div class="trade-mining-section">
            <section-title :title="$t('inviteMining.txTitle')" :amount="`${inviteTotal} VX`"></section-title>
            <wallet-table class="mint-trade-table content tb"
                          :headList="inviteHeadList" :contentList="inviteContent">
                <pagination slot="tableBottom" class="__tb_pagination"
                            :currentPage="inviteCurrentPage + 1" :toPage="fetchMiningInvite"
                            :totalPage="inviteTotalPage"></pagination>
            </wallet-table>
        </div>
        <vx-confirm v-show="isShowVxConfirm" :close="hideVxConfirm"
                    :actionType="actionType" :stakingObj="stakingObj"></vx-confirm>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import date from 'utils/date';
import $ViteJS from 'utils/viteClient';
import { execWithValid } from 'utils/execWithValid';
import pagination from 'components/pagination.vue';
import walletTable from 'components/table/index.vue';
import { miningTrade, miningPledge } from 'services/trade';
import { getInviteMiningDetail } from 'services/tradeOperation';
import sectionTitle from '../components/sectionTitle.vue';
import vxConfirm from './vxConfirm.vue';
import stakingDetail from './stakingDetail.vue';
import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';

let stakingInfoTimer = null;

export default {
    components: { walletTable, pagination, sectionTitle, vxConfirm, stakingDetail },
    mounted() {
        this.init();
    },
    destroyed() {
        this.stopStakingInfo();
    },
    data() {
        return {
            tradeCurrentPage: 0,
            tradeTotal: 0,
            tradeListTotal: 0,
            tradeList: [],

            stakeCurrentPage: 0,
            stakeTotal: 0,
            stakeListTotal: 0,
            stakeList: [],

            inviteCurrentPage: 0,
            inviteTotal: 0,
            inviteListTotal: 0,
            inviteList: [],

            stakingObj: null,
            actionType: null,
            isShowVxConfirm: false,

            tradeHeadList: [ {
                text: this.$t('tradeMining.tbHead.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeMining.tbHead.fee'),
                cell: 'fee'
            }, {
                text: this.$t('tradeMining.tbHead.mining'),
                cell: 'mining'
            } ],
            pledgeHeadList: [ {
                text: this.$t('tradeMining.tbHead.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeMining.tbHead.pledge'),
                cell: 'pledge'
            }, {
                text: this.$t('tradeMining.tbHead.mining'),
                cell: 'mining'
            } ],
            inviteHeadList: [ {
                text: this.$t('tradeMining.tbHead.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeMining.tbHead.fee'),
                cell: 'fee'
            }, {
                text: this.$t('tradeMining.tbHead.mining'),
                cell: 'mining'
            } ]
        };
    },
    computed: {
        tradeContent() {
            return this.dealList(this.tradeList);
        },
        tradeTotalPage() {
            return Math.ceil(this.tradeListTotal / 30);
        },
        inviteContent() {
            return this.dealList(this.inviteList);
        },
        inviteTotalPage() {
            return Math.ceil(this.inviteListTotal / 30);
        },
        stakeContent() {
            return this.dealList(this.stakeList);
        },
        stakeTotalPage() {
            return Math.ceil(this.stakeListTotal / 30);
        },

        address() {
            return this.$store.getters.activeAddr;
        }
    },
    watch: {
        address() {
            this.init();
        }
    },
    methods: {
        init() {
            this.loopStakingInfo();
            this.fetchMiningTrade();
            this.fetchMiningStake();
            this.fetchMiningInvite();
        },
        dealList(rawlist) {
            const list = [];
            rawlist.forEach(item => {
                list.push({
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, 8) } ${ item.miningToken }`,
                    pledge: `${ bigNumber.formatNum(item.pledgeAmount || 0, 8) } VITE`,
                    mining: `${ bigNumber.formatNum(item.miningAmount || 0, 8) } VX`
                });
            });
            return list;
        },

        hideVxConfirm() {
            this.isShowVxConfirm = false;
            this.actionType = null;
        },
        showVxConfirm: execWithValid(function (actionType) {
            this.isShowVxConfirm = true;
            this.actionType = actionType;
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
            $ViteJS.request('pledge_getAgentPledgeInfo', {
                pledgeAddr: this.address,
                agentAddr: constant.DexFund_Addr,
                beneficialAddr: constant.DexFund_Addr,
                bid: 1
            }).then(data => {
                this.stakingObj = data;
            }).catch(err => {
                console.warn(err);
            });
        },
        fetchMiningTrade(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            miningTrade({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.tradeListTotal = data.total || 0;
                this.tradeCurrentPage = pageNumber ? pageNumber - 1 : 0;
                this.tradeTotal = data.miningTotal ? bigNumber.formatNum(data.miningTotal, 8) : 0;
                this.tradeList = data.miningList || [];
            }).catch(err => {
                console.warn(err);
            });
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
                this.stakeTotal = data.miningTotal ? bigNumber.formatNum(data.miningTotal, 8) : 0;
                this.stakeList = data.miningList || [];
            }).catch(err => {
                console.warn(err);
            });
        },
        fetchMiningInvite(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            getInviteMiningDetail({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }
                this.inviteListTotal = data.total || 0;
                this.inviteCurrentPage = pageNumber ? pageNumber - 1 : 0;
                this.inviteTotal = data.miningTotal ? bigNumber.formatNum(data.miningTotal, 8) : 0;
                this.inviteList = data.miningList || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.trade-mining-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.trade-mining-section {
    height: 50%;
    display: flex;
    flex-direction: column;
    min-height: 350px;

    .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
        .quota-detail {
            border-bottom: 1px solid #d4dee7;
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
        .tb {
            flex: 1;
            box-shadow: none;
        }
    }
}
</style>
