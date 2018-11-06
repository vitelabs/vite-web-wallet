<template>
    <div class="trans-list-wrapper">
        <div class="title __pointer">{{ $t('transList.title') }}</div>

        <div class="trans-list-content">
            <tabel-list class="big-trans" :headList="[{
                class: 'tType',
                text: $t('transList.tType.title'),
                cell: 'type'
            },{
                class: 'status',
                text: $t('transList.status.title'),
                cell: 'status'
            },{
                class: 'time',
                text: $t('transList.timestamp'),
                cell: 'date'
            },{
                class: 'address',
                text: $t('transList.tAddress'),
                cell: 'transAddr'
            },{
                class: 'sum',
                text: $t('transList.sum'),
                cell: 'amount'
            },{
                class: 'token',
                text: 'Token',
                cell: 'token'
            }]" :contentList="transList" :clickRow="goDetail">
                <pagination class="__tb_pagination" :currentPage="currentPage + 1" 
                            :totalPage="totalPage" :toPage="toPage"></pagination>
            </tabel-list>

            <tabel-list class="small-trans" :headList="[{
                class: 'tType',
                text: $t('transList.tType.symbol'),
                cell: 'type'
            },{
                class: 'address',
                text: $t('transList.tAddress'),
                cell: 'transAddr'
            },{
                class: 'sum',
                text: $t('transList.sum'),
                cell: 'amount'
            }]" :contentList="smallTransList" :clickRow="goDetail">
                <pagination class="__tb_pagination" :currentPage="currentPage + 1" 
                            :totalPage="totalPage" :toPage="toPage"></pagination>
            </tabel-list>
        </div>
    </div>
</template>

<script>
import sendImg from 'assets/imgs/send.svg';
import receiveImg from 'assets/imgs/receive.svg';

import pagination from 'components/pagination.vue';
import tabelList from 'components/tabelList.vue';
import date from 'utils/date.js';
import {timer} from 'utils/asyncFlow';
import loopTime from 'config/loopTime';

let transListInst = null;

export default {
    components: {
        pagination, tabelList
    },
    mounted() {
        this.currentPage = this.$store.state.transList.currentPage;
        this.startLoopTransList();
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();
        let address = activeAccount.getDefaultAddr();
        return {
            acc: activeAccount,
            address, 
            currentPage: this.$store.state.transList.currentPage
        };
    },
    computed: {
        totalPage() {
            return this.$store.getters.totalPage;
        },
        pageNumber() {
            return `${this.currentPage + 1}/${this.totalPage}`;
        },
        transList() {
            let transList = this.$store.getters.transList;

            let nowList = [];
            transList.forEach((trans) => {
                let typeImg = trans.type === 'send' ? sendImg : receiveImg;
                let type = `<img class="icon" src='${typeImg}'/>` + this.$t(`transList.tType.${trans.type}`);

                let statusClass = trans.status === 'confirmed' ? 'green' : 
                    trans.status === 'unconfirmed' ? 'pink': 'blue';
                let statusText = this.$t(`transList.status.${trans.status}`) + (trans.status === 'confirms' ? trans.confirms : '');
                let status = `<span class="${statusClass}">${statusText}</span>`;

                trans.date = date(trans.timestamp, this.$i18n.locale);
                nowList.push({
                    date: date(trans.timestamp, this.$i18n.locale),
                    status,
                    type,
                    transAddr: trans.transAddr,
                    amount: trans.amount,
                    token: trans.token
                });
            });
            return nowList;
        },
        smallTransList() {
            let transList = this.$store.getters.transList;

            let nowList = [];
            transList.forEach((trans) => {
                let typeImg = trans.type === 'send' ? sendImg : receiveImg;
                nowList.push({
                    type: `<img class="icon" src='${typeImg}'/>`,
                    amount: trans.amount + ' ' + trans.token,
                    transAddr: trans.transAddr
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
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}transaction/${trans.hash}`);
        },

        toPage(pageNumber) {
            let pageIndex = pageNumber - 1;
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            this.currentPage = pageIndex;
            this.stopLoopTransList();

            this.fetchTransList(this.currentPage, true).then((data)=>{
                data && this.$refs.tableContent && (this.$refs.tableContent.scrollTop = 0);
                this.startLoopTransList();
            }).catch(()=>{
                this.startLoopTransList();
            });
        },

        startLoopTransList() {
            this.stopLoopTransList();
            transListInst = new timer(()=>{
                return this.fetchTransList(this.currentPage);
            }, loopTime.ledger_getBlocks);
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
    padding: 40px;
    height: 100%;
    .title {
        font-family: $font-bold;
        font-size: 24px;
        color: #1D2024;
        line-height: 32px;
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

@media only screen and (max-width: 550px) {
    .trans-list-wrapper {
        padding: 15px;
    }
}

@media only screen and (max-width: 500px) {
    .trans-list-wrapper .title {
        margin-bottom: 15px;
    }
    .big-trans {
        display: none;
    }
    .small-trans {
        display: flex;
    }
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";

.tType {
    min-width: 140px;
    width: 10%;
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
    font-family: $font-bold;
    color: #EA60AC;
}
.blue {
    font-family: $font-bold;
    color: #409EFF;
}
.green {
    font-family: $font-bold;
    color: #67C23A;
}
.icon {
    margin-right: 6px;
    margin-bottom: -2px;
}

@media only screen and (max-width: 500px) {    
    .small-trans.__tb{
        min-width: 0;
    }
    .tType {
        min-width: 50px;
        width: 10%;
    }
    .address {
        overflow: hidden;
        min-width: 200px;
        width: 25%;
    }
    .sum {
        width: 14%;
        float: right;
        min-width: 60px;
    }
}
</style>
