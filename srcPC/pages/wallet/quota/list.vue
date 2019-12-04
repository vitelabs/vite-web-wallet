<template>
    <div class="list-wrapper">
        <div class="__second-title">{{ $t('walletQuota.list.title') }}</div>
        <div class="total">{{ $t('walletQuota.list.total', { amount: totalAmount }) }}</div>
        <wallet-table class="wallet-quota-table" :headList="headList" :contentList="pledgeList" :clickCell="clickCell">
            <div v-for="(item, i) in pledgeList" :key="i"
                 :slot="`${i}addrBefore`">
                <span class="beneficial-addr">{{ item.showAddr }}</span>
                <img v-if="item.beneficialAddr === address" class="beneficial-img" src='~assets/imgs/mine.svg'/>
            </div>

            <span v-for="(item, i) in pledgeList" :key="i"
                  :slot="`${i}cancelBefore`"
                  :class="{
                      'cancel': true,
                      'active': item.isMaturity && !item.agent
            }">{{ $t('walletQuota.withdrawalStaking') }}</span>

            <pagination slot="tableBottom" class="__tb_pagination" :currentPage="currentPage + 1"
                        :totalPage="totalPage" :toPage="toPage"></pagination>
        </wallet-table>

        <cancel-quota-stake ref="cancelQuotaStake"></cancel-quota-stake>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import pagination from 'pcComponents/pagination.vue';
import walletTable from 'pcComponents/table/index.vue';
import date from 'utils/date.js';
import openUrl from 'utils/openUrl';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getExplorerLink } from 'utils/getLink';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import { execWithValid } from 'pcUtils/execWithValid';
import cancelQuotaStake from './cancelQuotaStake.vue';

const Vite_Token_Info = constant.Vite_Token_Info;
let pledgeListInst;

export default {
    components: { pagination, walletTable, cancelQuotaStake },
    mounted() {
        this.$store.dispatch('startLoopHeight');
        this.startLoopPledgeList();
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
        this.stopLoopPledgeList();
    },
    data() {
        return { currentPage: 0 };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        totalAmount() {
            return BigNumber.toBasic(this.$store.state.pledge.totalPledgeAmount || 0, Vite_Token_Info.decimals);
        },
        totalPage() {
            return this.$store.getters.totalPledgePage;
        },
        currentHeight() {
            return this.$store.state.ledger.currentHeight || 0;
        },
        headList() {
            return [ {
                class: 'addr __pointer',
                text: this.$t('walletQuota.beneficialAddr'),
                cell: 'addr'
            }, {
                class: 'amount',
                text: this.$t('walletQuota.list.amount'),
                cell: 'showAmount'
            }, {
                class: 'height',
                text: this.$t('withdrawHeight'),
                cell: 'withdrawHeight'
            }, {
                class: 'time',
                text: this.$t('walletQuota.list.withdrawTime'),
                cell: 'pledgeDate'
            }, {
                class: 'operate __pointer',
                text: this.$t('action'),
                cell: 'cancel'
            } ];
        },
        pledgeList() {
            const pledgeList = this.$store.state.pledge.pledgeList;

            const nowList = [];
            pledgeList.forEach(pledge => {
                const isMaturity = BigNumber.compared(pledge.expirationHeight, this.currentHeight) <= 0;

                const pledgeDate = isMaturity
                    ? this.$t('walletQuota.maturity')
                    : date(pledge.expirationTime * 1000, this.$i18n.locale);

                const showAmount = BigNumber.toBasic(pledge.stakeAmount || 0, Vite_Token_Info.decimals);

                nowList.push({
                    agent: !!pledge.bid,
                    agentAddress: pledge.delegateAddress,
                    bid: pledge.bid,
                    beneficialAddr: pledge.beneficiary,
                    withdrawHeight: pledge.expirationHeight,
                    amount: pledge.stakeAmount,
                    pledgeDate,
                    showAddr: ellipsisAddr(pledge.beneficiary),
                    showAmount,
                    isMaturity,
                    rawData: pledge
                });
            });

            return nowList;
        }
    },
    watch: {
        address() {
            this.startLoopPledgeList();
        }
    },
    methods: {
        clickCell(cell, item, index) {
            if (cell === 'addr') {
                this.gotoDetail(item.beneficialAddr);
                return;
            }

            if (cell !== 'cancel') {
                return;
            }

            if (!item.isMaturity) {
                this.$toast(this.$t('walletQuota.list.unexpired'));
                return;
            }

            if (item.agent) {
                if (constant.DexFund_ContractAddress === item.agentAddress && +item.bid === 1) {
                    this.$toast(this.$t('walletQuota.list.mining'));
                } else if (constant.DexFund_ContractAddress === item.agentAddress && +item.bid === 2) {
                    this.$toast(this.$t('walletQuota.list.vip'));
                } else {
                    this.$toast(this.$t('walletQuota.list.other'));
                }
                return;
            }

            statistics.event(this.$route.name, 'other-withdrawQuota', this.address || '');
            this.showCancel(item, index);
            return;
        },
        gotoDetail(addr) {
            openUrl(`${ getExplorerLink(this.$i18n.locale) }account/${ addr }`);
        },
        showCancel: execWithValid(function (item) {
            this.$refs.cancelQuotaStake.show(item);
        }),

        toPage(pageNumber) {
            const pageIndex = pageNumber - 1;
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            this.currentPage = pageIndex;
            this.stopLoopTransList();

            this.fetchPledgeList(this.currentPage, true).then(data => {
                data && this.$refs.tableContent && (this.$refs.tableContent.scrollTop = 0);
                this.startLoopPledgeList();
            }).catch(() => {
                this.startLoopPledgeList();
            });
        },

        startLoopPledgeList() {
            this.stopLoopPledgeList();
            pledgeListInst = new timer(() => this.fetchPledgeList(this.currentPage), 1000);
            pledgeListInst.start();
        },
        stopLoopPledgeList() {
            pledgeListInst && pledgeListInst.stop();
            pledgeListInst = null;
        },
        fetchPledgeList(pageIndex) {
            return this.$store.dispatch('fetchPledgeList', {
                address: this.address,
                pageIndex
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "~pcAssets/scss/title.scss";

.list-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 300px;
}

.wallet-quota-table {
    flex: 1;
    overflow: auto;
}

.beneficial-addr {
    color: #007aff;
}

.beneficial-img {
    margin-left: 8px;
    margin-bottom: -2px;
    width: 12px;
    height: 12px;
}

.__second-title {
    margin-bottom: 8px;
}

.total {
    font-size: 14px;
    color: #5e6875;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 14px;
    font-weight: 400;
}
</style>
