<template>
    <div class="trade-mining-section">
        <div class="fee-title">
            {{ $t('tradeMining.todayTrade') }}
            <span class="link __pointer" @click="goView">{{ $t('tradeMining.view') }}</span>
        </div>

        <div class="my-divident">
            <div class="item" v-for="tokenType in ['VITE', 'BTC', 'ETH', 'USD']" :key="tokenType">
                <div class="item-title">{{ tokenType }}</div>
                <div class="item-price">
                    <div>
                        <span>{{ $t('tradeMining.fee') }}</span>
                        {{ expectedDividends && expectedDividends[tokenType] ? expectedDividends[tokenType].fee : 0 }} {{ tokenType }}
                    </div>
                    <div class="dividend">
                        <span>{{ $t('tradeMining.dividends') }}</span>
                        {{ expectedDividends && expectedDividends[tokenType] ? expectedDividends[tokenType].dividend : 0 }} VX
                    </div>
                </div>
            </div>
        </div>

        <wallet-table class="mint-trade-table content tb"
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
import { getCurrentFeesForMine } from 'services/viteServer';
import { miningTrade, tradeFee } from 'services/trade';
import bigNumber from 'utils/bigNumber';
import date from 'utils/date';
import openUrl from 'utils/openUrl';

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
        this.getCurrentFeesForMine();
    },
    data() {
        return {
            currentFees: null,
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
            if (!this.currentFees || !this.totalDividend || !this.tradeFeeList || !this.tradeFeeList.length) {
                return null;
            }

            const typeList = {
                1: {
                    tokenSymbol: 'VITE',
                    decimals: 18
                },
                2: {
                    tokenSymbol: 'ETH',
                    decimals: 18
                },
                3: {
                    tokenSymbol: 'BTC',
                    decimals: 8
                },
                4: {
                    tokenSymbol: 'USD',
                    decimals: 6
                }
            };
            const dividends = {};
            this.tradeFeeList.forEach(tradeFee => {
                const quoteType = tradeFee.quoteType;
                const decimals = typeList[quoteType].decimals;
                const symbol = typeList[quoteType].tokenSymbol;

                const currFee = this.currentFees[quoteType] || 0;
                const currDividens = this.totalDividend[quoteType] || 0;

                const basicCurrFee = bigNumber.toBasic(currFee, decimals);
                const basicCurrDividens = bigNumber.toBasic(currDividens, decimals);
                const percent = +basicCurrFee ? bigNumber.dividedToNumber(tradeFee.amount, basicCurrFee, 8) : 0;

                dividends[symbol] = {
                    fee: tradeFee.amount,
                    dividend: bigNumber.multi(basicCurrDividens, percent)
                };
            });

            return dividends;
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
            tradeFee({ address: this.address }).then(data => {
                if (!data) {
                    return;
                }

                this.tradeFeeList = data || [];
            })
                .catch(err => {
                    console.warn(err);
                });
        },
        getCurrentFeesForMine() {
            getCurrentFeesForMine().then(data => {
                this.currentFees = data || null;
            }).catch(err => {
                console.warn(err);
            });
        },
        goView() {
            openUrl('https://vitex.net/');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.fee-title {
    font-size: 13px;
    color: rgba(94, 104, 117, 0.8);
    line-height: 30px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    .link {
        color: #007aff;
        margin-left: 10px;
    }
}

.my-divident {
    background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
    background-size: 100% 100%;
    font-size: 12px;
    font-family: $font-normal;
    line-height: 16px;
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
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
            margin-bottom: 2px;
        }
        .item-price {
            color: rgba(29,32,36,1);
            margin-top: 2px;
        }
    }
}
</style>
