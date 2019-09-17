<template>
    <div class="trade-mining-section shadow">
        <div class="my-divident">
            <div class="item" v-for="tokenType in ['VITE', 'BTC', 'ETH', 'USDT']" :key="tokenType">
                <div class="item-title">{{ tokenType }} {{ $t('tradeMining.fee') }}</div>
                <div class="item-price">
                    {{ expectedDividends && expectedDividends[tokenType] ? expectedDividends[tokenType].fee : 0 }}
                </div>
                <div class="item-dividend">
                    <span>{{ $t('tradeMining.dividends') }}</span>
                    {{ expectedDividends && expectedDividends[tokenType] ? expectedDividends[tokenType].dividend : 0 }}VX
                </div>
            </div>
        </div>
        <wallet-table class="mint-trade-table no-shadow tb"
                      :headList="tradeHeadList"
                      :contentList="content">
            <pagination
                slot="tableBottom"
                class="__tb_pagination"
                :currentPage="tradeCurrentPage + 1"
                :toPage="fetchMiningTrade"
                :totalPage="tradeTotalPage"
            ></pagination>
        </wallet-table>
    </div>
</template>

<script>
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination';
import { miningTrade } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';

export default {
    components: { walletTable, pagination },
    props: {
        totalDividend: {
            type: Object,
            default: null
        }
    },
    beforeMount() {
        this.fetchMiningTrade();
        this.fetchTradeFee();
        this.$store.dispatch('getCurrentFeesForMine');
    },
    data() {
        return {
            currentFees: null,
            threshold: null,
            tradeFeeList: [],
            tradeCurrentPage: 0,
            tradeListTotal: 0,
            tradeList: [],
            tradeHeadList: [
                {
                    text: this.$t('tradeMining.tbHead.date'),
                    cell: 'date'
                },
                {
                    text: this.$t('tradeMining.tbHead.fee'),
                    cell: 'fee'
                },
                {
                    text: this.$t('tradeMining.tbHead.mining'),
                    cell: 'mining'
                }
            ]
        };
    },
    watch: {
        address() {
            this.tradeCurrentPage = 0;
            this.tradeListTotal = 0;
            this.tradeList = [];
            this.tradeFeeList = [];
            this.fetchMiningTrade();
            this.fetchTradeFee();
        }
    },
    computed: {
        content() {
            return this.tradeList.map(item => {
                return {
                    date: date(item.date * 1000, this.$i18n.locale),
                    fee: `${ bigNumber.formatNum(item.feeAmount || 0, 8) } ${
                        item.miningToken
                    }`,
                    pledge: `${ bigNumber.formatNum(item.pledgeAmount || 0,
                        8) } VITE`,
                    mining: `${ bigNumber.formatNum(item.miningAmount || 0, 8) } VX`
                };
            });
        },
        tradeTotalPage() {
            return Math.ceil(this.tradeListTotal / 30);
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        expectedDividends() {
            return this.$store.getters.tradeDividends;
        }
    },
    methods: {
        fetchMiningTrade(pageNumber) {
            const offset = pageNumber ? (pageNumber - 1) * 30 : 0;

            miningTrade({
                address: this.address,
                offset
            })
                .then(data => {
                    if (!data) {
                        return;
                    }

                    this.tradeListTotal = data.total || 0;
                    this.tradeCurrentPage = pageNumber ? pageNumber - 1 : 0;
                    this.tradeList = data.miningList || [];
                })
                .catch(err => {
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
@import "~assets/scss/vars.scss";

.my-divident {
    background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
    background-size: 100% 100%;
    font-size: 12px;
    font-family: $font-normal;
    line-height: 18px;
    display: flex;
    flex-direction: row;
    border-radius: 2px;

    .item {
        flex: 1;
        box-sizing: border-box;
        padding: 14px 30px;
        border-right: 1px solid rgba(227,235,245,0.6);
        &:last-child {
            border-right: none;
        }
        .item-title {
            color: rgba(94,104,117,1);
        }
        .item-price {
            font-size: 16px;
            color: rgba(29,32,36,1);
            line-height: 20px;
            font-family: $font-bold;
        }
        .item-dividend {
            color: rgba(94,104,117,0.58);
        }
    }
}
</style>
