<template>
    <wallet-table class="vip-list-table" :headList="headList" :contentList="contentList" :clickCell="clickCell">>
        <div v-for="(item, i) in contentList" :key="i"
             :slot="`${i}addrBefore`">
            <span class="beneficial-addr">{{ item.showAddress }}</span>
            <img v-if="item.address === address" class="beneficial-img" src='~assets/imgs/mine.svg'/>
        </div>

        <span v-for="(item, i) in contentList" :key="i"
              :slot="`${i}cancelBefore`"
              class="cancel" :class="{ 'active': item.isMaturity }">
            {{ $t('tradeVip.cancel', { type: item.type }) }}</span>

        <pagination slot="tableBottom" class="__tb_pagination"
                    :totalPage="totalPage" :currentPage="pageIndex + 1"
                    :toPage="getVipList"></pagination>
    </wallet-table>
</template>

<script>
import { constant } from '@vite/vitejs';
import { getVIPStakeInfoList } from 'services/viteServer';
import pagination from 'components/pagination';
import walletTable from 'components/table/index.vue';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { timer } from 'utils/asyncFlow';
import ellipsisAddr from 'utils/ellipsisAddr.js';

const Vite_Token_Info = constant.Vite_Token_Info;
let vipListInst = null;

export default {
    components: { pagination, walletTable },
    beforeMount() {
        this.getVipList();
        this.startLoopVIPList();
    },
    beforeDestroy() {
        this.stopLoopVIPList();
    },
    props: {
        showVipConfirm: {
            type: Function,
            default: () => {}
        },
        showSVipConfirm: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            list: [],
            pageIndex: 0,
            totalNum: 0,
            headList: [
                {
                    text: this.$t('tradeVip.openAddress'),
                    cell: 'addr'
                },
                {
                    text: this.$t('tradeVip.type'),
                    cell: 'type'
                },
                {
                    text: this.$t('walletQuota.list.amount'),
                    cell: 'amount'
                },
                {
                    text: this.$t('walletQuota.list.withdrawTime'),
                    cell: 'time'
                },
                {
                    text: this.$t('action'),
                    cell: 'cancel'
                }
            ]
        };
    },
    computed: {
        currentHeight() {
            return this.$store.state.ledger.currentHeight || 0;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.totalNum / 30);
        },
        contentList() {
            const list = [];
            const typeList = {
                2: 'VIP',
                3: 'SVIP',
                4: 'SVIP'
            };
            this.list.forEach(item => {
                const address = item.bid === 4 ? item.principal : item.stakeAddress;
                list.push({
                    ...item,
                    address,
                    isMaturity: bigNumber.compared(item.expirationHeight, this.currentHeight) <= 0,
                    showAddress: ellipsisAddr(address),
                    type: typeList[item.bid],
                    amount: bigNumber.toBasic(item.stakeAmount, Vite_Token_Info.decimals),
                    time: date(item.expirationTime * 1000, 'zh')
                });
            });
            return list;
        }
    },
    watch: {
        address() {
            this.list = [];
            this.pageIndex = 0;
            this.totalNum = 0;
            this.getVipList();
        }
    },
    methods: {
        clickCell(cell, item) {
            if (cell !== 'cancel' || !item.isMaturity) {
                return;
            }

            if (item.type === 'VIP') {
                this.showVipConfirm(item);
                return;
            }
            this.showSVipConfirm(item);
        },
        startLoopVIPList() {
            this.stopLoopVIPList();
            vipListInst = new timer(() => this.getVipList(this.pageIndex + 1), 2000);
            vipListInst.start();
        },
        stopLoopVIPList() {
            vipListInst && vipListInst.stop();
            vipListInst = null;
        },
        getVipList(pageNumber = 1) {
            pageNumber = pageNumber - 1;

            getVIPStakeInfoList(this.address, pageNumber).then(({ totalStakeCount, stakeList }) => {
                this.pageIndex = pageNumber;
                this.totalNum = totalStakeCount;
                this.list = stakeList || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.beneficial-img {
    margin-left: 8px;
    margin-bottom: -2px;
    width: 12px;
    height: 12px;
}

.cancel {
    color: #ced1d5;
    &.active {
        color: #007aff;
    }
}
</style>
