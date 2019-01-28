<template>
    <div class="order-wrapper">
        <div class="order-title">
            {{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}
            <div class="wallet">
                {{ balance || '--' }}
                <span class="ex-order-token">
                    {{ orderType === 'buy' ? ttokenShow : ftokenShow }}
                </span>
            </div>
        </div>

        <div class="order-row-title">{{ $t(`exchange.${orderType}.price`) }}</div>
        <vite-input class="order-input" :class="{'err': isPriceErr}" 
                    v-model="price">
            <span class="ex-order-token" slot="after">{{ ttokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t(`exchange.${orderType}.amount`) }}
            <ul class="amount-percent">
                <li class="__pointer" :class="{
                    'active': +percent === 0.25
                }" @click="amountPercent(0.25)">25%</li>
                <li class="__pointer" :class="{
                    'active': +percent === 0.5
                }" @click="amountPercent(0.5)">50%</li>
                <li class="__pointer" :class="{
                    'active': +percent === 0.75
                }" @click="amountPercent(0.75)">75%</li>
                <li class="__pointer" :class="{
                    'active': +percent === 1
                }" @click="amountPercent(1)">100%</li>
            </ul>
        </div>
        <vite-input class="order-input" :class="{'err': isAmountErr}"  
                    v-model="amount">
            <span class="ex-order-token" slot="after">{{ ftokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t('exchange.quantity') }}</div>
        <input fake_pass type="password" style="display:none"/>
        <vite-input class="order-input" :class="{'err': isQuantityErr}"  
                    v-model="quantity">
            <input fake_pass type="password" style="display:none"/>
            <span class="ex-order-token" slot="after">{{ ttokenShow }}</span>
        </vite-input>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'blue': orderType === 'buy'
        }" @click="_clickBtn">{{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';

let validTimeout = null;
let changeVal = null;

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
    created() {
        this.price = this.activeTxPair && this.activeTxPair.price ? this.activeTxPair.price : '';
    },
    destroyed() {
        this.clearValidTimeout();
    },
    data() {
        return {
            price: '',
            amount: '',
            quantity: '',
            isPriceErr: false,
            isAmountErr: false,
            isQuantityErr: false,
            percent: 0,
            watchAQ: false
        };
    },
    watch: {
        activeTxPair: function() {
            if (this.price) {
                return;
            }
            this.price = this.activeTxPair && this.activeTxPair.price ? this.activeTxPair.price : '';
        },
        amount: function() {
            changeVal = 'amount';
            this.watchAQ = !this.watchAQ;
        },
        quantity: function() {
            changeVal = 'quantity';
            this.watchAQ = !this.watchAQ;
        },
        price: function() {
            changeVal = 'price';
            this.watchAQ = !this.watchAQ;
        },
        percent: function() {
            changeVal = 'percent';
            this.watchAQ = !this.watchAQ;
        },
        balance: function() {
            changeVal = 'balance';
            this.watchAQ = !this.watchAQ;
        },
        watchAQ: function() {
            this.clearValidTimeout();
            validTimeout = setTimeout(() => {
                this.clearValidTimeout();
                changeVal && this[`${changeVal}Changed`]();
                this.validPrice();
                this.validAmount();
                this.validQuantity();
            }, 300);
        }
    },
    computed: {
        balance() {
            let tokenId = this.activeTxPair && this.activeTxPair.ftoken ? this.activeTxPair.ftoken : '';
            if (this.orderType === 'buy') {
                tokenId = this.activeTxPair && this.activeTxPair.ttoken ? this.activeTxPair.ttoken : '';
            }
            let balanceList = this.$store.state.exchangeBalance.balanceList;
            if (!tokenId || !balanceList || !balanceList[tokenId]) {
                return '';
            }
            let tokenInfo = balanceList[tokenId].tokenInfo;
            let balance = balanceList[tokenId].available || 0;
            return BigNumber.toBasic(balance, tokenInfo.decimals);
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
        clearValidTimeout() {
            validTimeout && clearTimeout(validTimeout);
            validTimeout = null;
        },
        amountPercent(percent) {
            this.percent = percent;
        },

        percentChanged() {
            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            if (this.orderType === 'buy') {
                quantity = this.getPercentBalance(percent);
                amount = this.getAmount(price, quantity);
            } else {
                amount = this.getPercentBalance(percent);
                quantity = this.getQuantity(price, amount);
            }

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },
        balanceChanged() {
            if (!+percent || +percent%25 === 0) {
                let percent = this.getPercent(this.orderType === 'buy' ? this.quantity : this.amount);
                !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
                return;
            }
            
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;
            let price = this.price;

            if (this.orderType === 'buy') {
                quantity = this.getPercentBalance(percent);
                amount = this.getAmount(price, quantity);
            } else {
                amount = this.getPercentBalance(percent);
                quantity = this.getQuantity(price, amount);
            }

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },
        amountChanged() {
            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            quantity = this.getQuantity(price, amount);
            percent = this.getPercent(this.orderType === 'buy' ? quantity : amount);

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
        },
        priceChanged() {
            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            quantity = this.getQuantity(price, amount);
            percent = this.getPercent(this.orderType === 'buy' ? quantity : amount);

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
        },
        quantityChanged() {
            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            amount = this.getAmount(price, quantity);
            percent = this.getPercent(this.orderType === 'buy' ? quantity : amount);

            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
            !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
        },

        getPercentBalance(percent) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0)) {
                return '';
            }
            let result = BigNumber.multi(percent, this.balance, 8, 'nofix');
            return BigNumber.isEqual(result, 0) ? '' : result;
        },
        getQuantity(price, amount) {
            let isRightPrice = price && this.$validAmount(price) && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            let isRightAmount = amount && this.$validAmount(amount) && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            return BigNumber.multi(price, amount, 8, 'nofix');
        },
        getAmount(price, quantity) {
            let isRightPrice = price && this.$validAmount(price) && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            let isRightQuantity = quantity && this.$validAmount(quantity) && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            return BigNumber.dividedToNumber(quantity, price, 8, 'nofix');
        },
        getPercent(val) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0) || 
                !val || !this.$validAmount(val) || BigNumber.isEqual(val, 0)) {
                return 0;
            }

            return BigNumber.dividedToNumber(val, this.balance, 2);
        },

        validPrice() {
            this.isPriceErr = this.price && !this.$validAmount(this.price);
        },
        validAmount() {
            this.isAmountErr = this.amount && !this.$validAmount(this.amount) ||
                (this.orderType === 'sell' && BigNumber.compared(this.balance, this.amount) < 0);
        },
        validQuantity() {
            this.isQuantityErr = (this.quantity && !this.$validAmount(this.quantity)) ||
                (this.orderType === 'buy' && BigNumber.compared(this.balance, this.quantity) < 0);
        },

        _clickBtn() {
            this.validPrice();
            this.validAmount();
            this.validQuantity();
            this.isPriceErr = this.isPriceErr || !this.price;
            this.isAmountErr = this.isAmountErr || !this.amount;
            this.isQuantityErr = this.isQuantityErr || !this.quantity;

            if (this.isPriceErr || this.isAmountErr || this.isQuantityErr) {
                return;
            }

            let activeAccount = this.$wallet.getActiveAccount();
            activeAccount.initPwd({
                submit: () => {
                    this[`${this.orderType}Order`]({
                        price: this.price,
                        amount: this.amount,
                        quantity: this.quantity
                    });
                }
            });
        },
        buyOrder({
            price, amount, quantity
        }) {
            console.log(price, amount, quantity);
        },
        sellOrder({
            price, amount, quantity
        }) {
            console.log(price, amount, quantity);
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
