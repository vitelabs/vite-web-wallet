<template>
    <div class="tx-pair-manage">
        <sec-title :title="$t('tradeTxPairManage.title', { tokenSymbol })"
                   :isShowHelp="false" :isShowBack="true"></sec-title>

        <wallet-table class="tx-pair-manage-table" :headList="headList" :contentList="showList">
            <span v-for="(v, i) in showList" :key="i"
                  :class="`status-icon status_${v.status}`" :slot="`${i}statusTxtBefore`"> </span>

            <span v-for="(v, i) in showList" :key="i" :slot="`${i}operateBefore`">
                <span v-show="v.status === 3" @click="openTxPair(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.openTxPair') }}</span>
                <span v-show="v.status === 0" @click="getIncomeList(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.historyIncome') }}</span>
                <span v-show="v.status === 1" @click="stopTx(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.stopTrans') }}</span>
                <span v-show="v.status === 2" @click="openTx(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.resetTrans') }}</span>
                <span v-show="v.status === 1 || v.status === 2" @click="changeFee(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.changeFee') }}</span>
                <span v-show="v.status === 1 || v.status === 2" @click="changeOwner(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.changeOwner') }}</span>
                <span v-show="v.status === 1 || v.status === 2" @click="getIncomeList(v)"
                      class="__pointer click-able">
                    {{ $t('tradeTxPairManage.incomeList') }}</span>
            </span>

            <pagination slot="tableBottom" class="__tb_pagination"
                        :totalPage="totalPage"
                        :toPage="fetchOperatorMarkets"
                        :currentPage="currentPage + 1"></pagination>
        </wallet-table>

        <income-list v-if="showConfirmType === 'incomeList'"
                     :close="closeConfirm" :txPair="activeTxPair"></income-list>
        <change-owner v-if="showConfirmType === 'changeOwner'"
                      :close="closeConfirm" :txPair="activeTxPair"
                      :fetchConfig="fetchConfigTxPair"></change-owner>
        <change-fee v-if="showConfirmType === 'changeFee'"
                    :close="closeConfirm" :txPair="activeTxPair"
                    :fetchConfig="fetchConfigTxPair"></change-fee>
        <open-tx-pair v-if="showConfirmType === 'openTxPair'"
                      :close="closeConfirm" :txPair="activeTxPair"></open-tx-pair>
    </div>
</template>

<script>
import { operatorMarkets } from 'services/trade';
import pagination from 'components/pagination.vue';
import walletTable from 'components/table/index.vue';
import secTitle from 'components/secTitle.vue';
import confirm from 'components/confirm/index.js';
import { initPwd } from 'pcComponents/password/index.js';
import openTxPair from './openTxPair.vue';
import incomeList from './incomeList.vue';
import changeFee from './changeFee.vue';
import changeOwner from './changeOwner.vue';
import { execWithValid } from 'pcUtils/execWithValid';
import sendTx from 'pcUtils/sendTx';
import BigNumber from 'utils/bigNumber';

