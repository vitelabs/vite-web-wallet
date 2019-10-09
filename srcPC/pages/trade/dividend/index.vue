<template>
    <div class="trade-dividend-wrapper">
        <section-title class="top-title" :title="$t('tradeDividend.poolTitle')"></section-title>
        <pool></pool>
        <section-title :title="$t('tradeDividend.listTitle')" :help="$t('tradeDividend.help')"></section-title>
        <div class="content">
            <div class="my-divident">
                <div class="item">
                    <div class="item-title">{{ $t('tradeDividend.price') }}</div>
                    <div class="item-amount">{{ myFullBtcIncome }}</div>
                    <div class="item-price">{{ myFullIncome }}</div>
                </div>

                <div class="item __pointer" v-click-outside="hideMyList"  @click.stop="showMyList(tokenType)"
                     v-for="tokenType in ['VITE', 'BTC', 'ETH', 'USDT']" :key="tokenType">
                    <div class="item-title">{{ tokenType }}</div>
                    <div class="item-amount">
                        {{ myDividend[tokenType] ? formatNum(myDividend[tokenType].dividendAmount, tokenType) : 0 }}
                        <span v-show="isShowMyDividendList(tokenType)" class="down-icon"></span>
                        <div class="item-content" v-show="isShowMyDividendList(tokenType) && isShowMyList === tokenType">
                            <div class="row" v-for="(dividentItem, i) in getMyList(tokenType)" :key="i">
                                <span class="symbol">{{ dividentItem.tokenSymbol }}: </span>
                                <span class="amount">{{ formatNum(dividentItem.amount, tokenType) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <wallet-table class="dividend-table tb" :clickRow="clickRow"
                          :headList="headList" :contentList="contentList">
                <div class="slot-row __tb_row __tb_content_row" v-if="activeRow" :slot="`${activeIndex}Row`">
                    <div class="__tb_cell"></div>
                    <div class="__tb_cell"></div>
                    <div class="__tb_cell" v-for="tokenType in ['VITE', 'BTC', 'ETH', 'USDT']" :key="tokenType">
                        <div v-for="(item, i) in activeRow[tokenType] ? activeRow[tokenType].tokenDividends : []" :key="i" >
                            {{ item.tokenSymbol + ' ' + formatNum(item.amount, tokenType) }}
                        </div>
                    </div>
                    <div class="__tb_cell"></div>
                </div>

                <span v-for="(item, i) in contentList" :key="i" :slot="`${i}VITEAfter`"
                      class="arrow-icon" :class="{'active': activeIndex === i}"></span>
                <span v-for="(item, i) in contentList" :key="i" :slot="`${i}BTCAfter`"
                      class="arrow-icon" :class="{'active': activeIndex === i}"></span>
                <span v-for="(item, i) in contentList" :key="i" :slot="`${i}ETHAfter`"
                      class="arrow-icon" :class="{'active': activeIndex === i}"></span>
                <span v-for="(item, i) in contentList" :key="i" :slot="`${i}USDTAfter`"
                      class="arrow-icon" :class="{'active': activeIndex === i}"></span>

                <pagination slot="tableBottom" class="__tb_pagination"
                            :currentPage="currentPage + 1" :toPage="fetchList"
                            :totalPage="totalPage"></pagination>
            </wallet-table>
        </div>
    </div>
</template>

<script>
import pool from './pool.vue';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination.vue';
import { dividend } from 'services/trade';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import openUrl from 'utils/openUrl';
import sectionTitle from './sectionTitle';

export default {
    components: { sectionTitle, walletTable, pagination, pool },
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
            return [ {
                text: this.$t('tradeDividend.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeDividend.VX'),
                cell: 'vxQuantity'
            }, {
                text: `VITE ${ this.$t('tradeDividend.amount') }`,
                cell: 'VITE'
            }, {
                text: `BTC ${ this.$t('tradeDividend.amount') }`,
                cell: 'BTC'
            }, {
                text: `ETH ${ this.$t('tradeDividend.amount') }`,
                cell: 'ETH'
            }, {
                text: `USDT ${ this.$t('tradeDividend.amount') }`,
                cell: 'USDT'
            }, {
                text: this.$t('tradeDividend.price'),
                cell: 'price'
            } ];
        },
        contentList() {
            const list = [];

            this.list.forEach(item => {
                const dividendStat = item.dividendStat || {};

                list.push({
                    date: date(item.date * 1000, this.$i18n.locale),
                    vxQuantity: bigNumber.formatNum(item.vxQuantity, 4),
                    ETH: dividendStat.ETH ? this.formatNum(dividendStat.ETH.dividendAmount || 0, 'ETH') : 0,
                    VITE: dividendStat.VITE ? this.formatNum(dividendStat.VITE.dividendAmount || 0, 'VITE') : 0,
                    BTC: dividendStat.BTC ? this.formatNum(dividendStat.BTC.dividendAmount || 0, 'BTC') : 0,
                    USDT: dividendStat.USDT ? this.formatNum(dividendStat.USDT.dividendAmount || 0, 'USDT') : 0,
                    price: this.getPrice(dividendStat)
                });
            });
            return list;
        },
        activeRow() {
            if (this.activeIndex === null) {
                return null;
            }

            return this.list[this.activeIndex] && this.list[this.activeIndex].dividendStat
                ? this.list[this.activeIndex].dividendStat : {};
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
                const list = this.myDividend[symbol] && this.myDividend[symbol].tokenDividends
                    ? this.myDividend[symbol].tokenDividends : [];
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
                const list = dividendStat[symbol] && dividendStat[symbol].tokenDividends
                    ? dividendStat[symbol].tokenDividends : [];
                list.forEach(({ tokenId, amount }) => {
                    const rate = rateList[tokenId] ? rateList[tokenId][`${ coin }Rate`] || 0 : 0;
                    amount = bigNumber.multi(amount || 0, rate || 0);
                    income = bigNumber.plus(income, amount);
                });
            }
            return income;
        },
        getPrice(dividendStat) {
            const coin = this.$store.state.env.currency;
            const pre = coin === 'cny' ? '¥' : '$';
            const income = this.getPriceNum(dividendStat, coin);
            return `${ pre }${ bigNumber.formatNum(income, 2) }`;
        },
        isShowMyDividendList(tokenType) {
            return this.myDividend[tokenType]
                && this.myDividend[tokenType].tokenDividends
                && this.myDividend[tokenType].tokenDividends.length;
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
            return bigNumber.formatNum(amount, tokenSymbol ? map[tokenSymbol] : 8);
        },

        showMyList(tokenType) {
            this.isShowMyList = tokenType;
        },
        hideMyList() {
            this.isShowMyList = '';
        },
        getMyList(tokenType) {
            return this.myDividend[tokenType] ? this.myDividend[tokenType].tokenDividends || [] : [];
        },

        fetchList(pageNum) {
            const offset = pageNum ? (pageNum - 1) * 30 : 0;

            dividend({
                address: this.address,
                offset
            }).then(data => {
                this.totalNum = data ? data.total || 0 : 0;
                this.currentPage = pageNum ? pageNum - 1 : 0;
                this.myDividend = data ? data.dividendStat || {} : {};
                this.list = data ? data.dividendList || [] : [];
            }).catch(err => {
                console.warn(err);
                this.myDividend = {};
                this.list = [];
            });
        },
        goLink() {
            if (this.$i18n.locale === 'zh') {
                openUrl('https://dex.vite.wiki/zh/dex/#vx-%E6%89%8B%E7%BB%AD%E8%B4%B9%E5%88%86%E7%BA%A2');
            }
            openUrl('https://dex.vite.wiki/dex/#vx-holder-dividends');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "~assets/scss/table.scss";

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
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    .my-divident {
        background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
        background-size: 100% 100%;
        font-size: 12px;
        font-family: $font-normal;
        line-height: 16px;
        display: flex;
        flex-direction: row;

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
            .item-amount {
                font-size: 16px;
                position: relative;
                font-family: $font-bold;
                line-height: 20px;
                color: rgba(29,32,36,1);
                .down-icon {
                    display: inline-block;
                    background: url('~assets/imgs/dividendInfo.svg');
                    background-size: 100% 100%;
                    width: 16px;
                    height: 16px;
                    margin-bottom: -4px;
                }
            }
            .item-price {
                color: rgba(94,104,117,0.58);
                margin-top: 2px;
            }
        }
    }
    .tb {
        flex: 1;
        box-shadow: none;
    }
}

