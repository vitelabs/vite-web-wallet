<template>
    <wallet-table class="vip-list" :headList="headList" :contentList="contentList">
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

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { pagination, walletTable },
    beforeMount() {
        this.getVipList();
    },
    data() {
        return {
            list: [],
            pageIndex: 0,
            totalNum: 0,

            headList: [
                {
                    text: this.$t('tradeVip.openAddress'),
                    cell: 'beneficiary'
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
                { text: this.$t('action') }
            ]
        };
    },
    computed: {
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
                list.push({
                    ...item,
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
            this.getVipList();
        }
    },
    methods: {
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
.vip-list {
    flex: 1;
}
</style>
