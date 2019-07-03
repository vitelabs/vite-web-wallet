<template>
    <div class="list-wrapper">
        <div class="__second-title">{{ $t('walletQuota.list.title') }}</div>
        <div class="total">{{ $t('walletQuota.list.total', { amount: totalAmount }) }}</div>
        <div class="list">
            <wallet-table class="wallet-quota-table" :headList="[{
                class: 'addr __pointer',
                text: $t('walletQuota.beneficialAddr'),
                cell: 'addr'
            },{
                class: 'amount',
                text: $t('walletQuota.list.amount'),
                cell: 'showAmount'
            },{
                class: 'height',
                text: $t('withdrawHeight'),
                cell: 'withdrawHeight'
            },{
                class: 'time',
                text: $t('walletQuota.list.withdrawTime'),
                cell: 'pledgeDate'
            },{
                class: 'operate __pointer',
                text: $t('action'),
                cell: 'cancel'
            }]" :contentList="pledgeList" :clickCell="clickCell">

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
        </div>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';
import pagination from 'components/pagination.vue';
import walletTable from 'components/table/index.vue';
import { pwdConfirm } from 'components/password/index.js';
import date from 'utils/date.js';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import { StatusMap } from 'wallet';

let pledgeListInst;

export default {
    components: { pagination, walletTable },
    props: {
        tokenInfo: {
            type: Object,
            default: () => {
                return {};
            }
        },
        showConfirm: {
            type: Function,
            default: () => {}
        },
        sendPledgeTx: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.startLoopPledgeList();
    },
    destroyed() {
        this.stopLoopPledgeList();
    },
    data() {
        return {
            currentPage: 0,
            activeItem: null,
            loading: false
        };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        totalAmount() {
            if (!this.tokenInfo) {
                return 0;
            }

            return BigNumber.toBasic(this.$store.state.pledge.totalPledgeAmount || 0, this.tokenInfo.decimals);
        },
        totalPage() {
            return this.$store.getters.totalPledgePage;
        },
        currentHeight() {
            return this.$store.state.ledger.currentHeight || 0;
        },
        pledgeList() {
            if (!this.tokenInfo) {
                return [];
            }

            const pledgeList = this.$store.state.pledge.pledgeList;

            const nowList = [];
            pledgeList.forEach(pledge => {
                const isMaturity = BigNumber.compared(pledge.withdrawHeight, this.currentHeight) <= 0;

                const pledgeDate = isMaturity
                    ? this.$t('walletQuota.maturity')
                    : date(pledge.withdrawTime * 1000, this.$i18n.locale);

                const showAmount = BigNumber.toBasic(pledge.amount || 0, this.tokenInfo.decimals);

                nowList.push({
                    agent: pledge.agent,
                    agentAddress: pledge.agentAddress,
                    bid: pledge.bid,
                    beneficialAddr: pledge.beneficialAddr,
                    withdrawHeight: pledge.withdrawHeight,
                    amount: pledge.amount,
                    pledgeDate,
                    showAddr: ellipsisAddr(pledge.beneficialAddr),
                    showAmount,
                    isMaturity
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
                if (constant.DexFund_Addr === item.agentAddress && +item.bid === 1) {
                    this.$toast(this.$t('walletQuota.list.mining'));
                } else if (constant.DexFund_Addr === item.agentAddress && +item.bid === 2) {
                    this.$toast(this.$t('walletQuota.list.vip'));
                } else {
                    this.$toast(this.$t('walletQuota.list.other'));
                }
                return;
            }

            if (this.isLogin) {
                this.showCancel(item, index);
                return;
            }

            pwdConfirm({ type: 'unlockAccount' });
        },
        gotoDetail(addr) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }account/${ addr }`);
        },
        showCancel(item) {
            if (this.loading) {
                return;
            }
            this.activeItem = item;
            this.showConfirm('cancel', item.amount);
        },

        _sendCancelPledgeTx(amount) {
            this.sendPledgeTx({
                toAddress: this.activeItem.beneficialAddr,
                amount
            }, 'withdrawalOfQuota', (result, err) => {
                this.loading = false;
                this.activeItem = null;
                result && this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
                !result && err && this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
            });
        },

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
            })
                .catch(() => {
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

.list {
    width: 100%;
    overflow: auto;
    background: #fff;
    border: 1px solid #f6f5f5;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
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
