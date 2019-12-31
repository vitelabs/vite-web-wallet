<template>
    <confirm v-if="isShow" class="big no-padding-confirm" :closeIcon="true" :showMask="true"
             :title="$t('tradeDividend.unlockList.title')" :close="close">
        <wallet-table class="trade-list-table" :headList="heads" :contentList="contentList">
            <pagination slot="tableBottom" class="__tb_pagination"
                        :totalPage="totalPage" :currentPage="pageIndex + 1"
                        :toPage="getCancellingList"></pagination>
        </wallet-table>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import pagination from 'pcComponents/pagination';
import walletTable from 'pcComponents/table/index.vue';
import confirm from 'pcComponents/confirm/confirm.vue';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import { getCancellingStakeList } from 'services/viteServer';

const Vite_Token_Info = constant.Vite_Token_Info;

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
                text: this.$t('walletQuota.list.withdrawTime'),
                cell: 'time'
            } ]
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    time: date(item.expirationTime * 1000, 'zh'),
                    amount: `${ bigNumber.toBasic(item.amount, Vite_Token_Info.decimals) } VITE`
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
            this.getCancellingList();
        },
        show() {
            this.isShow = true;
            this.init();
        },
        close() {
            this.isShow = false;
        },
        getCancellingList(pageIndex = 1) {
            pageIndex = pageIndex - 1;

            getCancellingStakeList(this.address, pageIndex, 10).then(({ count, cancels }) => {
                this.pageIndex = pageIndex;
                this.totalNum = count;
                this.list = cancels || [];
            }).catch(err => {
                console.warn(err);
            });
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
