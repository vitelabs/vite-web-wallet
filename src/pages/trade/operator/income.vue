<template>
    <div class="income-wrapper">
        <div class="item">
            <img class="icon" src="~assets/imgs/head_asset.png" />
            <div class="token-wrapper">
                <div class="token-title">{{ $t('tradeOperator.totalIncome') }}</div>
                <div class="token-amount">{{ totalAmount }}</div>
            </div>
        </div>
        <div v-for="(type, i) in typeList" :key="i" class="item">
            <img class="icon" :src="type.icon" />
            <div class="token-wrapper">
                <div class="token-title">{{ type.name }}</div>
                <div class="token-amount">{{ income && income[type] ? income[type].dividendAmount : '0' }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { operator } from 'services/trade';
// import bigNumber from 'utils/bigNumber';
import viteIcon from 'assets/imgs/vite-dividend.svg';
import ethIcon from 'assets/imgs/eth.svg';
import usdIcon from 'assets/imgs/usd.svg';
import btcIcon from 'assets/imgs/BTC.svg';

const typeList = [ {
    name: 'VITE',
    icon: viteIcon
}, {
    name: 'ETH',
    icon: ethIcon
}, {
    name: 'BTC',
    icon: btcIcon
}, {
    name: 'USD',
    icon: usdIcon
} ];

export default {
    created() {
        this.fetchOperator();
    },
    data() {
        return {
            typeList,
            income: {}
        };
    },
    computed: {
        address() {
            return this.$store.getters.activeAddr;
        },
        totalAmount() {
            return 0;
        }
    },
    methods: {
        fetchOperator() {
            operator(this.address).then(data => {
                console.log(data);
                // this.income = data.incomeStat || {};
                this.income = {
                    'BTC': { 'dividendAmount': '10' },
                    'ETH': { 'dividendAmount': '10' },
                    'VITE': { 'dividendAmount': '10' },
                    'USD': { 'dividendAmount': '10' }
                };
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.income-wrapper {
    border-radius: 2px;
    box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
    background: url('~assets/imgs/mint_pledge_bg.png') rgba(255,255,255,1);
    background-size: 100% 100%;
    display: flex;
    flex-direction: row;
    padding: 20px 0;
    .item {
        flex: 1;
        padding: 5px 30px;
        border-right: 1px solid rgba(198,203,212,0.3);
        &:last-child {
            border: none;
        }
        .icon {
            width: 34px;
            height: 34px;
            margin-right: 10px;
            margin-bottom: 5px;
        }
        .token-wrapper {
            display: inline-block;
            .token-title {
                line-height: 18px;
                font-size: 14px;
                @include font-family-bold();
                color: rgba(94,104,117,1);
            }
            .token-amount {
                font-size: 20px;
                @include font-family-bold();
                color: rgba(29,32,36,1);
                line-height: 24px;
                margin-top: 13px;
            }
        }
    }
}
</style>