.item-content {
    position: absolute;
    margin-top: 10px;
    width: 200px;
    padding: 8px 12px 0;
    background: #fff;
    box-shadow: 0px 5px 20px 0px rgba(176,192,237,0.4);
    border-radius: 2px;
    z-index: 1;
    .row {
        line-height: 15px;
        margin-bottom: 8px;
        font-size: 11px;
        font-family: $font-normal;
        font-weight: 400;
        .symbol {
            color: rgba(94,104,117,0.58);
        }
        .amount {
            color: rgba(29,32,36,1);
        }
    }
    &:before {
        top: -12px;
        position: absolute;
        content: ' ';
        display: inline-block;
        border: 6px solid transparent;
        border-bottom: 6px solid #fff;
    }
}

.slot-row {
    background: rgba(247,249,251,1);
    font-size: 12px;
    font-family: $font-normal;
    font-weight: 400;
    color: rgba(94,104,117,1);
    line-height: 16px;
    .item {
        display: inline-block;
    }
    &.__tb_row.__tb_content_row {
        height: unset;
        &:hover {
            background: rgba(247,249,251,1);
        }
    }
}
.arrow-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url("~assets/imgs/decend.svg") center no-repeat;
    margin-bottom: -4px;
    &.active {
        background: url("~assets/imgs/ascend.svg") center no-repeat;
    }
}
.link {
    color: #007aff;
    text-decoration: underline;
}
</style>
