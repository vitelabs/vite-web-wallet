<template>
    <div class="list-wrapper">
        <div class="title">{{ $t('quota.list.title') }}</div>
        <div class="total">{{ $t('quota.list.total', { amount: totalAmount }) }}</div>
        <tabel-list class="" :headList="[{
            class: 'addr __pointer',
            text: $t('quota.list.beneficialAddr'),
            cell: 'addr'
        },{
            class: 'amount',
            text: $t('quota.list.amount'),
            cell: 'showAmount'
        },{
            class: 'height',
            text: $t('quota.list.withdrawHeight'),
            cell: 'withdrawHeight'
        },{
            class: 'time',
            text: $t('quota.list.withdrawTime'),
            cell: 'pledgeDate'
        },{
            class: '__pointer',
            text: $t('quota.list.operate'),
            cell: 'cancel'
        }]" :contentList="pledgeList" :clickCell="clickCell">
            <pagination class="pagination" :currentPage="currentPage + 1" 
                        :totalPage="totalPage" :toPage="toPage"></pagination>
        </tabel-list>
    </div>
</template>

<script>
import userImg from 'assets/imgs/mine.svg';
import pagination from 'components/pagination.vue';
import tabelList from 'components/tabelList.vue';
import date from 'utils/date.js';
import timer from 'utils/asyncFlow';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import toast from 'utils/toast/index.js';
import loopTime from 'loopTime';

let pledgeListInst;

export default {
    components: {
        pagination, tabelList
    },
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
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
        let address = activeAccount.getDefaultAddr();

        return {
            currentPage: 0,
            address,
            activeItem: null,
            loading: false
        };
    },
    computed: {
        totalAmount() {
            return viteWallet.BigNumber.toBasic(this.$store.state.pledge.totalPledgeAmount || 0, this.tokenInfo.decimals);
        },
        totalPage() {
            return this.$store.getters.totalPledgePage;
        },
        pledgeList() {
            let pledgeList = this.$store.getters.pledgeList;
            let currentHeight = viteWallet.Ledger.getHeight() || 0;

            let nowList = [];
            pledgeList.forEach((pledge) => {
                let addrIcon = pledge.beneficialAddr === this.address ? `<img class="beneficial-img" src="${userImg}"/>` : '';
                let addr = `<span class="beneficial-addr">${ ellipsisAddr(pledge.beneficialAddr) }</span>`;

                let isMaturity = viteWallet.BigNumber.compared(pledge.withdrawHeight, currentHeight) <= 0;
                let cancelClass = isMaturity ? 'cancel active' : 'cancel';
                let cancel = `<span class="${cancelClass}">${this.$t('quota.list.cancel')}</span>`;

                let pledgeDate = date(pledge.withdrawTime * 1000, this.$i18n.locale);

                let showAmount = viteWallet.BigNumber.toBasic(pledge.amount || 0, this.tokenInfo.decimals);

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
        },
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
            if (item.isMaturity) {
                this.showCancel(item, index);
                return;
            }
            toast(this.$t('quota.list.unexpired'));
        },
        gotoDetail(addr) {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}account/${addr}`);
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
                toAddr: this.activeItem.beneficialAddr,
                amount
            }, 'getCancel', (result) => {
                this.loading = false;
                this.activeItem = null;
                result && toast(this.$t('quota.canclePledgeSuccess'));
                !result && toast(this.$t('quota.canclePledgeFail'));
            });
        },

        toPage(pageNumber) {
            let pageIndex = pageNumber - 1;
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            this.currentPage = pageIndex;
            this.stopLoopTransList();

            this.fetchPledgeList(this.currentPage, true).then((data)=>{
                data && this.$refs.tableContent && (this.$refs.tableContent.scrollTop = 0);
                this.startLoopPledgeList();
            }).catch(()=>{
                this.startLoopPledgeList();
            });
        },

        startLoopPledgeList() {
            this.stopLoopPledgeList();
            pledgeListInst = new timer(()=>{
                return this.fetchPledgeList(this.currentPage);
            }, loopTime.pledge_getPledgeList);
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

.title {
    font-family: $font-bold;
    font-size: 18px;
    color: #1D2024;
    line-height: 32px;
    margin-bottom: 7px;
}
.total {
    font-size: 14px;
    color: #5E6875;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 14px;
}
</style>

<style lang="scss">
.beneficial-addr {
    font-size: 14px;
    color: #007AFF;
}
.beneficial-img {
    margin-left: 8px;
    margin-bottom: -1px;
}
.addr {
    min-width: 240px;
    width: 25%;
}
.amount {
    width: 17%;
    min-width: 150px;
}
.height {
    min-width: 140px;
    width: 20%;
}
.time {
    min-width: 200px;
    width: 20%;
}
.cancel {
    color: #CED1D5;
    &.active {
        color: #007AFF;
    }
}
</style>
