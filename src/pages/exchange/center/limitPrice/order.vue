<template>
    <div class="order-wrapper">
        <div class="order-title">
            {{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}
            <div class="wallet">
                {{ balance }}
                <span class="ex-order-token">
                    {{ orderType === 'buy' ? ttokenShow : ftokenShow }}
                </span>
            </div>
        </div>

        <div class="order-row-title">{{ $t(`exchange.${orderType}.price`) }}</div>
        <vite-input class="order-input" :class="{'err': isPriceErr}" 
                    v-model="price" :valid="validPrice">
            <span class="ex-order-token" slot="after">{{ ttokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t(`exchange.${orderType}.amount`) }}
            <ul class="amount-percent">
                <li class="__pointer" :class="{
                    'active': percent === 0.25
                }" @click="amountPercent(0.25)">25%</li>
                <li class="__pointer" :class="{
                    'active': percent === 0.5
                }" @click="amountPercent(0.5)">50%</li>
                <li class="__pointer" :class="{
                    'active': percent === 0.75
                }" @click="amountPercent(0.75)">75%</li>
                <li class="__pointer" :class="{
                    'active': percent === 1
                }" @click="amountPercent(1)">100%</li>
            </ul>
        </div>
        <vite-input class="order-input" :class="{'err': isAmountErr}"  
                    v-model="amount" :valid="validAmount">
            <span class="ex-order-token" slot="after">{{ ftokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t('exchange.quantity') }}</div>
        <vite-input class="order-input" :class="{'err': isQuantityErr}"  
                    v-model="quantity"  :valid="validQuantity">
            <span class="ex-order-token" slot="after">{{ ttokenShow }}</span>
        </vite-input>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'blue': orderType === 'buy'
        }">{{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';

export default {
    components: {
        viteInput
    },
    props: {
        orderType: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            price: '',
            amount: '',
            quantity: '',
            isPriceErr: false,
            isAmountErr: false,
            isQuantityErr: false,
            percent: 0
        };
    },
    watch: {
        activeTxPair: function() {
            if (this.price) {
                return;
            }
            this.price = this.activeTxPair && this.activeTxPair.price ? this.activeTxPair.price : '';
        },
        percent: function() {
            this.amount = BigNumber.multi(this.percent, this.balance);
        }
    },
    computed: {
        balance() {
            return 0;
        },
        ftokenShow() {
            return this.activeTxPair && this.activeTxPair.ftokenShow ? this.activeTxPair.ftokenShow : '';
        },
        ttokenShow() {
            return this.activeTxPair && this.activeTxPair.ttokenShow ? this.activeTxPair.ttokenShow : '';
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    methods: {
        amountPercent(percent) {
            this.percent = percent;
        },
        validPrice() {
            this.isPriceErr = !this.$validAmount(this.price);
            if (this.isPriceErr || !this.amount || this.isAmountErr) {
                return;
            }
            let quantity = BigNumber.multi(this.price, this.amount);
            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
        },
        validAmount() {
            this.isAmountErr = !this.$validAmount(this.amount);
            if (this.isAmountErr || !this.price || this.isPriceErr) {
                return;
            }
            this.percent = +this.balance ? BigNumber.dividedToNumber(this.amount, this.balance) : 0;

            let quantity = BigNumber.multi(this.price, this.amount);
            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
        },
        validQuantity() {
            this.isQuantityErr = !this.$validAmount(this.quantity);
            if (this.isQuantityErr || !this.price || this.isPriceErr) {
                return;
            }
            let amount = BigNumber.dividedToNumber(this.quantity, this.price, 8);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";
$font-black: rgba(36,39,43,1);

.order-wrapper {
    flex: 1;
    padding: 0 22px;
    .order-title {
        height: 17px;
        line-height: 17px;
        font-size: 12px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: $font-black;
        text-indent: 6px;
        border-left: 2px solid $blue;
        .wallet {
            display: block;
            float: right;
            &:before {
                content: '';
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url('~assets/imgs/ex-wallet-icon.svg');
                background-size: 100% 100%;
                margin-bottom: -4px;
            }
        }
    }
    .ex-order-token {
        font-size: 12px;
        font-family: $font-normal, arial, sans-serif;
        font-weight:400;
        color:rgba(94,104,117,1);
    }
    .order-row-title {
        height: 28px;
        line-height: 28px;
        font-size: 12px;
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;
        color: $font-black;
        margin-top: 5px;
        .amount-percent {
            display: block;
            float: right;
            font-size: 11px;
            li {
                display: inline-block;
                box-sizing: border-box;
                border: 1px solid $blue;
                color: $blue;
                height: 16px;
                line-height: 16px;
                border-radius: 2px;
                &.active {
                    background: $blue;
                    color: #fff;
                }
            }
        }
    }
    .order-input {
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        &.err {
            border: 1px solid $red;
        }
        input {
            text-indent: 6px;
        }
        .ex-order-token {
            padding: 0 6px;
        }
    }
    .order-btn {
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-top: 16px;
        border-radius: 2px;
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: #fff;
        &.red {
            background: $red;
        }
        &.blue {
            background: $blue;
        }
    }
}
</style>
