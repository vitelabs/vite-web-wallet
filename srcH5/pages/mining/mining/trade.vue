<template>
    <div class="trade-mining-section">
        <myIncome class="staking-income-wrapper" :miningTotal="`${miningTotal}`"
                  :title="$t('mobileMining.tradeTotalIncome', {token: 'VX'})">
            <div class="my-dividend">
                <div class="dividend-item" v-for="item in typeList" :key="item.name">
                    <div class="item-title">
                        <img :src="item.icon" /> {{ $t('tradeMining.fee') }}
                        <span>{{ expectedDividends && expectedDividends[item.name] ? expectedDividends[item.name].fee : 0 }}</span>
                    </div>
                    <div class="item-dividend">
                        <span>{{ $t('tradeMining.dividends') }}</span>
                        {{ expectedDividends && expectedDividends[item.name] ? expectedDividends[item.name].dividend : 0 }}VX
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
import walletTable from 'components/table/index.vue';
import noData from 'h5Components/noData';
import listView from 'h5Components/listView.vue';
import { miningTrade, tradeFee } from 'services/trade';
import { getCurrentFeesForMine } from 'services/viteServer';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import myIncome from './myIncome';
import miningTable from './table';
import listTitle from './listTitle.vue';
import viteIcon from 'assets/imgs/vite-dividend.svg';
import ethIcon from 'assets/imgs/eth.svg';
import usdIcon from 'assets/imgs/usd.svg';
import btcIcon from 'assets/imgs/BTC.svg';

const typeList = [ {
    name: 'VITE',
    icon: viteIcon
}, {
    name: 'BTC',
    icon: btcIcon
}, {
    name: 'ETH',
    icon: ethIcon
}, {
    name: 'USDT',
    icon: usdIcon
} ];

export default {
    components: { noData, walletTable, myIncome, miningTable, listView, listTitle },
    props: {
        totalDividend: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            typeList,
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
                    tokenSymbol: 'USDT',
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
                const basicCurrDividens = bigNumber.toBasic(currDividens, 18); // VX decimals
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
        }
    }
};
</script>

<style lang="scss" scoped>
.list-wrapper-view {
    max-height: 450px;
}
.staking-income-wrapper {
    background: url('~h5Assets/imgs/big_bg.png') no-repeat;
    background-size: cover;
}
.my-dividend {
    padding: 15px 14px;
    border-top: 1px dashed rgba(211,223,239,1);
    font-size: 12px;
    line-height: 16px;
    .dividend-item {
        margin-bottom: 16px;
    }
    .item-title {
        color: rgba(62,74,89,0.6);
        margin-bottom: 5px;
        img {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-bottom: -3px;
        }
        span {
            float: right;
        }
    }
    .item-dividend {
        text-align: right;
        color: rgba(62,74,89,0.45);
    }
}
</style>
