<template>
    <tabel-list class="" :headList="[{
        class: 'addr __pointer',
        text: $t('quota.list.beneficialAddr'),
        cell: 'addr'
    },{
        class: 'amount',
        text: $t('quota.list.amount'),
        cell: 'amount'
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
        text: $t('quota.list.cancel'),
        cell: 'cancel'
    }]" :contentList="pledgeList" :clickCell="clickCell">
        <pagination class="pagination" :currentPage="currentPage + 1" 
                    :totalPage="totalPage" :toPage="toPage"></pagination>
    </tabel-list>
</template>

<script>
import userImg from 'assets/imgs/mine.svg';
import pagination from 'components/pagination.vue';
import tabelList from 'components/tabelList.vue';
import date from 'utils/date.js';
import timer from 'utils/asyncFlow';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import loopTime from 'loopTime';

let pledgeListInst;

export default {
    components: {
        pagination, tabelList
    },
    mounted() {
        this.startLoopPledgeList();
    },
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
        let address = activeAccount.getDefaultAddr();

        return {
            currentPage: 0,
            address
        };
    },
    computed: {
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

                nowList.push({
                    beneficialAddr: pledge.beneficialAddr,
                    isMaturity,
                    pledgeDate,
                    addr: addr + addrIcon,
                    withdrawHeight: pledge.withdrawHeight,
                    amount: pledge.amount,
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
            cell === 'cancel' && item.isMaturity && this.cancel(item, index);
        },
        gotoDetail(addr) {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}account/${addr}`);
        },
        cancel(item, index) {
            console.log(item, index);
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
