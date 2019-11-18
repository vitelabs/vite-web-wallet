<template>
    <confirm v-if="isShow" class="big no-padding-confirm" :closeIcon="true" :showMask="true"
             :title="$t('walletQuota.list.title')" :close="close">
        <wallet-table class="trade-list-table" :clickCell="clickCell"
                      :headList="heads" :contentList="contentList">

            <span v-for="(item, i) in contentList" :key="i"
                  :slot="`${i}cancelBefore`"
                  :class="{
                      'cancel': true,
                      'active': item.canCancel
            }">{{ $t('walletQuota.withdrawalStaking') }}</span>

            <pagination slot="tableBottom" class="__tb_pagination"
                        :totalPage="totalPage" :currentPage="pageIndex + 1"
                        :toPage="getStakingList"></pagination>
        </wallet-table>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import pagination from 'components/pagination';
import walletTable from 'components/table/index.vue';
import confirm from 'components/confirm/confirm.vue';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { getAgentMiningPledgeInfo } from 'services/viteServer';
import { timer } from 'utils/asyncFlow';

const Vite_Token_Info = constant.Vite_Token_Info;
let stakingListInst = null;

export default {
    components: { walletTable, confirm, pagination },
    mounted() {
        this.$store.dispatch('startLoopHeight');
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
        this.stopLoopStakingList();
    },
    props: {
        cancelStake: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            isShow: false,
            list: [],
            totalNum: 0,
            pageIndex: 0,

            heads: [ {
                text: this.$t('tradeDividend.unlockList.amount'),
                cell: 'amount'
            }, {
                text: this.$t('withdrawHeight'),
                cell: 'height'
            }, {
                text: this.$t('walletQuota.list.withdrawTime'),
                cell: 'time'
            }, {
                text: this.$t('action'),
                cell: 'cancel'
            } ]
        };
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    time: date(item.expirationTime * 1000, 'zh'),
                    amount: `${ bigNumber.toBasic(item.stakeAmount, Vite_Token_Info.decimals) } VITE`,
                    height: item.expirationHeight,
                    canCancel: bigNumber.compared(item.expirationHeight, this.currentHeight) <= 0,
                    rawData: item
                });
            });
            return list;
        },
        totalPage() {
            return Math.ceil(this.totalNum / 10);
        }
    },
    watch: {
        address() {
            this.init();
        }
    },
    methods: {
        clickCell(cell, item) {
            if (cell !== 'cancel' && !item.canCancel) {
                return;
            }
            this.cancelStake(item);
        },
        init() {
            this.list = [];
            this.pageIndex = 0;
            this.totalNum = 0;
            this.getStakingList();
            this.startLoopStakingList();
        },
        show() {
            this.isShow = true;
            this.init();
        },
        close() {
            this.isShow = false;
            this.stopLoopStakingList();
        },
        getStakingList(pageIndex = 1) {
            pageIndex = pageIndex - 1;

            getAgentMiningPledgeInfo(this.address, pageIndex).then(({ totalStakeCount, stakeList }) => {
                this.pageIndex = pageIndex;
                this.totalNum = totalStakeCount;
                this.list = stakeList || [];
            }).catch(err => {
                console.warn(err);
            });
        },

        startLoopStakingList() {
            this.stopLoopStakingList();
            stakingListInst = new timer(() => this.getStakingList(this.pageIndex + 1), 2000);
            stakingListInst.start();
        },
        stopLoopStakingList() {
            stakingListInst && stakingListInst.stop();
            stakingListInst = null;
        }
    }
};
</script>

<style lang="scss" scoped>
.cancel {
    color: #ced1d5;
    &.active {
        color: #007aff;
    }
}
</style>
