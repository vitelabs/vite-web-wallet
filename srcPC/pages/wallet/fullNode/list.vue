<template>
    <wallet-table class="wallet-quota-table" :headList="headList" :contentList="pledgeList" :clickCell="clickCell">
        <div v-for="(item, i) in pledgeList" :key="i"
             :slot="`${i}addrBefore`">
            <span class="beneficial-addr">{{ item.showAddr }}</span>
            <img v-if="item.beneficialAddr === address" class="beneficial-img" src='~assets/imgs/mine.svg'/>
        </div>

        <span v-for="(item, i) in pledgeList" :key="i"
              :slot="`${i}cancelBefore`"
              :class="{
                  'cancel': true,
                  'active': item.isMaturity && !item.agent
        }">{{ $t('walletQuota.withdrawalStaking') }}</span>

        <pagination slot="tableBottom" class="__tb_pagination" :currentPage="currentPage + 1"
                    :totalPage="totalPage" :toPage="toPage"></pagination>
    </wallet-table>
</template>

<script>
import { constant } from '@vite/vitejs';

import pagination from 'pcComponents/pagination.vue';
import walletTable from 'pcComponents/table/index.vue';
import date from 'utils/date.js';
import openUrl from 'utils/openUrl';
import { timer } from 'utils/asyncFlow';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getExplorerLink } from 'utils/getLink';
import { execWithValid } from 'pcUtils/execWithValid';
import { getRewardPledgeFullList } from 'pcServices/reward';

let pledgeListInst;
const limit = 30;
const Vite_TokenInfo = constant.Vite_Token_Info;

export default {
    components: { pagination, walletTable },
    mounted() {
        this.$store.dispatch('startLoopHeight');
        this.startLoopPledgeList();
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
        this.stopLoopPledgeList();
    },
    data() {
        return {
            currentPage: 0,
            total: 0,
            list: []
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            const totalNum = this.total || 0;
            return Math.ceil(totalNum / limit);
        },
        currentHeight() {
            return this.$store.state.ledger.currentHeight || 0;
        },
        headList() {
            return [ {
                class: 'amount',
                text: this.$t('walletQuota.list.amount'),
                cell: 'showAmount'
            }, {
                class: 'height',
                text: this.$t('withdrawHeight'),
                cell: 'withdrawHeight'
            }, {
                class: 'time',
                text: this.$t('walletQuota.list.withdrawTime'),
                cell: 'pledgeDate'
            }, {
                class: 'operate __pointer',
                text: this.$t('action'),
                cell: 'cancel'
            } ];
        },
        pledgeList() {
            const pledgeList = this.list;
            const nowList = [];

            pledgeList.forEach(pledge => {
                const isMaturity = BigNumber.compared(pledge.endHeight, this.currentHeight) <= 0;

                const pledgeDate = isMaturity
                    ? this.$t('walletQuota.maturity')
                    : date(pledge.pledgeExpirationTime * 1000, this.$i18n.locale);

                nowList.push({
                    pledgeDate,
                    isMaturity,
                    withdrawHeight: pledge.endHeight,
                    showAmount: BigNumber.toBasic(pledge.amount, Vite_TokenInfo.decimals),
                    rawData: pledge
                });
            });

            return nowList;
        }
    },
    watch: {
        address() {
            this.startLoopPledgeList();
        }
    },
    methods: {
        clickCell(cell, item, index) {
            if (cell !== 'cancel') {
                return;
            }

            if (!item.isMaturity) {
                this.$toast(this.$t('walletQuota.list.unexpired'));
                return;
            }

            statistics.event(this.$route.name, 'other-withdrawQuota', this.address || '');
            this.showCancel(item, index);
            return;
        },
        gotoDetail(addr) {
            openUrl(`${ getExplorerLink(this.$i18n.locale) }account/${ addr }`);
        },
        showCancel: execWithValid(function (item) {
            this.$emit('showCancelConfirm', item);
        }),

        toPage(pageNumber) {
            const pageIndex = pageNumber - 1;
            if ((pageIndex >= this.totalPage && pageIndex) || pageIndex < 0) {
                return;
            }

            this.currentPage = pageIndex;

            getRewardPledgeFullList({
                limit,
                address: this.address,
                offset: pageIndex ? (pageIndex - 1) * limit : 0
            }).then(data => {
                this.total = data ? data.total || 0 : 0;
                this.list = data ? data.fullNodePledgeInfos || [] : [];
            }).catch(error => {
                console.warn(error);
            });
        },

        startLoopPledgeList() {
            this.stopLoopPledgeList();
            pledgeListInst = new timer(() => this.toPage(this.currentPage + 1), 5000);
            pledgeListInst.start();
        },
        stopLoopPledgeList() {
            pledgeListInst && pledgeListInst.stop();
            pledgeListInst = null;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.list-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 300px;
}

.wallet-quota-table {
    flex: 1;
    overflow: auto;
}

.beneficial-addr {
    color: #007aff;
}

.beneficial-img {
    margin-left: 8px;
    margin-bottom: -2px;
    width: 12px;
    height: 12px;
}

.__second-title {
    margin-bottom: 8px;
}

.total {
    font-size: 14px;
    color: #5e6875;
    letter-spacing: 0.35px;
    line-height: 16px;
    margin-bottom: 14px;
    font-weight: 400;
}
</style>
