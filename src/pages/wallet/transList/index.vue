<template>
    <div class="trans-list-wrapper">
        <sec-title :isShowHelp="false"></sec-title>

        <wallet-table class="wallet-trans-list-table"
                      :headList="[ {
                          class: 'tType',
                          text: this.$t('walletTransList.tType.title'),
                          cell: 'type'
                      }, {
                          class: 'status',
                          text: this.$t('walletTransList.status.title'),
                          cell: 'status'
                      }, {
                          class: 'time',
                          text: this.$t('walletTransList.timestamp'),
                          cell: 'date'
                      }, {
                          class: 'address',
                          text: this.$t('walletTransList.tAddress'),
                          cell: 'transAddr'
                      }, {
                          class: 'sum',
                          text: this.$t('walletTransList.sum'),
                          cell: 'amount'
                      }, {
                          class: 'token',
                          text: 'Token',
                          cell: 'tokenSymbol'
                      } ]"
                      :contentList="transList" :clickRow="goDetail">

            <img v-for="(item, i) in transList" :key="i"
                 :slot="`${i}typeBefore`" class="icon"
                 :src="`${ txImgs[item.txType] ? txImgs[item.txType] : txTransImg }`"/>

            <span v-for="(item, i) in transList" :key="i"
                  :slot="`${i}statusBefore`"
                  :class="{
                      'pink': item.statusNum === 0,
                      'blue': item.statusNum === 1,
                      'green': item.statusNum === 2
            }">{{ item.statusText }}</span>

            <span v-for="(item, i) in transList" :key="i"
                  :slot="`${i}amountBefore`"
                  :class="{
                      'red': item.isSend,
                      'green': !item.isSend
            }">{{ item.showAmount }}</span>

            <pagination slot="tableBottom" class="__tb_pagination" :currentPage="currentPage + 1"
                        :totalPage="+totalPage" :toPage="toPage"></pagination>
        </wallet-table>
    </div>
</template>

<script>
import txQuotaImg from 'assets/imgs/txQuota.svg';
import txRegImg from 'assets/imgs/txReg.svg';
import txRewardImg from 'assets/imgs/txReward.svg';
import txTokenImg from 'assets/imgs/txToken.svg';
import txTransImg from 'assets/imgs/txTrans.svg';
import txVoteImg from 'assets/imgs/txVote.svg';
import txVxImg from 'assets/imgs/txVx.svg';

import pagination from 'components/pagination.vue';
import walletTable from 'components/table/index.vue';
import secTitle from 'components/secTitle';
import date from 'utils/date.js';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import openUrl from 'utils/openUrl.js';

const txImgs = {
    SBPreg: txRegImg,
    UpdateReg: txRegImg,
    RevokeReg: txRegImg,
    RetrieveReward: txRewardImg,
    Voting: txVoteImg,
    RevokeVoting: txVoteImg,
    GetQuota: txQuotaImg,
    WithdrawalOfQuota: txQuotaImg,
    Mintage: txTokenImg,
    MintageIssue: txTokenImg,
    MintageBurn: txTokenImg,
    MintageTransferOwner: txTokenImg,
    MintageChangeTokenType: txTokenImg,
    MintageCancelPledge: txTokenImg,
    DexFundUserDeposit: txVxImg,
    DexFundUserWithdraw: txVxImg,
    DexFundNewOrder: txVxImg,
    DexTradeCancelOrder: txVxImg,
    DexFundNewMarket: txVxImg,
    CreateContractReq: txTransImg,
    TxReq: txTransImg,
    RewardReq: txTransImg,
    TxRes: txTransImg,
    TxResFail: txTransImg,
    SendRefund: txTransImg,
    GenesisReceive: txTransImg
};

let transListInst = null;

export default {
    components: { pagination, walletTable, secTitle },
    mounted() {
        this.currentPage = this.$store.state.transList.currentPage;
        this.startLoopTransList();
    },
    beforeDestroy() {
        this.stopLoopTransList();
    },
    data() {
        return {
            txTransImg,
            txImgs,
            currentPage: this.$store.state.transList.currentPage
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return this.$store.getters.totalPage;
        },
        pageNumber() {
            return `${ this.currentPage + 1 }/${ this.totalPage }`;
        },
        transList() {
            const transList = this.$store.getters.transList;
            // console.log(transList);
            const nowList = [];

            transList.forEach(trans => {
                const txType = trans.rawData.txType || 'TxReq';

                const status = [ 'unconfirmed', 'confirms', 'confirmed' ][trans.status];
                const statusText = this.$t(`walletTransList.status.${ status }`) + (status === 'confirms' ? `(${ trans.confirms })` : '');

                const isZero = BigNumber.isEqual(trans.amount, 0);
                let amount = trans.amount;
                if (amount && !isZero) {
                    amount = trans.isSend ? (`-${ trans.amount }`) : (`+${ trans.amount }`);
                }
                amount = amount || '--';

                nowList.push({
                    txType,
                    type: this.$t(`txType.${ txType }`),
                    date: date(trans.timestamp, this.$i18n.locale),
                    status: '',
                    statusNum: trans.status,
                    statusText,
                    hash: trans.rawData.hash,
                    transAddr: ellipsisAddr(trans.transAddr),
                    smallTransAddr: ellipsisAddr(trans.transAddr, 6),
                    amount: '',
                    showAmount: amount,
                    isSend: trans.isSend,
                    tokenSymbol: trans.tokenSymbol,
                    rawData: trans.rawData
                });
            });

            return nowList;
        }
    },
    watch: {
        address() {
            this.startLoopTransList();
        }
    },
    methods: {
        goDetail(trans) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            openUrl(`${ process.env.viteNet }${ locale }transaction/${ trans.rawData.hash }`);
        },

        toPage(pageNumber) {
            const pageIndex = pageNumber - 1;
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            this.currentPage = pageIndex;
            this.stopLoopTransList();

            this.fetchTransList(this.currentPage, true).then(data => {
                data && this.$refs.tableContent && (this.$refs.tableContent.scrollTop = 0);
                this.startLoopTransList();
            })
                .catch(() => {
                    this.startLoopTransList();
                });
        },

        startLoopTransList() {
            this.stopLoopTransList();
            transListInst = new timer(() => this.fetchTransList(this.currentPage), 2000);
            transListInst.start();
        },
        stopLoopTransList() {
            transListInst && transListInst.stop();
            transListInst = null;
        },

        fetchTransList(pageIndex) {
            return this.$store.dispatch('fetchTransList', {
                address: this.address,
                pageIndex
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.wallet-trans-list-table {
    flex: 1;
}
.trans-list-wrapper {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;

    .pink {
        @include font-family-bold();
        color: #ea60ac;
    }

    .blue {
        @include font-family-bold();
        color: #007aff;
    }

    .green {
        @include font-family-bold();
        color: #5bc500;
    }

    .red {
        @include font-family-bold();
        color: #ff0008;
    }

    .icon {
        margin-right: 6px;
        margin-bottom: -2px;
    }
}
</style>
