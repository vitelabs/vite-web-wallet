<template>
    <confirm class="big" :closeIcon="true"
             :title="$t('tradeTxPairManage.incomeList')">
        <div class="total-income">
            <div class="title"></div>
            <div class="income"></div>
        </div>
        <wallet-table>
            <pagination slot="tableBottom" class="__tb_pagination"
                        :currentPage="currentPage + 1" :toPage="fetchIncomeList"
                        :totalPage="totalPage"></pagination>
        </wallet-table>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination.vue';
import { operatorIncome } from 'services/trade';

export default {
    components: { confirm, walletTable, pagination },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        txPair: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    mounted() {
        this.fetchIncomeList();
    },
    data() {
        return {
            isLoading: false,
            currentPage: 0,
            totalNum: 0
        };
    },
    computed: {
        activeAddr() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.totalNum / 30);
        }
    },
    methods: {
        fetchIncomeList() {
            operatorIncome({
                operatorId: this.activeAddr,
                tradeToken: this.txPair.txPairDetail.tradeToken,
                quoteToken: this.txPair.txPairDetail.quoteToken
                // offset, limit = 30
            }).then(data => {
                this.totalNum = data.total || 0;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.total-income {
    padding: 14px 30px;
    box-sizing: border-box;
    background: rgba(0,122,255,0.05);
    line-height: 16px;
    .title {
        font-size: 12px;
        font-family: font-family-normal();
        color: rgba(94,104,117,1);
    }
    .income {
        font-size: 12px;
        font-family: font-family-bold();
        color: rgba(29,32,36,1);
    }
}
</style>