export default {
    components: { pagination, walletTable, secTitle, incomeList, openTxPair, changeOwner, changeFee },
    created() {
        this.fetchOperatorMarkets();
    },
    data() {
        return {
            tokenId: this.$route.params.tokenId,
            tokenSymbol: this.$route.params.tokenSymbol,
            txPairList: [],
            unOpenedTxPairList: [],
            listTotal: 0,
            currentPage: 0,

            activeTxPair: null,
            showConfirmType: ''
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.listTotal / 30);
        },
        headList() {
            return [ {
                text: this.$t('tradeTxPairManage.symbol'),
                cell: 'symbol'
            }, {
                text: this.$t('tradeTxPairManage.income'),
                cell: 'income'
            }, {
                text: this.$t('tradeTxPairManage.fee'),
                cell: 'fee'
            }, {
                text: this.$t('tradeTxPairManage.status'),
                cell: 'statusTxt'
            }, {
                text: this.$t('tradeTxPairManage.operate'),
                cell: 'operate'
            } ];
        },
        showList() {
            const list = [];

            this.txPairList.forEach(item => {
                const status = this.getStatus(item);
                const takerStr = item.takerFeeRate ? `Taker(${ (item.takerFeeRate * 100).toFixed(3) }%)` : '';
                const makerStr = item.makerFeeRate ? `Maker(${ (item.makerFeeRate * 100).toFixed(3) }%)` : '';

                list.push({
                    symbol: `${ item.tradeTokenSymbol }/${ item.quoteTokenSymbol }`,
                    income: item.income ? BigNumber.onlyFormat(item.income) : '--',
                    fee: !makerStr && !takerStr ? '--' : `${ takerStr || 'Taker(--)' } / ${ makerStr || 'Maker(--)' }`,
                    status,
                    statusTxt: this.$t('tradeTxPairManage.statusList')[status],
                    txPairDetail: item,
                    tradeTokenDetail: this.$route.params
                });
            });

            this.unOpenedTxPairList.forEach(item => {
                list.push({
                    symbol: `${ item.tradeTokenSymbol }/${ item.quoteTokenSymbol }`,
                    income: '--',
                    fee: '--',
                    status: 3,
                    statusTxt: this.$t('tradeTxPairManage.statusList')[3],
                    txPairDetail: item,
                    tradeTokenDetail: this.$route.params
                });
            });
            return list;
        }
    },
    watch: {
        address() {
            this.$router.push({ name: 'tradeOperator' });
        }
    },
    methods: {
        getStatus(item) {
            if (item.transferStatus === 1) {
                return 0;
            }
            return item.openStatus + 1;
        },
        openTxPair: execWithValid(function (item) {
            this.activeTxPair = item;
            this.showConfirmType = 'openTxPair';
        }),
        stopTx: execWithValid(function (item) {
            confirm({
                size: 'small',
                title: this.$t('tradeTxPairManage.stopTrans'),
                leftBtn: { text: this.$t('btn.cancel') },
                rightBtn: {
                    text: this.$t('btn.submit'),
                    click: () => {
                        this.fetchStopTx(item);
                    }
                },
                content: this.$t('tradeTxPairManage.stopTransHint', { symbol: item.symbol })
            });
        }),
        openTx: execWithValid(function (item) {
            confirm({
                size: 'small',
                title: this.$t('tradeTxPairManage.resetTrans'),
                leftBtn: { text: this.$t('btn.cancel') },
                rightBtn: {
                    text: this.$t('btn.submit'),
                    click: () => {
                        this.fetchOpenTx(item);
                    }
                },
                content: this.$t('tradeTxPairManage.resetTransHint', { symbol: item.symbol })
            });
        }),
        changeFee: execWithValid(function (item) {
            this.activeTxPair = item;
            this.showConfirmType = 'changeFee';
        }),
        changeOwner: execWithValid(function (item) {
            this.activeTxPair = item;
            this.showConfirmType = 'changeOwner';
        }),
        getIncomeList(item) {
            this.activeTxPair = item;
            this.showConfirmType = 'incomeList';
        },
        closeConfirm() {
            this.activeTxPair = null;
            this.showConfirmType = '';
        },

        fetchOpenTx(item) {
            this.fetchConfigTxPair({
                operationCode: 8,
                tradeToken: item.txPairDetail.tradeToken,
                quoteToken: item.txPairDetail.quoteToken,
                stopMarket: false
            }, {
                success: this.$t('tradeTxPairManage.openSuccess'),
                fail: this.$t('tradeTxPairManage.openFail')
            });
        },
        fetchStopTx(item) {
            this.fetchConfigTxPair({
                operationCode: 8,
                tradeToken: item.txPairDetail.tradeToken,
                quoteToken: item.txPairDetail.quoteToken,
                stopMarket: true
            }, {
                success: this.$t('tradeTxPairManage.stopSuccess'),
                fail: this.$t('tradeTxPairManage.stopFail')
            });
        },

        fetchConfigTxPair(config, { success = '', fail = '' }) {
            initPwd({
                submit: () => {
                    this.onlyFetchConfig(config).then(() => {
                        this.$toast(success);
                        this.showConfirmType && this.closeConfirm();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(fail, err);
                    });
                }
            });
        },
        onlyFetchConfig({ operationCode, tradeToken, quoteToken, owner = this.address, takerFeeRate = 0, makerFeeRate = 0, stopMarket = false }) {
            return sendTx({
                methodName: 'dexFundMarketOwnerConfig',
                data: { operationCode, tradeToken, quoteToken, owner, takerFeeRate, makerFeeRate, stopMarket }
            });
        },
        fetchOperatorMarkets(pageNum) {
            const offset = pageNum ? (pageNum - 1) * 30 : 0;

            operatorMarkets({
                offset,
                operatorId: this.address,
                tradeToken: this.tokenId
            }).then(data => {
                if (!data) {
                    return;
                }

                this.listTotal = data.total || 0;
                this.currentPage = pageNum ? pageNum - 1 : 0;
                this.txPairList = data.tradePairList || [];
                this.unOpenedTxPairList = data.unOpenedTradePairList || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tx-pair-manage {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .tx-pair-manage-table {
        flex: 1;
        .status-icon {
            display: inline-block;
            width: 14px;
            height: 14px;
            margin-right: 2px;
            margin-bottom: -3px;
            &.status_0 {
                background: url('~assets/imgs/trans-change-owner.svg');
                background-size: 100% 100%;
            }
            &.status_1 {
                background: url('~assets/imgs/transfer.svg');
                background-size: 100% 100%;
            }
            &.status_2 {
                background: url('~assets/imgs/stop-trans.svg');
                background-size: 100% 100%;
            }
            &.status_3 {
                background: url('~assets/imgs/trans-closed.svg');
                background-size: 100% 100%;
            }
        }
    }
    .click-able {
        margin-right: 20px;
    }
}
</style>
