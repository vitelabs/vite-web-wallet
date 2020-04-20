<template>
    <div class="defi-market">
        <div class="row">
            <div class="col">
                <div class="col__title">{{$t('defiMarket.deposit')}}</div>
                <div class="defi-content">
                    <div class="overview">
                        <div>
                            <div class="content__label">{{$t('defiMarket.totalAmount')}}</div>
                            <div class="content__value">{{currencySymbol + " " + depositTotal}}</div>
                        </div>
                        <div>
                            <div class="content__label">{{$t('defiMarket.userNums')}}</div>
                            <div class="content__value">1234234</div>
                        </div>
                    </div>
                    <div>
                        <Pie
                            class="pie-chart"
                            :pieData="pieData.deposit.data"
                            :labelGen="labelGenDeposit"
                            :title="$t('defiMarket.depositAssetSpread')"
                        ></Pie>
                    </div>
                </div>
            </div>
            <div class="col">
                <div class="col__title">{{$t('defiMarket.loan')}}</div>
                <div class="defi-content">
                    <div class="overview">
                        <div>
                            <div class="content__label">{{$t('defiMarket.totalAmount')}}</div>
                            <div class="content__value">{{currencySymbol + " " + loanTotal}}</div>
                        </div>
                        <div>
                            <div class="content__label">{{$t('defiMarket.userNums')}}</div>
                            <div class="content__value">1234234</div>
                        </div>
                    </div>
                    <div>
                        <Pie
                            class="pie-chart"
                            :pieData="pieData.deposit.data"
                            :labelGen="labelGenDeposit"
                            :title="$t('defiMarket.loanAssetsSpread')"
                        ></Pie>
                    </div>
                </div>
            </div>
        </div>
        <div class="subtitle">{{$t('defiMarket.allAssets')}}</div>
        <div class="row">
            <assets-table class="defi-assets-table" :headList="tableHeadList" :contentList="list">
                <template #symbol="{ data }">
                    <img class="token-icon" :src="data.icon" alt="">
                    <div class="token-symbol">
                        <div>
                            {{data.symbol}}
                        </div>
                        <div>
                            {{data.tokenName}}
                        </div>
                    </div>
                </template>
                <template #depositQty="{ data }">
                    <div class="assets-value">
                        <div>
                            {{currencySymbol + ' ' + data.depositAsset}}
                        </div>
                        <div>
                            {{data.depositQty + ' ' + data.symbol}}
                        </div>
                    </div>
                </template>
                <template #lendQty="{ data }">
                    <div class="assets-value">
                        <div>
                            {{currencySymbol + ' ' + data.loanAsset}}
                        </div>
                        <div>
                            {{data.lendQty + ' ' + data.symbol}}
                        </div>
                    </div>
                </template>
            </assets-table>
        </div>
    </div>
</template>

<script>
import Pie from 'pcComponents/pie';
import AssetsTable from 'pcComponents/table/index';
import { getGlobalAssets } from 'pcServices/defi';
import bigNumber from 'utils/bigNumber';


export default {
    components: { Pie, AssetsTable },
    data() {
        return {
            globalAssets: [],
            tableHeadList: [
                {
                    text: this.$t('defiMarket.asset'),
                    cell: 'symbol',
                    slot: true
                },
                {
                    text: this.$t('defiMarket.depositTotal'),
                    cell: 'depositQty',
                    slot: true
                },
                {
                    text: this.$t('defiMarket.depositRate'),
                    cell: 'depositRatio'
                },
                {
                    text: this.$t('defiMarket.loanTotal'),
                    cell: 'lendQty',
                    slot: true
                },
                {
                    text: this.$t('defiMarket.loanRate'),
                    cell: 'lendRatio'
                },
                {
                    text: this.$t('defiMarket.depositAndLoanRate'),
                    cell: 'lendDepositRatio'
                }
            ]
        };
    },
    computed: {
        pieData() {
            const list = this.list;
            const labels = list.map(item => item.symbol);
            return {
                deposit: {
                    data: list.map(item => item.depositQty),
                    labels
                },
                loan: {
                    data: list.map(item => item.lendQty),
                    labels
                }
            };
        },
        list() {
            return this.globalAssets.map(item => {
                const rate = this.rate[item.tokendId] && this.rate[item.tokendId][`${ this.currency }Rate`];
                const token = this.tokenList.find(item => item.tokendId === item.tokendId);
                return {
                    ...item,
                    loanAsset: rate ? bigNumber.multi(item.lendQty, rate) : 0,
                    depositAsset: rate ? bigNumber.multi(item.depositQty, rate) : 0,
                    icon: token.icon,
                    tokenName: token.tokenName
                };
            });
        },
        depositTotal() {
            return this.list.reduce((accumulator, cur) => bigNumber.plus(accumulator, cur.depositAsset), 0);
        },
        loanTotal() {
            return this.list.reduce((accumulator, cur) => bigNumber.plus(accumulator, cur.loanAsset), 0);
        },
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        currency() {
            return this.$store.state.env.currency;
        },
        rate() {
            return this.$store.state.exchangeRate.rateMap;
        },
        tokenList() {
            return [
                ...this.$store.getters.officalGateTokenList,
                ...this.$store.getters.defaultTokenList
            ];
        }

    },
    beforeMount() {
        this.getDefiOverview();
    },
    methods: {
        labelGenDeposit(v, i) {
            const symbol = this.pieData.deposit.labels[i];
            return `${ symbol } ${ (100 * v).toFixed(1) }%`;
        },
        labelGenLoan(v, i) {
            const symbol = this.pieData.loan.labels[i];
            return `${ symbol } ${ (100 * v).toFixed(1) }%`;
        },
        getDefiOverview() {
            getGlobalAssets().then(data => {
                this.globalAssets = data;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.row {
    display: flex;
    flex-direction: columns;
    @include bg_color_1();
}
.token-icon {
    width: 16px;
    height: 16px;
}
.token-symbol {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    line-height: 18px;
    margin-left: 15px;
    & > div {
        &:first-child {
            @include font-family-bold();
            color: #5E6875;
        }
    }
}
.assets-value {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 18px;
    height: 100%;
    & > div {
        &:first-child {
            @include font-family-bold();
            color: #5E6875;
        }
        &:nth-child(2) {
            color: rgba(94,104,117,0.58);
        }
    }
}
.subtitle {
    font-size: 13px;
    @include font-family-bold();
    color: rgba(94,104,117,1);
    line-height: 18px;
    margin: 14px 0;
}

.col {
    flex: 1;
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    margin-right: 10px;
    &:last-child {
        margin-right: 0;
    }
    .col__title {
        font-size: 12px;
        font-family: PingFangSC-Semibold,PingFang SC;
        font-weight: 600;
        line-height: 16px;
        padding: 20px 30px;
        @include common_border_one(bottom);
        @include font_color_to_white(rgba(29,32,36,1));
    }
}
.defi-content {
    padding: 20px 30px;
    display: flex;
    flex-direction: row;
    & > div {
        flex: 1;
    }
    .overview {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .content__label {
        font-size: 12px;
        line-height: 16px;
        @include font-family-normal();
        @include font_color_to_white(rgba(84,95,117,1));
        margin-bottom: 6px;
    }
    .content__value {
        font-size: 12px;
        line-height: 16px;
        @include font-family-bold();
        @include font_color_to_white(rgba(29,32,36,1));
    }
}
</style>
