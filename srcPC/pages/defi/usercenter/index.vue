<template>
    <div class="defi-user-center">
        <div class="overview__row">
            <div class="overview__col">
                <div class="overview__value-wrapper">
                    <img class="overview__icon" src="~assets/imgs/deposit-icon.svg" alt="">
                    <div>
                        <div class="overview__label">{{$t('defiUsercenter.myDepositTotal')}}</div>
                        <div class="overview__value">{{currencySymbol + ' '}} {{depositTotal | formatNum(2)}}</div>
                    </div>
                </div>
                <div>
                    <Pie
                        class="pie-chart"
                        :pieData="pieData.deposit.data"
                        :labelGen="labelGenDeposit"
                        :showLabel="false"
                        :title="$t('defiMarket.depositAssetSpread')"
                    ></Pie>
                </div>
                <div class="overview__line"></div>
            </div>
            <div class="overview__col">
                <div class="overview__value-wrapper">
                    <img class="overview__icon" src="~assets/imgs/loan-icon.svg" alt="">
                    <div>
                        <div class="overview__label">{{$t('defiUsercenter.myLoanTotal')}}</div>
                        <div class="overview__value">{{currencySymbol + ' '}} {{loanTotal | formatNum(2)}}</div>
                    </div>
                </div>
                <div>
                    <Pie
                        class="pie-chart"
                        :pieData="pieData.deposit.data"
                        :labelGen="labelGenDeposit"
                        :showLabel="true"
                        :title="$t('defiMarket.loanAssetsSpread')"
                    ></Pie>
                </div>
                <div class="overview__line"></div>
            </div>
            <div class="overview__col">
                <div class="overview__label">{{$t('defiUsercenter.myLoanTotal')}}</div>
                <progress-bar
                    :assetValue="loanTotal"
                    :activeValue="loanStakingRate"
                    class="progress-bar"></progress-bar>
            </div>
        </div>
        <tabs class="loarn-deposit-list">
            <tab :name="$t('defiUsercenter.depositList')" :selected="true">
                <assets-table class="defi-assets-table defi-assets-table--deposit" :headList="depositTableHeaders" :contentList="list">
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
                    <template #depositRate="{ data }">
                        <div class="assets-value">
                            <div>
                                {{data.depositRate | percentage(2)}}
                            </div>
                            <div>
                                {{data.restDepositInterest | toBasic(data.decimals, 4)}} {{' ' + data.symbol}}
                            </div>
                        </div>
                    </template>
                    <template #depositQty="{ data }">
                        <div class="assets-value">
                            <div>
                                {{data.depositQty | toBasic(data.decimals, 4)}}
                            </div>
                            <div>
                                {{currencySymbol + " "}} {{data.depositAsset | formatNum(2)}}
                            </div>
                        </div>
                    </template>
                    <template #staking="{ data }">
                        <switch-button :isEnabled="data.staking" @toggle="toggleStaking(data)"></switch-button>
                    </template>
                </assets-table>
            </tab>
            <tab :name="$t('defiUsercenter.loanList')">
                <assets-table class="defi-assets-table defi-assets-table--deposit" :headList="loanTableHeaders" :contentList="list">
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
                    <template #lendRate="{ data }">
                        <div class="assets-value">
                            <div>
                                {{data.lendRate | percentage(2)}}
                            </div>
                            <div>
                                {{data.restLendInterest | toBasic(data.decimals, 4)}} {{' ' + data.symbol}}
                            </div>
                        </div>
                    </template>
                    <template #lendQty="{ data }">
                        <div class="assets-value">
                            <div>
                                {{data.lendQty | toBasic(data.decimals, 4)}}
                            </div>
                            <div>
                                {{currencySymbol + " "}} {{data.loanAsset | formatNum(2)}}
                            </div>
                        </div>
                    </template>
                </assets-table>
            </tab>
        </tabs>
    </div>
</template>

<script>
import Pie from 'pcComponents/pie';
import Tabs from 'pcComponents/tabs';
import Tab from 'pcComponents/tab';
import SwitchButton from 'pcComponents/switch';
import { getUserAssets, getAssetMeta } from 'pcServices/defi';
import bigNumber from 'utils/bigNumber';
import AssetsTable from 'pcComponents/table/index';

import ProgressBar from './progressBar';

