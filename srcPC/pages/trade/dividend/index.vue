<template>
    <div class="trade-dividend-wrapper">
        <section-title
            class="top-title"
            :title="$t('tradeDividend.poolTitle')"
        ></section-title>
        <pool></pool>
        <section-title
            :title="$t('tradeDividend.listTitle')"
            :help="$t('tradeDividend.help')"
        ></section-title>
        <div class="content">
            <div class="staking-detail">
                <div class="item">
                    <div>{{ $t('tradeDividend.price') }}</div>
                    <div class="bold">{{ myFullBtcIncome }}</div>
                    <div class="light">{{ myFullIncome }}</div>
                </div>

                <div
                    class="item __pointer"
                    v-click-outside="hideMyList"
                    @click.stop="showMyList(tokenType)"
                    v-for="tokenType in ['BTC', 'ETH', 'USDT']"
                    :key="tokenType"
                >
                    <div>{{ tokenType }}</div>
                    <div class="bold">
                        {{
                            myDividend[tokenType]
                                ? formatNum(
                                    myDividend[tokenType].dividendAmount,
                                    tokenType
                                )
                                : 0
                        }}
                        <span
                            v-show="isShowMyDividendList(tokenType)"
                            class="down-icon"
                        ></span>
                        <div
                            class="item-content"
                            v-show="
                                isShowMyDividendList(tokenType) &&
                                    isShowMyList === tokenType
                            "
                        >
                            <div
                                class="row"
                                v-for="(dividentItem, i) in getMyList(
                                    tokenType
                                )"
                                :key="i"
                            >
                                <span class="light"
                                >{{ dividentItem.tokenSymbol }}:
                                </span>
                                <span class="amount">{{
                                    formatNum(dividentItem.amount, tokenType)
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <locking></locking>

            <wallet-table
                class="dividend-table tb"
                :clickRow="clickRow"
                :headList="headList"
                :contentList="contentList"
            >
                <div
                    class="slot-row __tb_row __tb_content_row"
                    v-if="activeRow"
                    :slot="`${activeIndex}Row`"
                >
                    <div class="__tb_cell"></div>
                    <div class="__tb_cell"></div>
                    <div
                        class="__tb_cell"
                        v-for="tokenType in ['BTC', 'ETH', 'USDT']"
                        :key="tokenType"
                    >
                        <div
                            v-for="(item, i) in activeRow[tokenType]
                                ? activeRow[tokenType].tokenDividends
                            : []"
                            :key="i"
                        >
                            {{
                                item.tokenSymbol +
                                    ' ' +
                                    formatNum(item.amount, tokenType)
                            }}
                        </div>
                    </div>
                    <div class="__tb_cell"></div>
                </div>

                <span
                    v-for="(item, i) in contentList"
                    :key="i"
                    :slot="`${i}BTCAfter`"
                    class="arrow-icon"
                    :class="{ active: activeIndex === i }"
                ></span>
                <span
                    v-for="(item, i) in contentList"
                    :key="i"
                    :slot="`${i}ETHAfter`"
                    class="arrow-icon"
                    :class="{ active: activeIndex === i }"
                ></span>
                <span
                    v-for="(item, i) in contentList"
                    :key="i"
                    :slot="`${i}USDTAfter`"
                    class="arrow-icon"
                    :class="{ active: activeIndex === i }"
                ></span>

                <pagination
                    slot="tableBottom"
                    class="__tb_pagination"
                    :currentPage="currentPage + 1"
                    :toPage="fetchList"
                    :totalPage="totalPage"
                ></pagination>
            </wallet-table>
        </div>
    </div>
</template>

<script>
import pool from './pool.vue';
import walletTable from 'pcComponents/table/index.vue';
import pagination from 'pcComponents/pagination.vue';
import { dividend } from 'services/trade';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import openUrl from 'utils/openUrl';
import sectionTitle from './sectionTitle';
import locking from './locking';

export default {
    components: { sectionTitle, walletTable, pagination, pool, locking },
    mounted() {
        this.fetchList();
    },
    data() {
        return {
            isShowMyList: '',
            currentPage: 0,
            totalNum: 0,

            myDividend: {},
            list: [],
            activeIndex: null
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        totalPage() {
            return Math.ceil(this.totalNum / 30);
        },

        headList() {
            return [
                {
                    text: this.$t('tradeDividend.date'),
                    cell: 'date'
                },
                {
                    text: this.$t('tradeDividend.VX'),
                    cell: 'vxQuantity'
                },
                {
                    text: `BTC ${ this.$t('tradeDividend.amount') }`,
                    cell: 'BTC'
                },
                {
                    text: `ETH ${ this.$t('tradeDividend.amount') }`,
                    cell: 'ETH'
                },
                {
                    text: `USDT ${ this.$t('tradeDividend.amount') }`,
                    cell: 'USDT'
                },
                {
                    text: this.$t('tradeDividend.price'),
                    cell: 'price'
                }
            ];
        },
        contentList() {
            const list = [];

            this.list.forEach(item => {
                const dividendStat = item.dividendStat || {};

                list.push({
                    date: date(item.date * 1000, this.$i18n.locale),
                    vxQuantity: bigNumber.formatNum(item.vxQuantity, 4),
                    ETH: dividendStat.ETH
                        ? this.formatNum(dividendStat.ETH.dividendAmount || 0,
                            'ETH')
                        : 0,
                    VITE: dividendStat.VITE
                        ? this.formatNum(dividendStat.VITE.dividendAmount || 0,
                            'VITE')
                        : 0,
                    BTC: dividendStat.BTC
                        ? this.formatNum(dividendStat.BTC.dividendAmount || 0,
                            'BTC')
                        : 0,
                    USDT: dividendStat.USDT
                        ? this.formatNum(dividendStat.USDT.dividendAmount || 0,
                            'USDT')
                        : 0,
                    price: this.getPrice(dividendStat)
                });
            });
            return list;
        },
        activeRow() {
            if (this.activeIndex === null) {
                return null;
            }

            return this.list[this.activeIndex]
                && this.list[this.activeIndex].dividendStat
                ? this.list[this.activeIndex].dividendStat
                : {};
        },
        myFullIncome() {
            return `≈${ this.getPrice(this.myDividend) }`;
        },
        myFullBtcIncome() {
            const btcIncome = this.getPriceNum(this.myDividend, 'btc');
            return `${ this.formatNum(btcIncome, 'BTC') } BTC`;
        }
    },
    watch: {
        address() {
            this.fetchList();
        },
        myDividend() {
            const tokenIds = [];
            for (const symbol in this.myDividend) {
                const list
                    = this.myDividend[symbol]
                    && this.myDividend[symbol].tokenDividends
                        ? this.myDividend[symbol].tokenDividends
                        : [];
                list.forEach(({ tokenId }) => {
                    tokenIds.push(tokenId);
                });
            }
            this.$store.dispatch('addRateTokens', tokenIds);
        }
    },
    methods: {
        getPriceNum(dividendStat, coin) {
            coin = coin || this.$store.state.env.currency;
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            let income = 0;
            for (const symbol in dividendStat) {
                const list
                    = dividendStat[symbol] && dividendStat[symbol].tokenDividends
                        ? dividendStat[symbol].tokenDividends
                        : [];
                list.forEach(({ tokenId, amount }) => {
                    const rate = rateList[tokenId]
                        ? rateList[tokenId][`${ coin }Rate`] || 0
                        : 0;
                    amount = bigNumber.multi(amount || 0, rate || 0);
                    income = bigNumber.plus(income, amount);
                });
            }
            return income;
        },
        getPrice(dividendStat) {
            const coin = this.$store.state.env.currency;
            const pre = this.$store.getters.currencySymbol;
            const income = this.getPriceNum(dividendStat, coin);
            return `${ pre }${ bigNumber.formatNum(income, 2) }`;
        },
        isShowMyDividendList(tokenType) {
            return (
                this.myDividend[tokenType]
                && this.myDividend[tokenType].tokenDividends
                && this.myDividend[tokenType].tokenDividends.length
            );
        },
        clickRow(item, index) {
            if (this.activeIndex === index) {
                this.activeIndex = null;
                return;
            }
            this.activeIndex = index;
        },
        formatNum(amount, tokenSymbol) {
            const map = {
                BTC: 8,
                ETH: 8,
                VITE: 4,
                USDT: 2
            };
            return bigNumber.formatNum(amount,
                tokenSymbol ? map[tokenSymbol] : 8);
        },

        showMyList(tokenType) {
            this.isShowMyList = tokenType;
        },
        hideMyList() {
            this.isShowMyList = '';
        },
        getMyList(tokenType) {
            return this.myDividend[tokenType]
                ? this.myDividend[tokenType].tokenDividends || []
                : [];
        },

        fetchList(pageNum) {
            const offset = pageNum ? (pageNum - 1) * 30 : 0;

            dividend({
                address: this.address,
                offset
            })
                .then(data => {
                    this.totalNum = data ? data.total || 0 : 0;
                    this.currentPage = pageNum ? pageNum - 1 : 0;
                    this.myDividend = data ? data.dividendStat || {} : {};
                    this.list = data ? data.dividendList || [] : [];
                })
                .catch(err => {
                    console.warn(err);
                    this.myDividend = {};
                    this.list = [];
                });
        },
        goLink() {
            openUrl('https://docs.vite.org/go-vite/dex/#vx-holder-dividends');
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';
@import '~pcAssets/scss/table.scss';
@import '../components/stakingDetail.scss';

.trade-dividend-wrapper {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    .top-title {
        padding-top: 4px;
    }
}

.content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    @include box_shadow();
    .tb {
        flex: 1;
        box-shadow: none;
    }
}

.link {
    color: $blue-color-1;
    text-decoration: underline;
}
</style>
