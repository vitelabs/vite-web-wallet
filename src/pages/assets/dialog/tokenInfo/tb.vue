<template>
    <div class="record_container">
        <div class="tb__body">
            <div class="head row">
                <div class="column">
                    {{ $t(`tokenCard.${type}Record.heads`)[0] }}
                </div>
                <div class="column">
                    {{ $t(`tokenCard.${type}Record.heads`)[1] }}
                </div>
                <div class="column">
                    {{ $t(`tokenCard.${type}Record.heads`)[2] }}
                </div>
                <div class="column">
                    {{
                        $t(`tokenCard.${type}Record.heads.3`, {
                            outChain: token.tokenSymbol
                        })
                    }}
                </div>
                <div class="column">
                    {{
                        $t(`tokenCard.${type}Record.heads.4`, {
                            outChain: token.tokenSymbol
                        })
                    }}
                </div>
            </div>
            <div class="row" v-for="item in tbData" :key="item.inTxHash">
                <div class="column">{{ item.dateTime | dateShow }}</div>
                <div class="column">
                    {{ item.amount | toBasic(token.decimals) }}
                </div>
                <div class="column">
                    {{
                        $t(`tokenCard.${type}Record.statusMap.${item.state}`, {
                            outChain: token.tokenSymbol
                        })
                    }}
                </div>
                <div
                    class="column click-able"
                    @click="
                        () =>
                            type === 'deposit'
                                ? gotoOutHash(item.outTxHash)
                                : gotoInHash(item.inTxHash)
                    "
                >
                    {{
                        type === "deposit"
                            ? item.outTxHash
                            : item.inTxHash | hashShortify
                    }}
                </div>
                <div
                    class="column click-able"
                    @click="
                        () =>
                            type === 'withdraw'
                                ? gotoOutHash(item.outTxHash)
                                : gotoInHash(item.inTxHash)
                    "
                >
                    {{
                        type === "withdraw"
                            ? item.outTxHash
                            : item.inTxHash | hashShortify
                    }}
                </div>
            </div>
        </div>
        <div class="pagination">
            <Pagination
                :totalPage="totalPage"
                :toPage="updateData"
                :currentPage="currentPage"
            ></Pagination>
        </div>
    </div>
</template>
<script>
import Pagination from 'components/pagination.vue';
import { getDepositRecords, getWithdrawRecords } from 'services/gate.js';
import shortify from 'utils/ellipsisAddr';
import b from 'utils/bigNumber';
import openUrl from 'utils/openUrl';
import d from 'dayjs';
const pageSize = 10;

export default {
    components: { Pagination },
    props: {
        type: {
            type: String,
            default: ''
        },
        token: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            currentPage: 1,
            totalPage: 0,
            inTxExplorerFormat: '',
            outTxExplorerFormat: '',
            tbData: []
        };
    },
    beforeMount() {
        this.updateData();
    },
    filters: {
        dateShow(value) {
            return d(Number(value)).format('YYYY.MM.DD HH:mm');
        },
        toBasic: (value, decimals) => b.toBasic(value, decimals),
        hashShortify(value) {
            return shortify(value, 6, 0);
        }
    },
    computed: {
        defaultAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        gotoInHash(hash) {
            if (!hash) {
                return;
            }
            openUrl(this.inTxExplorerFormat.replace('{$tx}', hash));
        },
        gotoOutHash(hash) {
            if (!hash) {
                return;
            }
            openUrl(this.outTxExplorerFormat.replace('{$tx}', hash));
        },
        updateData(pageNum = this.currentPage) {
            if (!this.type) {
                return;
            } else if (this.type === 'deposit') {
                getDepositRecords({
                    tokenId: this.token.tokenId,
                    walletAddress: this.defaultAddr,
                    pageNum,
                    pageSize
                },
                this.token.gateInfo.url)
                    .then(data => {
                        this.totalPage = Math.ceil(data.totalCount / pageSize);
                        this.inTxExplorerFormat = data.inTxExplorerFormat;
                        this.outTxExplorerFormat = data.outTxExplorerFormat;
                        this.tbData = data.depositRecords;
                        this.currentPage = pageNum;
                    })
                    .catch(e => console.error(e));
            } else if (this.type === 'withdraw') {
                getWithdrawRecords({
                    tokenId: this.token.tokenId,
                    walletAddress: this.defaultAddr,
                    pageNum,
                    pageSize
                },
                this.token.gateInfo.url)
                    .then(data => {
                        this.totalPage = Math.ceil(data.totalCount / pageSize);
                        this.inTxExplorerFormat = data.inTxExplorerFormat;
                        this.outTxExplorerFormat = data.outTxExplorerFormat;
                        this.tbData = data.withdrawRecords;
                        this.currentPage = pageNum;
                    })
                    .catch(e => console.error(e));
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@import "assets/scss/vars.scss";
.record_container {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .pagination {
        display: flex;
        justify-content: center;
        padding: 20px 0;
    }
}
.tb__body {
    display: flex;
    flex-direction: column;
    max-height: 100%;
    background: #fff;
    font-size: 12px;
    .row {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        box-sizing: border-box;
        height: 40px;
        color: #1d2024;
        line-height: 40px;
        border-bottom: 1px solid rgba(198, 203, 212, 0.3);
        display: flex;
        width: 100%;
        justify-content: space-between;
        padding: 0 30px;
        &:last-child {
            border-bottom: none;
        }
        .column {
            &.click-able {
                cursor: pointer;
                color: #007aff;
            }
            &:first-child {
                min-width: 93px;
                width: 20%;
                justify-content: flex-start;
            }
            &:nth-child(2) {
                min-width: 70px;
                width: 5%;
            }
            &:nth-child(3) {
                min-width: 70px;
                width: 25%;
            }
            &:last-child,
            &:nth-child(4) {
                min-width: 105px;
                width: 22%;
            }
            word-break: break-word;
            line-height: 14px;
            white-space: normal;
            display: flex;
            margin: 0 4px;
            align-items: center;
            justify-content: center;
            &:last-child {
                justify-content: flex-end;
            }
        }
        &.head {
            background-color: rgba(198, 203, 212, 0.08);
            color: #5e6875;
            box-sizing: border-box;
            flex: none;
            @include font-family-normal();
            color: rgba(94, 104, 117, 0.58);
            font-weight: 400;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid rgba(212, 222, 231, 1);
        }
    }

    .row-container {
        flex: 1;
        overflow-x: hidden;
        overflow-y: scroll;
        position: relative;
    }

    .no-data {
        width: 100%;
        position: absolute;
        top: 50%;
        margin-top: -48px;
        font-size: 12px;
        @include font-family-normal();
        font-weight: 400;
        color: rgba(94, 104, 117, 0.58);
        line-height: 16px;
        text-align: center;
        &:before {
            display: inline-block;
            margin-bottom: 16px;
            content: " ";
            width: 60px;
            height: 60px;
            background: url("~assets/imgs/dexEmpty.svg") 100% 100%;
        }
    }
}
</style>
