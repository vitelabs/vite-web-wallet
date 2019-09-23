<template>
    <div class="income-wrapper">
        <div class="item">
            <img class="icon" src="~assets/imgs/head_asset.svg" />
            <div class="token-wrapper">
                <div class="token-title">{{ $t('tradeOperator.totalIncome') }}</div>
                <div class="token-amount">{{ totalAmount }}</div>
            </div>
        </div>
        <div v-for="(type, i) in typeList" :key="i" class="item">
            <img class="icon" :src="type.icon" />
            <div class="token-wrapper">
                <div class="token-title">{{ type.name }}</div>
                <div class="token-amount">{{ income && income[type.name] ? formatNum(income[type.name].amount) : '0' }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { operator } from 'services/trade';
import BigNumber from 'utils/bigNumber';

export default {
    created() {
        this.fetchOperator();
    },
    data() {
        return { income: {} };
    },
    computed: {
        typeList() {
            return this.$store.state.exchangeMine.showTypeList;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        totalAmount() {
            let totalAmount = 0;
            for (const type in this.income) {
                if (!this.income[type].tokenIncomes) {
                    continue;
                }
                for (let i = 0; i < this.income[type].tokenIncomes.length; i++) {
                    const detail = this.income[type].tokenIncomes[i];
                    const rate = this.getRate(detail.tokenId);
                    if (!rate) {
                        return '--';
                    }

                    const price = BigNumber.multi(detail.amount || 0, rate || 0, 2);
                    totalAmount = BigNumber.plus(price, totalAmount, 2);
                }
            }
            const pre = this.$store.state.env.currency === 'cny' ? '¥' : '$';
            return `${ pre }${ totalAmount }`;
        }
    },
    watch: {
        address() {
            this.fetchOperator();
        },
        income() {
            const tokenIds = [];

            for (const type in this.income) {
                if (!this.income[type].tokenIncomes) {
                    continue;
                }
                this.income[type].tokenIncomes.forEach(detail => {
                    tokenIds.push(detail.tokenId);
                });
            }
            this.$store.dispatch('addRateTokens', tokenIds);
            this.$emit('input', tokenIds.length);
        }
    },
    methods: {
        formatNum(num) {
            num = BigNumber.normalFormatNum(num, 8);
            return BigNumber.onlyFormat(num);
        },
        getRate(tokenId) {
            if (!tokenId) {
                return null;
            }
            const rateList = this.$store.getters.currencyRateList || {};
            return rateList[tokenId] || null;
        },

        fetchOperator() {
            this.income = {};

            operator(this.address).then(data => {
                this.income = data.incomeStat || {};
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
