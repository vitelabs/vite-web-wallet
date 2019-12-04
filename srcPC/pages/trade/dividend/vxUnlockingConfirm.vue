<template>
    <confirm v-if="isShow" class="big no-padding-confirm" :closeIcon="true" :showMask="true"
             :title="$t('tradeDividend.unlockList.title')" :close="close">
        <wallet-table class="trade-list-table" :headList="heads" :contentList="contentList">
            <pagination slot="tableBottom" class="__tb_pagination"
                        :totalPage="totalPage" :currentPage="pageIndex + 1"
                        :toPage="getUnlockingList"></pagination>
        </wallet-table>
    </confirm>
</template>

<script>
import pagination from 'pcComponents/pagination';
import walletTable from 'pcComponents/table/index.vue';
import confirm from 'components/confirm/confirm.vue';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { getVxUnlockList } from 'services/viteServer';

export default {
    components: { walletTable, confirm, pagination },
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
                text: this.$t('tradeDividend.unlockList.time'),
                cell: 'time'
            } ]
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        vxTokenInfo() {
            return this.$store.getters.vxTokenInfo || {};
        },
        vxTokenDecimals() {
            return this.vxTokenInfo.decimals;
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    amount: `${ bigNumber.toBasic(item.amount, this.vxTokenDecimals) } VX`,
                    time: date(item.expirationTime * 1000, 'zh')
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
        init() {
            this.list = [];
            this.pageIndex = 0;
            this.totalNum = 0;
            this.getUnlockingList();
        },
        show() {
            this.isShow = true;
            this.init();
        },
        close() {
            this.isShow = false;
        },
        getUnlockingList(pageIndex = 1) {
            pageIndex = pageIndex - 1;

            getVxUnlockList(this.address, pageIndex, 10).then(({ count, unlocks }) => {
                this.pageIndex = pageIndex;
                this.totalNum = count;
                this.list = unlocks || [];
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>
