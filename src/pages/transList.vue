<template>
    <div class="trans-list-wrapper">
        <div class="title __pointer">{{ $t('transList.title') }}</div>

        <!-- [TODO] -->

        <div class="trans-list">
            <div class="table__head">
                <div class="cell-text tType">{{ $t('transList.tType.title') }}</div>
                <div class="cell-text status">{{ $t('transList.status.title') }}</div>
                <div class="cell-text time">{{ $t('transList.timestamp') }}</div>
                <div class="cell-text address">{{ $t('transList.tAddress') }}</div>
                <div class="cell-text sum">{{ $t('transList.sum') }}</div>
                <div class="cell-text">Token</div>
            </div>

            <div ref="tableContent" class="table-content" v-show="transList && transList.length">
                <div v-for="(item, index) in transList" :key="index"
                     class="t-row __pointer" @click="goDetail(item)">
                    <span class="cell-text tType">
                        <img v-show="item.type === 'send'" class="icon" src='../assets/imgs/send.svg'/>
                        <img v-show="item.type === 'receive'" class="icon" src='../assets/imgs/receive.svg'/>
                        {{ $t(`transList.tType.${item.type}`) }}
                    </span>
                    <span class="cell-text status" :class="{
                        'green': item.status === 'confirmed',
                        'pink': item.status === 'unconfirmed',
                        'blue': item.status === 'confirms'
                    }">{{ $t(`transList.status.${item.status}`) + `${item.status === 'confirms' ? item.confirms : ''}` }}</span>
                    <span class="cell-text time">{{ item.date }}</span>
                    <span class="cell-text address">{{ item.transAddr }}</span>
                    <span class="cell-text sum">{{ item.amount }}</span>
                    <span class="cell-text">{{ item.token }}</span>
                </div>
            </div>

            <div class="table-content no-data" v-show="!transList || !transList.length">
                {{ $t('transList.noData') }}
            </div>

            <pagination class="pagination" :currentPage="currentPage + 1" 
                        :totalPage="totalPage" :toPage="toPage"></pagination>
        </div>

        <div class="trans-list meta">
            <div class="table__head">
                <div class="cell-text tType">{{ $t('transList.tType.symbol') }}</div>
                <div class="cell-text address">{{ $t('transList.tAddress') }}</div>
                <div class="cell-text sum">{{ $t('transList.sum') }}</div>
            </div>

            <div ref="tableContent" class="table-content" v-show="transList && transList.length">
                <div v-for="(item, index) in transList" :key="index"
                     class="t-row __pointer" @click="goDetail(item)">
                    <span class="cell-text tType">
                        <img v-show="item.type === 'send'" class="icon" src='../assets/imgs/send.svg'/>
                        <img v-show="item.type === 'receive'" class="icon" src='../assets/imgs/receive.svg'/>
                    </span>
                    <span class="cell-text address">{{ item.transAddr }}</span>
                    <span class="cell-text sum">{{ item.amount }} {{ item.token }}</span>
                </div>
            </div>

            <div class="table-content no-data" v-show="!transList || !transList.length">
                {{ $t('transList.noData') }}
            </div>

            <pagination class="pagination" :currentPage="currentPage + 1" 
                        :totalPage="totalPage" :toPage="toPage"></pagination>
        </div>
    </div>
</template>

<script>
import pagination from 'components/pagination.vue';
import date from 'utils/date.js';
import timer from 'utils/asyncFlow';
import loopTime from 'loopTime';

let transListInst = null;

export default {
    components: {
        pagination
    },
    mounted() {
        this.currentPage = this.$store.state.transList.currentPage;
        this.startLoopTransList(() => {
            return this.fetchTransList(this.currentPage);
        });
    },
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
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
            transList.forEach(trans => {
                trans.date = date(trans.timestamp, this.$i18n.locale);
                nowList.push(trans);
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
            window.open(`http://132.232.134.168:8080/${locale}transaction/${trans.hash}`);
            // window.open(`https://testnet.vite.net/${locale}transaction/${trans.hash}`);
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
    position: relative;
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
}
.trans-list {
    position: relative;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    max-height: 100%;
    overflow: auto;
    background: #FFF;
    box-shadow: 0 2px 15px 1px rgba(176, 192, 237, 0.17);
    border-radius: 8px;
    &.meta {
        display: none;
    }
    .table__head {
        height: 48px;
        line-height: 48px;
        border-bottom: 1px solid #f3f6f9;
        font-family: $font-bold;
        color: #1D2024;
    }
    .table-content {
        position: relative;
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;
    }
    .pagination {
        height: 75px;
        line-height: 75px;
        text-align: center;
        border-top: 1px solid #f3f6f9;
    }
}

.t-row {
    border-bottom: 1px solid #f3f6f9;
    color: #5E6875;
    height: 48px;
    line-height: 48px;
    box-sizing: border-box;
    &:last-child {
        border: none;
    }
    &:hover {
        background: rgba(88,145,255,.13);
    }
}

.cell-text {
    display: inline-block;
    text-align: left;
    font-size: 14px;
    &:first-child {
        padding-left: 22.5px;
    }
    &:last-child {
        padding-right: 22.5px;
    }
    &.tType {
        min-width: 140px;
        width: 10%;
    }
    &.status {
        min-width: 120px;
        width: 10%;
    }
    &.time {
        min-width: 200px;
        width: 20%;
    }
    &.address {
        min-width: 240px;
        width: 25%;
    }
    &.sum {
        width: 14%;
        min-width: 150px;
    }
    &.pink {
        font-family: $font-bold;
        color: #EA60AC;
    }
    &.blue {
        font-family: $font-bold;
        color: #409EFF;
    }
    &.green {
        font-family: $font-bold;
        color: #67C23A;
    }
    .icon {
        margin-right: 6px;
        margin-bottom: -2px;
    }
}

.no-data {
    height: 75px;
    line-height: 75px;
    text-align: center;
}

@media only screen and (max-width: 500px) {
    .trans-list-wrapper {
        padding: 15px;
        .title {
            margin-bottom: 15px;
        }
    }
    .trans-list {
        display: none;
    }
    .trans-list.meta {
        display: flex;
        max-height: 92%;
        .table__head {
            text-align: center;
        }
    }
    .cell-text {
        white-space: nowrap;
        &:first-child {
            float: left;
            padding-left: 10px;
        }
        &:last-child {
            float: right;
            padding-right: 10px;
        }
        &.tType {
            min-width: 50px;
            width: 10%;
        }
        &.address {
            overflow: hidden;
            min-width: 200px;
            width: 25%;
        }
        &.sum {
            width: 14%;
            float: right;
            min-width: 60px;
        }
    }
}
</style>