export default {
    components: { Pie, ProgressBar, Tabs, Tab, AssetsTable, SwitchButton },
    data() {
        return {
            userAssetsData: [],
            coinMeta: [],
            depositTableHeaders: [
                {
                    text: this.$t('defiUsercenter.asset'),
                    cell: 'symbol',
                    slot: true
                },
                {
                    text: `${ this.$t('defiUsercenter.depositRate') }/${ this.$t('defiUsercenter.depositInterest') }`,
                    cell: 'depositRate',
                    slot: true
                },
                {
                    text: this.$t('defiUsercenter.depositAmount'),
                    cell: 'depositQty',
                    slot: true
                },
                {
                    text: this.$t('defiUsercenter.isStaking'),
                    cell: 'staking',
                    slot: true
                }
            ],
            loanTableHeaders: [
                {
                    text: this.$t('defiUsercenter.asset'),
                    cell: 'symbol',
                    slot: true
                },
                {
                    text: `${ this.$t('defiUsercenter.loanRate') }/${ this.$t('defiUsercenter.loanInterest') }`,
                    cell: 'lendRate',
                    slot: true
                },
                {
                    text: this.$t('defiUsercenter.loanAmount'),
                    cell: 'lendQty',
                    slot: true
                },
                {
                    text: this.$t('defiUsercenter.loanRatio'),
                    cell: 'lendDepositRatio'
                }
            ]

        };
    },
    beforeMount() {
        this.getAssetMeta();
        this.getUserAssets();
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
            return this.userAssetsData.map(item => {
                const coin = this.coinMeta.find(coin => item.tokenId === coin.tokenId);
                if (!coin) return item;
                const rate = coin[`${ this.currency }Price`];
                return {
                    ...item,
                    loanAsset: bigNumber.multi(bigNumber.toBasic(item.lendQty, coin.decimals), rate),
                    depositAsset: bigNumber.multi(bigNumber.toBasic(item.depositQty, coin.decimals), rate),
                    maxLoanAsset: bigNumber.multi(bigNumber.toBasic(item.maxLendQty, coin.decimals), rate),
                    restDepositInterestAsset: bigNumber.multi(bigNumber.toBasic(item.restDepositInterest, coin.decimals), rate),
                    restLendInterestAsset: bigNumber.multi(bigNumber.toBasic(item.restLendInterest, coin.decimals), rate),
                    icon: coin.logo,
                    tokenName: coin.name,
                    decimals: coin.decimals
                };
            });
        },
        currencySymbol() {
            return this.$store.getters.currencySymbol;
        },
        currency() {
            return this.$store.state.env.currency;
        },
        maxLoanTotal() {
            return this.list.reduce((acc, cur) => bigNumber.plus(acc, cur.maxLoanAsset), 0);
        },
        loanTotal() {
            return this.list.reduce((acc, cur) => bigNumber.plus(acc, cur.loanAsset), 0);
        },
        depositTotal() {
            return this.list.reduce((acc, cur) => bigNumber.plus(acc, cur.depositAsset), 0);
        },
        loanStakingRate() {
            // 剩余需还借款利息总和（用法币计算）, 借款抵押率： = （当前借款金额+待还款利息） / 借款最大金额
            const restLendInterest = this.list.reduce((acc, cur) => bigNumber.plus(acc, cur.restLendInterestAsset), 0);
            const result = bigNumber.dividedToNumber(bigNumber.plus(restLendInterest, this.loanTotal), this.maxLoanTotal, 2);
            return bigNumber.multi(result, 100, 1);
        }
    },
    methods: {
        labelGenDeposit(v, i) {
            const symbol = this.pieData.deposit.labels[i];
            return `${ symbol } ${ (100 * v).toFixed(1) }%`;
        },
        getUserAssets() {
            getUserAssets().then(data => {
                this.userAssetsData = data;
            });
        },
        getAssetMeta() {
            getAssetMeta().then(data => {
                this.coinMeta = data;
            });
        },
        toggleStaking() {

        }
    }
};
</script>

<style lang="scss" scoped>
@import "../defiAssetsTable.scss";

.overview__row {
    display: flex;
    flex-direction: row;
    height: 124px;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    width: 100%;
    padding: 15px 30px;
    @include bg_color_1();
    box-sizing: border-box;
    .overview__col {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        &:first-child {
            width: 320px;
            padding-right: 30px;
            flex: 2;
        }
        &:nth-child(2) {
            min-width: 548px;
            flex: 3;
        }
        &:nth-child(3) {
            min-width: 391px;
            padding-left: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            flex: 2;
            .overview__label {
                margin-bottom: 7px;
            }
        }
    }
    .overview__icon {
        width: 34px;
        height: 34px;
    }
    .overview__value-wrapper {
        display: flex;
        flex-direction: row;
        & > img {
            &:first-child {
                margin-right: 30px;
            }
        }
    }
    .overview__label {
        font-size: 13px;
        line-height: 17px;
        @include font-family-bold();
        @include font_color_to_white(rgba(94,104,117,1));
    }
    .overview__value {
        font-size: 16px;
        line-height: 20px;
        @include font-family-bold();
        @include font_color_to_white(rgba(29,32,36,1));
        margin-top: 4px;
    }
    .overview__line {
        width: 1px;
        height: 84px;
        background: rgba(198,203,212,0.3);
    }
}
.loarn-deposit-list {
    margin-top: 15px;
}
.pie-chart {
    ::v-deep .legend__group {
        max-width: 173px;
    }
}
</style>
