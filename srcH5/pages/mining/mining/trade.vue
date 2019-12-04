<template>
    <div class="trade-mining-section">
        <myIncome class="staking-income-wrapper" :total="`${miningTotal}`"
                  :isShowHelp="true" :helpTips="$t('tradeMining.help')"
                  :title="$t('mobileMining.tradeTotalIncome', {token: 'VX'})">
            <div class="amount-detail">
                <div class="amount-detail-item" v-for="item in typeList" :key="item.name">
                    <div class="item-title">
                        <img :src="item.h5Icon" /> {{ $t('tradeMining.fee') }}
                        <span>
                            {{ expectedDividends && expectedDividends[item.name] ? expectedDividends[item.name].fee : 0 }}
                            {{ item.name }}
                        </span>
                    </div>
                    <div class="item-dividend">
                        <span>{{ $t('tradeMining.dividends') }}</span>
                        {{ expectedDividends && expectedDividends[item.name] ? expectedDividends[item.name].dividend : 0 }}
                        VX
                    </div>
                </div>
            </div>
        </myIncome>
        <list-title></list-title>
        <list-view v-show="content && content.length" class="list-wrapper-view" :reachEnd="reachEnd">
            <mining-table slot="content" :headList="tradeHeadList" :contentList="content"></mining-table>
        </list-view>
        <no-data v-show="!content || !content.length"></no-data>
    </div>
</template>

<script>
import { miningTrade } from 'services/trade';
import noData from 'h5Components/noData';
import listView from 'h5Components/listView.vue';
import myIncome from 'h5Components/myIncome/index';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import miningTable from './table';
import listTitle from './listTitle.vue';

export default {
    components: { noData, myIncome, miningTable, listView, listTitle },
    props: {
        totalDividend: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            currentFees: null,
            tradeFeeList: [],
            isInit: false,
            miningTotal: 0,
            tradeCurrentPage: 0,
            tradeListTotal: 0,
            tradeList: [],
            tradeHeadList: [
                {
                    text: this.$t('mobileMining.fee'),
                    cell: 'fee'
                },
                { cell: 'amount' },
                { cell: 'date' }
            ]
        };
    },
    beforeMount() {
        this.$store.dispatch('getCurrentFeesForMine');
        this.fetchMiningTrade();
        this.fetchTradeFee();
    },
    watch: {
        address() {
            this.tradeCurrentPage = 0;
            this.tradeListTotal = 0;
            this.tradeList = [];
            this.isInit = false;
            this.fetchMiningTrade();
            this.fetchTradeFee();
        }
    },
    computed: {
        typeList() {
            return this.$store.state.exchangeMine.showTypeList;
        },
        content() {
            return this.tradeList.map(item => {
                let decimals = 8;
                if (item.miningToken === 'VITE') {
                    decimals = 6;
                }
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, decimals) } ${ item.miningToken }`,
                    amount: {
                        amount: `${ bigNumber.formatNum(item.miningAmount || 0, 6) }`,
                        token: 'VX'
                    }
                };
            });
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        expectedDividends() {
            return this.$store.getters.tradeDividends;
        }
    },
    methods: {
        reachEnd() {
            this.fetchMiningTrade(this.tradeCurrentPage + 1);
        },
        fetchMiningTrade(pageNumber) {
            const offset = (pageNumber || 0) * 30;
            if (this.isInit && offset >= this.tradeListTotal) {
                return;
            }

            miningTrade({
                address: this.address,
                offset
            }).then(data => {
                if (!data) {
                    return;
                }

                this.miningTotal = data.miningTotal || 0;
                this.tradeListTotal = data.total || 0;
                this.tradeCurrentPage = pageNumber || 0;
                const list = data.miningList || [];
                this.tradeList = [].concat(this.tradeList, list);
                this.isInit = true;
            }).catch(err => {
                console.warn(err);
            });
        },
        fetchTradeFee() {
            this.$store.dispatch('getAllFeesOfAddress');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Components/myIncome/amountDetail.scss";

.list-wrapper-view {
    max-height: 450px;
}
</style>
