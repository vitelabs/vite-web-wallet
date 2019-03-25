<template>
    <div class="list-wrapper">
        <div class="title">{{ $t('walletQuota.list.title') }}</div>
        <div class="total">{{ $t('walletQuota.list.total', { amount: totalAmount }) }}</div>
        <div class="list">
            <table-list :headList="[{
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
                <pagination class="__tb_pagination" :currentPage="currentPage + 1"
                            :totalPage="totalPage" :toPage="toPage"></pagination>
            </table-list>
        </div>
    </div>
</template>

<script>
import userImg from 'assets/imgs/mine.svg';
import pagination from 'components/pagination.vue';
import tableList from 'components/tableList.vue';
import date from 'utils/date.js';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import ellipsisAddr from 'utils/ellipsisAddr.js';

let pledgeListInst;

export default {
    components: { pagination, tableList },
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
        const activeAccount = this.$wallet.getActiveAccount();
        const address = activeAccount.getDefaultAddr();

        return {
            activeAccount,
            currentPage: 0,
            address,
            activeItem: null,
            loading: false
        };
    },
    computed: {
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

            const pledgeList = this.$store.getters.pledgeList;

            const nowList = [];
            pledgeList.forEach(pledge => {
                const addrIcon = pledge.beneficialAddr === this.address ? `<img class="beneficial-img" src="${ userImg }"/>` : '';
                const addr = `<span class="beneficial-addr">${ ellipsisAddr(pledge.beneficialAddr) }</span>`;

                const isMaturity = BigNumber.compared(pledge.withdrawHeight, this.currentHeight) <= 0;
                const cancelClass = isMaturity ? 'cancel active' : 'cancel';
                const cancel = `<span class="${ cancelClass }">${ this.$t('walletQuota.withdrawalStaking') }</span>`;

                const pledgeDate = isMaturity
                    ? this.$t('walletQuota.maturity')
                    : date(pledge.withdrawTime * 1000, this.$i18n.locale);

                const showAmount = BigNumber.toBasic(pledge.amount || 0, this.tokenInfo.decimals);

                nowList.push({
                    beneficialAddr: pledge.beneficialAddr,
                    withdrawHeight: pledge.withdrawHeight,
                    amount: pledge.amount,
                    isMaturity,
                    pledgeDate,
                    addr: addr + addrIcon,
                    showAmount,
                    cancel
                });
            });

            return nowList;
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

            if (this.$wallet.isLogin) {
                this.showCancel(item, index);
                return;
            }

            const activeAccount = this.$wallet.getActiveAccount();
            activeAccount && activeAccount.unlockAccount();
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
            const amount = BigNumber.toBasic(item.amount || 0, this.tokenInfo.decimals);
            this.showConfirm('cancel', amount);
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

.title {
    font-family: $font-bold, arial, sans-serif;
    font-size: 18px;
    color: #1d2024;
    line-height: 32px;
    margin-bottom: 7px;
}

.total {
    font-size: 14px;
    color: #5e6875;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 14px;
}
</style>

<style lang="scss">
.list-wrapper .list .table-list {
    min-width: 1260px;
}

.beneficial-addr {
    font-size: 14px;
    color: #007aff;
}

.beneficial-img {
    margin-left: 8px;
    margin-bottom: -1px;
}

.addr {
    min-width: 240px;
    width: 25%;
}

.list-wrapper .amount {
    width: 17%;
    min-width: 150px;
}

.height {
    min-width: 185px;
    width: 20%;
}

.time {
    min-width: 200px;
    width: 20%;
}

.operate {
    min-width: 205px;
}

.cancel {
    color: #ced1d5;

    &.active {
        color: #007aff;
    }
}

.operate {
    min-width: 210px;
}
</style>
