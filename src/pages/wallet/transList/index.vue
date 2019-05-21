<template>
    <div class="trans-list-wrapper __wrapper">
        <sec-title class="title" :isShowHelp="false"></sec-title>
        <div class="trans-list-content">
            <table-list class="big-trans" :headList="[{
                class: 'tType',
                text: $t('walletTransList.tType.title'),
                cell: 'type'
            },{
                class: 'status',
                text: $t('walletTransList.status.title'),
                cell: 'status'
            },{
                class: 'time',
                text: $t('walletTransList.timestamp'),
                cell: 'date'
            },{
                class: 'address',
                text: $t('walletTransList.tAddress'),
                cell: 'transAddr'
            },{
                class: 'sum',
                text: $t('walletTransList.sum'),
                cell: 'amount'
            },{
                class: 'token',
                text: 'Token',
                cell: 'tokenSymbol'
            }]" :contentList="transList" :clickRow="goDetail">
                <pagination class="__tb_pagination" :currentPage="currentPage + 1"
                            :totalPage="+totalPage" :toPage="toPage"></pagination>
            </table-list>

            <table-list class="small-trans" :headList="[{
                class: 'tType',
                text: $t('walletTransList.tType.symbol'),
                cell: 'smallType'
            },{
                class: 'address',
                text: $t('walletTransList.tAddress'),
                cell: 'smallTransAddr'
            },{
                class: 'sum',
                text: $t('walletTransList.sum'),
                cell: 'smallAmount'
            }]" :contentList="transList" :clickRow="goDetail">
                <pagination class="__tb_pagination" :currentPage="currentPage + 1"
                            :totalPage="totalPage" :toPage="toPage"></pagination>
            </table-list>
        </div>
    </div>
</template>

<script>
import { constant } from '@vite/vitejs';

import txQuotaImg from 'assets/imgs/txQuota.svg';
import txRegImg from 'assets/imgs/txReg.svg';
import txRewardImg from 'assets/imgs/txReward.svg';
import txTokenImg from 'assets/imgs/txToken.svg';
import txTransImg from 'assets/imgs/txTrans.svg';
import txVoteImg from 'assets/imgs/txVote.svg';
import txVxImg from 'assets/imgs/txVx.svg';

import pagination from 'components/pagination.vue';
import tableList from 'components/tableList.vue';
import secTitle from 'components/secTitle';
import date from 'utils/date.js';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import ellipsisAddr from 'utils/ellipsisAddr.js';

const { BuiltinTxType } = constant;
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
    components: { pagination, tableList, secTitle },
    mounted() {
        this.currentPage = this.$store.state.transList.currentPage;
        this.startLoopTransList();
    },
    data() {
        return { currentPage: this.$store.state.transList.currentPage };
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
            const nowList = [];

            transList.forEach(trans => {
                const txType = !trans.rawData.txType && trans.rawData.txType !== 0 ? txImgs.length - 1 : trans.rawData.txType;
                const type = BuiltinTxType[txType];

                const typeImg = `<img class="icon" src='${ txImgs[type] ? txImgs[type] : txTransImg }'/>`;

                const status = [ 'unconfirmed', 'confirms', 'confirmed' ][trans.status];
                const statusClass = status === 'confirmed' ? 'green'
                    : status === 'unconfirmed' ? 'pink' : 'blue';
                const statusText = this.$t(`walletTransList.status.${ status }`) + (status === 'confirms' ? `(${ trans.confirms })` : '');

                const isZero = BigNumber.isEqual(trans.amount, 0);
                let amount = trans.amount;
                if (!isZero) {
                    amount = trans.isSend ? (`-${ trans.amount }`) : (`+${ trans.amount }`);
                }

                nowList.push({
                    type: typeImg + this.$t(`txType.${ txType }`),
                    smallType: typeImg,
                    date: date(trans.timestamp, this.$i18n.locale),
                    status: `<span class="${ statusClass }">${ statusText }</span>`,
                    hash: trans.rawData.hash,
                    transAddr: ellipsisAddr(trans.transAddr),
                    smallTransAddr: ellipsisAddr(trans.transAddr, 6),
                    amount: `<span class="${ trans.isSend ? 'red' : 'green' }">${ amount }</span>`,
                    smallAmount: `<span class="${ trans.isSend ? 'red' : 'green' }">${ amount }</span> ${ trans.tokenSymbol }`,
                    tokenSymbol: trans.tokenSymbol,
                    rawData: trans.rawData
                });
            });

            return nowList;
        }
    },
    beforeDestroy() {
        this.stopLoopTransList();
    },
    methods: {
        goDetail(trans) {
            const locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${ process.env.viteNet }${ locale }transaction/${ trans.rawData.hash }`);
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

.trans-list-wrapper {
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;

    .title {
        margin-bottom: 40px;
    }

    .trans-list-content {
        overflow: auto;
        flex: 1;
    }
}

.small-trans {
    display: none;
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";

.tType {
    min-width: 230px;
    width: 15%;
}

.status {
    min-width: 120px;
    width: 10%;
}

.time {
    min-width: 200px;
    width: 20%;
}

.address {
    min-width: 240px;
    width: 25%;
}

.sum {
    width: 14%;
    min-width: 150px;
}

.token {
    min-width: 70px;
}

.pink {
    font-family: $font-bold, arial, sans-serif;
    color: #ea60ac;
}

.blue {
    font-family: $font-bold, arial, sans-serif;
    color: #007aff;
}

.green {
    font-family: $font-bold, arial, sans-serif;
    color: #5bc500;
}

.red {
    font-family: $font-bold, arial, sans-serif;
    color: #ff0008;
}

.icon {
    margin-right: 6px;
    margin-bottom: -2px;
}
</style>
