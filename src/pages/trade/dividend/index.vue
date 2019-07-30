<template>
    <div class="trade-dividend-wrapper">
        <div class="pool">
            <section-title :title="$t('tradeDividend.poolTitle')"></section-title>
            <pool></pool>
        </div>

        <div class="list-wrapper">
            <section-title :title="$t('tradeDividend.listTitle')"></section-title>
            <div class="content">
                <div class="my-divident">
                    <div class="item">
                        <div class="item-title">{{ $t('tradeDividend.price') }}</div>
                        <div class="item-amount">{{ myFullIncome }}</div>
                    </div>

                    <div class="item __pointer" v-click-outside="hideMyList"  @click.stop="showMyList(tokenType)"
                         v-for="tokenType in ['BTC', 'ETH', 'USD', 'VITE']" :key="tokenType">
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
                        <div class="__tb_cell" v-for="tokenType in ['BTC', 'ETH', 'USD', 'VITE']" :key="tokenType">
                            <div v-for="(item, i) in activeRow[tokenType] ? activeRow[tokenType].tokenDividends : []" :key="i" >
                                {{ item.tokenSymbol + ' ' + formatNum(item.amount, tokenType) }}
                            </div>
                        </div>
                        <div class="__tb_cell"></div>
                    </div>
                    <pagination slot="tableBottom" class="__tb_pagination"
                                :currentPage="currentPage + 1" :toPage="fetchList"
                                :totalPage="totalPage"></pagination>
                </wallet-table>
            </div>
        </div>

        <!--Temporary coming soon alert-->
        <confirm v-show="isShowConfirm" class="small"
                 type="description" :title="$t('tradeDividend.hintTitle')"
                 :close="closeConfirm" :closeIcon="true" :singleBtn="true"
                 :leftBtnTxt="$t('btn.understand')" :leftBtnClick="closeConfirm">
            {{ $t('tradeDividend.comingHint') }}
            <span @click="goLink" class="link __pointer">{{ $t('tradeDividend.more') }}</span>
        </confirm>
    </div>
</template>

<script>
import pool from './pool.vue';
import sectionTitle from '../components/sectionTitle';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination.vue';
import { dividend } from 'services/trade';
import date from 'utils/date';
import bigNumber from 'utils/bigNumber';
import confirm from 'components/confirm/confirm.vue';
import openUrl from 'utils/openUrl';

export default {
    components: { sectionTitle, walletTable, pagination, pool, confirm },
    mounted() {
        this.fetchList();
    },
    data() {
        return {
            isShowMyList: '',
            isShowConfirm: true,
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
                text: `BTC ${ this.$t('tradeDividend.amount') }`,
                cell: 'BTC'
            }, {
                text: `ETH ${ this.$t('tradeDividend.amount') }`,
                cell: 'ETH'
            }, {
                text: `USD ${ this.$t('tradeDividend.amount') }`,
                cell: 'USD'
            }, {
                text: `VITE ${ this.$t('tradeDividend.amount') }`,
                cell: 'VITE'
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
                    USD: dividendStat.USD ? this.formatNum(dividendStat.USD.dividendAmount || 0, 'USD') : 0,
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
            return this.getPrice(this.myDividend);
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
        getPrice(dividendStat) {
            const pre = this.$store.state.env.currency === 'cny' ? '¥' : '$';
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const coin = this.$store.state.env.currency;

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
                USD: 2
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
        closeConfirm() {
            this.isShowConfirm = false;
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
}

.list-wrapper {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 350px;

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
        .my-divident {
            width: 100%;
            background: url('~assets/imgs/mint_pledge_bg.png') rgba(234,248,255,0.2);
            background-size: 100% 100%;
            font-size: 12px;
            line-height: 16px;
            border-bottom: 1px solid rgba(212,222,231,1);
            .item {
                display: inline-block;
                box-sizing: border-box;
                width: 19.9%;
                padding: 14px 30px;
                line-height: 18px;
                border-right: 1px solid rgba(227,235,245,0.6);
                &:last-child {
                    border-right: none;
                }
                .item-title {
                    font-family: $font-normal;
                    font-weight: 400;
                    color: rgba(94,104,117,1);
                }
                .item-amount {
                    position: relative;
                    font-family: $font-bold;
                    font-weight: 600;
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
            }
        }
        .tb {
            flex: 1;
            box-shadow: none;
        }
    }

    .item-content {
        position: absolute;
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
.link {
    color: #007aff;
    text-decoration: underline;
}
</style>
