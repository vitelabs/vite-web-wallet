<template>
    <div class="trade-dividend-wrapper">
        <pool></pool>

        <div class="my-divident">
            <div class="item">
                <div class="item-title">{{ $t('mobileDividend.myDividendTitle', { token: 'BTC' }) }}</div>
                <div class="item-amount">{{ myFullBtcIncome }}</div>
                <div class="item-price">{{ myFullIncome }}</div>
            </div>

            <div class="item my-dividend-token">
                <div class="small-amount" v-for="tokenType in ['BTC', 'ETH', 'USDT']" :key="tokenType">
                    {{ myDividend[tokenType] ? formatNum(myDividend[tokenType].dividendAmount, tokenType) : 0 }} {{ tokenType }}
                </div>
            </div>
        </div>

        <locking></locking>

        <div class="list-wrapper">
            <div class="list-title">{{ $t('mobileDividend.listTitle') }}</div>
            <list-view class="list-wrapper-view" :reachEnd="reachEnd">
                <div slot="content">
                    <div class="list-item" v-show="contentList && contentList.length"
                         v-for="(item, i) in contentList" :key="i">
                        <span class="small-item big">{{ item.date }}</span>
                        <span class="small-item big"><span class="vx-amount">{{ item.vxQuantity }}</span> VX</span>
                        <span class="small-item">{{ item.BTC }} BTC</span>
                        <span class="small-item">{{ item.ETH }} ETH</span>
                        <span class="small-item">{{ item.USDT }} USDT</span>
                    </div>
                </div>
            </list-view>
            <no-data v-show="!contentList || !contentList.length"></no-data>
        </div>
    </div>
</template>

<script>
import pool from './pool.vue';
import locking from './locking.vue';
import { dividend } from 'services/trade';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import listView from 'h5Components/listView.vue';
import noData from 'h5Components/noData';

export default {
    components: { noData, pool, listView, locking },
    mounted() {
        this.fetchList();
    },
    data() {
        return {
            isInit: false,
            currentPage: 0,
            totalNum: 0,
            myDividend: {},
            list: []
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
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
        myFullIncome() {
            return `≈${ this.getPrice(this.myDividend) }`;
        },
        myFullBtcIncome() {
            const btcIncome = this.getPriceNum(this.myDividend, 'btc');
            return `${ this.formatNum(btcIncome, 'BTC') }`;
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
        formatNum(amount, tokenSymbol) {
            const map = {
                BTC: 8,
                ETH: 8,
                VITE: 4,
                USDT: 2
            };
            return bigNumber.formatNum(amount, tokenSymbol ? map[tokenSymbol] : 8);
        },

        reachEnd() {
            this.fetchList(this.currentPage + 1);
        },
        fetchList(pageNum) {
            const offset = (pageNum || 0) * 30;
            if (this.isInit && offset >= this.totalNum) {
                return;
            }

            dividend({
                address: this.address,
                offset
            }).then(data => {
                this.totalNum = data ? data.total || 0 : 0;
                this.currentPage = pageNum || 0;
                this.myDividend = data ? data.dividendStat || {} : {};
                const list = data ? data.dividendList || [] : [];
                this.list = [].concat(this.list, list);
                this.isInit = true;
            }).catch(err => {
                console.warn(err);
                this.myDividend = {};
                this.list = [];
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.trade-dividend-wrapper {
    font-size: 12px;
    @include font-normal();
    padding: 18px 24px;
}

.my-divident {
    background: rgba(0,122,255,0.06);
    border-radius: 2px;
    line-height: 16px;
    margin: 14px 0;
    .item {
        padding: 14px;
        &:first-child {
            border-bottom: 1px dashed rgba(211,223,239,1);
        }
        .item-title {
            color: rgba(62, 74, 89, 0.3);
            line-height: 26px;
        }
        .item-amount {
            font-size: 24px;
            @include font-bold();
            line-height: 30px;
            color: rgba(36, 39, 43, 1);
            margin-bottom: 6px;
        }
        .item-price {
            line-height: 18px;
            color: rgba(36, 39, 43, 1)
        }
    }

    .my-dividend-token {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-bottom: 0;

        .small-amount {
            width: 50%;
            white-space: nowrap;
            color: rgba(62,74,89,0.6);
            line-height: 16px;
            margin-bottom: 14px;
        }
    }
}

.list-wrapper {
    @include font-normal();
    color: rgba(62,74,89,0.6);
    .list-wrapper-view {
        max-height: 450px;
    }
    .list-item {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        border-bottom: 1px solid rgba(211,223,239,1);
        margin-bottom: 15px;
        .small-item {
            display: inline-block;
            width: 50%;
            font-size: 12px;
            line-height: 16px;
            margin-bottom: 10px;
            &:nth-child(2n) {
                text-align: right;
            }
            &.big {
                font-size: 14px;
                line-height: 18px;
                white-space: nowrap;
            }
            .vx-amount {
                @include font-bold();
                font-size: 16px;
                line-height: 20px;
                color: rgba(36,39,43,1);
            }
        }
    }

    .list-title {
        line-height: 20px;
        margin-bottom: 14px;
        font-size: 14px;
        @include font-bold();
        color: rgba(62,74,89,1);
    }
    .no-data {
        color: rgba(62, 74, 89, 0.3);
        text-align: center;
    }
}
</style>
