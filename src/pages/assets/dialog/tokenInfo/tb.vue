<template>
    <div class="__tb">
        <div class="__tb_row __tb_head __pointer">
            <div class="__tb_cell">
                {{ $t(`tokenCard.${type}Record.heads`)[0] }}
            </div>
            <div class="__tb_cell">
                {{ $t(`tokenCard.${type}Record.heads`)[1] }}
            </div>
            <div class="__tb_cell">
                {{ $t(`tokenCard.${type}Record.heads`)[2] }}
            </div>
            <div class="__tb_cell">
                {{
                    $t(`tokenCard.${type}Record.heads.3`, {
                        outChain: tokenToGate[token.tokenId].mappedNet
                    })
                }}
            </div>
            <div class="__tb_cell">
                {{
                    $t(`tokenCard.${type}Record.heads.4`, {
                        outChain: tokenToGate[token.tokenId].mappedNet
                    })
                }}
            </div>
        </div>

        <div v-show="tbData && tbData.length" class="__tb_content">
            <div class="__tb_row __tb_content_row" v-for="item in tbData" :key="item.inTxHash">
                <div class="__tb_cell">{{ item.dateTime | dateShow }}</div>
                <div class="__tb_cell">{{ item.amount | toBasic(token.decimals) }}</div>
                <div class="__tb_cell">
                    {{
                        $t(`tokenCard.${type}Record.statusMap.${item.state}`, {
                            outChain: tokenToGate[token.tokenId].mappedNet
                        })
                    }}
                </div>
                <div class="__tb_cell click-able"
                     @click="() => gotoInHash(item.inTxHash)">
                    {{ item.inTxHash| hashShortify }}
                </div>
                <div class="__tb_cell click-able"
                     @click="() => gotoOutHash(item.outTxHash)">
                    {{ item.outTxHash | hashShortify }}
                </div>
            </div>
        </div>

        <div class="__tb_content __tb_content_no_data" v-show="!tbData || !tbData.length">
            <div class="__tb_no_data">
                <div>{{ $t('hint.noData') }}</div>
            </div>
        </div>

        <Pagination class="__tb_pagination"
                    :totalPage="totalPage"
                    :toPage="updateData"
                    :currentPage="currentPage"></Pagination>
    </div>
</template>

<script>
// [TODO] Need components/table

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
        },
        tokenToGate() {
            return this.$store.getters.mapToken2Gate;
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
@import "~assets/scss/table.scss";
@import "assets/scss/vars.scss";

.click-able {
    cursor: pointer;
    color: #007aff;
}

.__tb {
    width: 100%;
    height: 100%;
    min-width: 0px;
    box-shadow: none;
}

.__tb_row {
    &.__tb_head {
        border: none;
        background: rgba(198,203,212,0.08);
        font-size: 14px;
    }
    &.__tb_content_row {
        border: none;
    }
}

.__tb_cell {
    word-break: break-word;
    white-space: normal;
    &:first-child {
        min-width: 93px;
        width: 20%;
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
}
</style>
