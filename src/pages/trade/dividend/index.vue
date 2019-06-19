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
                        <div class="item-amount">0</div>
                    </div>

                    <div class="item __pointer" v-click-outside="hideMyList"  @click.stop="showMyList(tokenType)"
                         v-for="tokenType in ['BTC', 'ETH', 'USD', 'VITE']" :key="tokenType">
                        <div class="item-title">{{ tokenType }}</div>
                        <div class="item-amount">
                            {{ myDividend[tokenType] ? myDividend[tokenType].dividendAmount : 0 }}
                            <span v-show="myDividend[tokenType] && myDividend[tokenType].tokenDividends && myDividend[tokenType].tokenDividends.length" class="down-icon"></span>
                            <div class="item-content" v-show="isShowMyList === tokenType">
                                <div class="row" v-for="(dividentItem, i) in getMyList(tokenType)" :key="i">
                                    <span class="symbol">{{ dividentItem.tokenSymbol }}: </span>
                                    <span class="amount">{{ dividentItem.amount }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <wallet-table class="tb" :clickRow="clickRow"
                              :headList="headList" :contentList="contentList">
                    <div class="slot-row" v-if="activeRow" :slot="`${activeIndex}Row`">
                        <div class="item"></div>
                        <div class="item"></div>
                        <div class="item" v-for="tokenType in ['BTC', 'ETH', 'USD', 'VITE']" :key="tokenType">
                            <div v-for="(item, i) in activeRow[tokenType].tokenDividends" :key="i" >
                                {{ item.tokenSymbol + ' ' + item.amount }}
                            </div>
                        </div>
                        <div class="item"></div>
                    </div>
                    <pagination slot="tableBottom" class="__tb_pagination"
                                :currentPage="currentPage + 1" :toPage="fetchList"
                                :totalPage="totalPage"></pagination>
                </wallet-table>
            </div>
        </div>
    </div>
</template>

<script>
import pool from './pool.vue';
import sectionTitle from '../components/sectionTitle';
import walletTable from 'components/table/index.vue';
import pagination from 'components/pagination.vue';
import { dividend } from 'services/trade';
import date from 'utils/date';

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
            return parseInt(this.totalNum / 30);
        },

        headList() {
            return [ {
                text: this.$t('tradeDividend.date'),
                cell: 'date'
            }, {
                text: this.$t('tradeDividend.VX'),
                cell: 'vxQuantity'
            }, {
                text: `ETH ${ this.$t('tradeDividend.amount') }`,
                cell: 'ETH'
            }, {
                text: `VITE ${ this.$t('tradeDividend.amount') }`,
                cell: 'VITE'
            }, {
                text: `BTC ${ this.$t('tradeDividend.amount') }`,
                cell: 'BTC'
            }, {
                text: `USD ${ this.$t('tradeDividend.amount') }`,
                cell: 'USD'
            }, {
                text: this.$t('tradeDividend.price'),
                cell: 'price'
            } ];
        },
        contentList() {
            const list = [];
            this.list.forEach(item => {
                list.push({
                    date: date(item.date * 1000, 'zh'),
                    vxQuantity: item.vxQuantity,
                    ETH: item.ETH ? item.ETH.dividendAmount || 0 : 0,
                    VITE: item.VITE ? item.VITE.dividendAmount || 0 : 0,
                    BTC: item.BTC ? item.BTC.dividendAmount || 0 : 0,
                    USD: item.USD ? item.USD.dividendAmount || 0 : 0,
                    price: 0
                });
            });
            return list;
        },
        activeRow() {
            if (this.activeIndex === null) {
                return null;
            }
            return this.list[this.activeIndex];
        }
    },
    watch: {
        address() {
            this.fetchList();
        }
    },
    methods: {
        clickRow(item, index) {
            if (this.activeIndex === index) {
                this.activeIndex = null;
                return;
            }
            this.activeIndex = index;
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
            const offset = pageNum ? pageNum + 1 : 0;

            dividend({
                address: this.address,
                offset
            }).then(data => {
            // const data = {
            //     'dividendStat': {
            //         'BTC': {
            //             'dividendAmount': '10',
            //             'tokenDividends': [
            //                 {
            //                     'tokenSymbol': 'BTC-000',
            //                     'amount': '2.222'
            //                 }
            //             ]
            //         },
            //         'ETH': {
            //             'dividendAmount': '10',
            //             'tokenDividends': [
            //                 {
            //                     'tokenSymbol': 'ETH-000',
            //                     'amount': '2.222'
            //                 }
            //             ]
            //         },
            //         'VITE': {
            //             'dividendAmount': '10',
            //             'tokenDividends': [
            //                 {
            //                     'tokenSymbol': 'VITE',
            //                     'amount': '2.222'
            //                 }
            //             ]
            //         },
            //         'USD': {
            //             'dividendAmount': '10',
            //             'tokenDividends': [
            //                 {
            //                     'tokenSymbol': 'USDT-000',
            //                     'amount': '2.222'
            //                 }
            //             ]
            //         }
            //     },
            //     'dividendList': [
            //         {
            //             'date': 1560428037,
            //             'vxQuantity': '2.222',
            //             'BTC': {
            //                 'dividendAmount': '10',
            //                 'tokenDividends': [
            //                     {
            //                         'tokenSymbol': 'BTC-000',
            //                         'amount': '2.222'
            //                     }
            //                 ]
            //             },
            //             'ETH': {
            //                 'dividendAmount': '10',
            //                 'tokenDividends': [
            //                     {
            //                         'tokenSymbol': 'ETH-000',
            //                         'amount': '2.222'
            //                     }
            //                 ]
            //             },
            //             'VITE': {
            //                 'dividendAmount': '10',
            //                 'tokenDividends': [
            //                     {
            //                         'tokenSymbol': 'VITE',
            //                         'amount': '2.222'
            //                     }
            //                 ]
            //             },
            //             'USD': {
            //                 'dividendAmount': '10',
            //                 'tokenDividends': [
            //                     {
            //                         'tokenSymbol': 'USDT-000',
            //                         'amount': '2.222'
            //                     }
            //                 ]
            //             }
            //         }
            //     ]
            // };

                this.myDividend = data ? data.dividendStat || {} : {};
                this.list = data ? data.dividendList || [] : [];
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
@import "~assets/scss/vars.scss";

.trade-dividend-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 10px;
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

    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
        .my-divident {
            width: 100%;
            background: #fff;
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
}
</style>
