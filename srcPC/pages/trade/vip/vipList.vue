<template>
    <wallet-table class="vip-list" :headList="headList" :contentList="list">
        <pagination slot="tableBottom" class="__tb_pagination"
                    :totalPage="totalPage" :currentPage="pageIndex + 1"
                    :toPage="getVipList"></pagination>
    </wallet-table>
</template>

<script>
import { getVIPStakeInfoList } from 'services/viteServer';
import pagination from 'components/pagination';
import walletTable from 'components/table/index.vue';

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
                    cell: 'address'
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
                this.totalPage = totalStakeCount;
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
