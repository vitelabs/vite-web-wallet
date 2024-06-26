<template>
    <div class="trade-mining-section shadow">
        <div class="staking-detail">
            <div class="item" v-for="tokenType in ['VITE', 'BTC', 'ETH', 'USDT']" :key="tokenType">
                <div>{{ $t("orderMining.estimate", { name: tokenType }) }}</div>
                <div class="bold">{{ estimateInfo[tokenType] || '--' }}</div>
            </div>
        </div>
        <wallet-table class="mint-trade-table no-shadow tb" :clickRow="clickRow"
                      :headList="headList" :contentList="content">

            <div class="detail-wrapper" :slot="`${activeIndex}Row`">
                <loading loadingType="dot" class="ex-center-loading" v-show="isLoadingDetail"></loading>
                <div class="err-msg" v-show="errMsg" @click="fetchDetail(content[activeIndex])">{{ errMsg }}</div>
                <div v-show="!isLoadingDetail && !errMsg">
                    <div v-for="(item, i) in orderMiningDetails" :key="i"
                         class="slot-row __tb_row __tb_content_row" >
                        <div class="__tb_cell">{{ $t("orderMining.market", { name: item.quoteType }) }}</div>
                        <div class="__tb_cell">{{ item.ratio }}</div>
                        <div class="__tb_cell">{{ item.mining }}</div>
                    </div>
                </div>
            </div>

            <span v-for="(item, i) in content" :key="i" :slot="`${i}dateAfter`"
                  class="arrow-icon" :class="{'active': activeIndex === i}"></span>
            <span v-for="(item, i) in content" :key="i" :slot="`${i}ratioAfter`"
                  class="arrow-icon" :class="{'active': activeIndex === i}"></span>
            <span v-for="(item, i) in content" :key="i" :slot="`${i}miningAfter`"
                  class="arrow-icon" :class="{'active': activeIndex === i}"></span>

            <pagination slot="tableBottom" class="__tb_pagination"
                        :currentPage="currentPage + 1" :toPage="updateData"
                        :totalPage="taotalPage"></pagination>
        </wallet-table>
    </div>
</template>

<script>
import { getOrderMining, getOrderMiningDetails, getOrderMiningEstimate } from '@services/trade';
import walletTable from '@pc/components/table/index.vue';
import pagination from '@pc/components/pagination.vue';
import loading from '@components/loading.vue';
import bigNumber from '@utils/bigNumber';
import date from '@utils/date';

export default {
    components: { walletTable, pagination, loading },
    data() {
        return {
            currentPage: 0,
            listTotal: 0,
            miningList: [],
            headList: [
                {
                    text: this.$t('orderMining.tbHead.date'),
                    cell: 'date'
                },
                {
                    text: this.$t('orderMining.tbHead.ratio'),
                    cell: 'ratio'
                },
                {
                    text: this.$t('orderMining.tbHead.mining'),
                    cell: 'mining'
                }
            ],

            orderMiningDetails: [],
            activeIndex: null,
            isLoadingDetail: false,
            errMsg: '',

            estimateInfo: {}
        };
    },
    beforeMount() {
        this.updateData();
        this.fetchEstimate();
    },
    watch: {
        address() {
            this.listTotal = 0;
            this.currentPage = 0;
            this.miningList = [];

            this.orderMiningDetails = [];
            this.activeIndex = null;
            this.isLoadingDetail = false;
            this.errMsg = '';

            this.updateData();
            this.fetchEstimate();
        }
    },
    computed: {
        content() {
            return this.miningList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    ratio: `${ bigNumber.multi(item.miningRatio, 100, 2) }%`,
                    mining: `${ bigNumber.formatNum(item.miningAmount || 0, 8) } VX`,
                    cycleKey: item.cycleKey
                };
            });
        },
        taotalPage() {
            return Math.ceil(this.listTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        clickRow(item, index) {
            if (this.activeIndex === index) {
                this.activeIndex = null;
                return;
            }
            this.activeIndex = index;
            this.fetchDetail(item);
        },
        updateData(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            getOrderMining({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.listTotal = data.total || 0;
                this.currentPage = pageNumber ? pageNumber - 1 : 0;
                this.miningList = data.miningList || [];
            }).catch(err => {
                console.warn(err);
            });
        },
        fetchDetail(item) {
            this.isLoadingDetail = true;
            this.errMsg = '';
            this.orderMiningDetails = [];

            const index = this.activeIndex;

            getOrderMiningDetails({
                address: this.address,
                cycleKey: item.cycleKey
            }).then(data => {
                if (index !== this.activeIndex) {
                    return;
                }

                data = data || [];
                data.forEach(item => {
                    item.ratio = `${ bigNumber.multi(item.miningRatio, 100, 2) }%`;
                    item.mining = `${ bigNumber.formatNum(item.miningAmount || 0, 8) } VX`;
                });

                this.errMsg = '';
                this.isLoadingDetail = false;
                this.orderMiningDetails = data;
            }).catch(err => {
                console.warn(err);
                this.errMsg = 'Retry~~';
                this.isLoadingDetail = false;
            });
        },
        fetchEstimate() {
            this.estimateInfo = {};

            getOrderMiningEstimate({ address: this.address }).then(data => {
                if (!data || !data.orderMiningStat) {
                    return;
                }
                const orderMiningStat = data.orderMiningStat;
                for (const tokenName in orderMiningStat) {
                    const amount = orderMiningStat[tokenName];
                    orderMiningStat[tokenName] = `${ bigNumber.formatNum(amount || 0, 8) } VX`;
                }
                this.estimateInfo = data.orderMiningStat;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
@use "../components/stakingDetail.scss";

.detail-wrapper {
    position: relative;
    min-height: 32px;
    [data-theme="0"] & {
        background: rgba(247,249,251,1);
    }
    [data-theme="1"] & {
        background: rgba(1,8,31,0.25);
    }
    .ex-center-loading .dot {
        position: absolute;
    }
    .err-msg {
        line-height: 32px;
        text-align: center;
    }
}
</style>
