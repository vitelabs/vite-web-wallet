<template>
    <div class="order-wrapper">
        <pow-process ref="powProcess"></pow-process>

        <div class="order-title">
            {{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}
            <div class="wallet">
                {{ balance || '0' }}
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

        <div class="order-row-title">{{ $t(`exchange.${orderType}.quantity`) }}
            <ul class="quantity-percent">
                <li class="__pointer" :class="{
                    'active': +percent === 0.25
                }" @click="quantityPercent(0.25)">25%</li>
                <li class="__pointer" :class="{
                    'active': +percent === 0.5
                }" @click="quantityPercent(0.5)">50%</li>
                <li class="__pointer" :class="{
                    'active': +percent === 0.75
                }" @click="quantityPercent(0.75)">75%</li>
                <li class="__pointer" :class="{
                    'active': +percent === 1
                }" @click="quantityPercent(1)">100%</li>
            </ul>
        </div>
        <vite-input class="order-input" :class="{'err': isQuantityErr}"  
                    v-model="quantity">
            <span class="ex-order-token" slot="after">{{ ftokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t('exchange.amount') }}</div>
        <vite-input class="order-input" :class="{'err': isAmountErr}"  
                    v-model="amount">
            <span class="ex-order-token" slot="after">{{ ttokenShow }}</span>
        </vite-input>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'green': orderType === 'buy',
            'gray': isLoading || isAmountErr || isPriceErr || isQuantityErr
        }" @click="_clickBtn">{{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import powProcess from 'components/powProcess';
import BigNumber from 'utils/bigNumber';
import { newOrder } from 'services/exchange';

let validTimeout = null;
let changeVal = null;

export default {
    components: {
        viteInput, powProcess
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
            watchAQ: 0,
            isLoading: false,
            oldPrice: '',
            oldAmount: '',
            oldQuantity: ''
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
            this.watchAQ++;
        },
        quantity: function() {
            changeVal = 'quantity';
            this.watchAQ++;
        },
        price: function() {
            changeVal = 'price';
            this.watchAQ++;
        },
        percent: function() {
            changeVal = 'percent';            
            this.watchAQ++;
        },
        balance: function() {
            changeVal = 'balance';
            this.watchAQ++;
        },
        watchAQ: function() {
            this.clearValidTimeout();
            validTimeout = setTimeout(() => {
                this.clearValidTimeout();
                // this.validAll();
                // let isErr = this.isPriceErr || this.isAmountErr || this.isQuantityErr;
                // if (this.isPriceErr) {
                //     this.price = this.oldPrice;
                // }
                // if (this.isAmountErr) {
                //     this.amount = this.oldAmount;
                // }
                // if (this.isQuantityErr) {
                //     this.quantity = this.oldQuantity;
                // }
                // if (isErr) {
                //     return;
                // }
                changeVal && this[`${changeVal}Changed`]();
                this.validAll();
            }, 300);
        },
        activeTx: function() {
            this.price = this.activeTx.price;
        }
    },
    computed: {
        rawBalance() {
            if (!this.activeTxPair) {
                return null;
            }

            let tokenId = this.activeTxPair.ftoken;
            if (this.orderType === 'buy') {
                tokenId = this.activeTxPair.ttoken;
            }
            if (!tokenId) {
                return null;
            }

            let balanceList = this.$store.state.exchangeBalance.balanceList;
            if (!tokenId || !balanceList || !balanceList[tokenId]) {
                return null;
            }
            
            return balanceList[tokenId];
        },
        balance() {
            if (!this.rawBalance) {
                return '';
            }
            let tokenInfo = this.rawBalance.tokenInfo;
            let balance = this.rawBalance.available || 0;
            return BigNumber.toBasic(balance, tokenInfo.decimals);
        },
        ttokenDetail() {
            return this.$store.state.exchangeTokens.ttoken;
        },
        ftokenDetail() {
            return this.$store.state.exchangeTokens.ftoken;
        },
        ftokenShow() {
            return this.activeTxPair ? this.activeTxPair.ftokenShow : '';
        },
        ttokenShow() {
            return this.activeTxPair ? this.activeTxPair.ttokenShow : '';
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        activeTx() {
            return this.$store.state.exchangeActiveTx.activeTx;
        }
    },
    methods: {
        clearValidTimeout() {
            validTimeout && clearTimeout(validTimeout);
            validTimeout = null;
        },
        quantityPercent(percent) {
            this.percent = percent;
        },

        percentChanged() {
            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            if (percent <= 0 || percent * 100 % 25 !== 0) {
                return;
            }

            let _p = this.getPercent(this.orderType === 'buy' ? amount : quantity);
            if (BigNumber.isEqual(_p, percent)) {
                return;
            }

            if (this.orderType === 'buy') {
                amount = this.getPercentBalance(percent, this.ttokenDetail.tokenDigit);
                quantity = this.getQuantity(price, amount);
            } else {
                quantity = this.getPercentBalance(percent, this.ftokenDetail.tokenDigit);
                amount = this.getAmount(price, quantity);
            }

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },
        balanceChanged() {
            if (!+this.percent || +this.percent * 100 % 25 !== 0) {
                let percent = this.getPercent(this.orderType === 'buy' ? this.amount : this.quantity);
                !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
                return;
            }
            
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;
            let price = this.price;

            if (this.orderType === 'buy') {
                amount = this.getPercentBalance(percent);
                quantity = this.getQuantity(price, amount);
            } else {
                quantity = this.getPercentBalance(percent);
                amount = this.getAmount(price, quantity);
            }

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },
        amountChanged() {
            if (this.isAmountErr) {
                return;
            }

            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            quantity = this.getQuantity(price, amount);
            percent = this.getPercent(this.orderType === 'buy' ? amount : quantity);

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
        },
        priceChanged() {
            if (this.isPriceErr) {
                return;
            }

            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            amount = this.getAmount(price, quantity);
            percent = this.getPercent(this.orderType === 'buy' ? amount : quantity);

            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
            !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
        },
        quantityChanged() {
            if (this.isQuantityErr) {
                return;
            }

            let price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;
            let percent = this.percent;

            amount = this.getAmount(price, quantity);
            percent = this.getPercent(this.orderType === 'buy' ? amount : quantity);

            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
            !BigNumber.isEqual(percent, this.percent) && (this.percent = percent);
        },

        getPercentBalance(percent, decimals) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0)) {
                return '';
            }
            let limit = decimals >= 8 ? 8 : decimals;
            let result = BigNumber.multi(percent, this.balance, limit, 'nofix');
            return BigNumber.isEqual(result, 0) ? '' : result;
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

            let tokenDigit = this.ttokenDetail.tokenDigit;
            let limit = tokenDigit >= 8 ? 8 : tokenDigit;
            return BigNumber.multi(price, quantity, limit, 'nofix');
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

            let tokenDigit = this.ftokenDetail.tokenDigit;
            let limit = tokenDigit >= 8 ? 8 : tokenDigit;
            return BigNumber.dividedToNumber(amount, price, limit, 'nofix');
        },
        getPercent(val) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0) || 
                !val || !this.$validAmount(val) || BigNumber.isEqual(val, 0)) {
                return 0;
            }

            return BigNumber.dividedToNumber(val, this.balance, 2);
        },

        validPrice() {
            let tokenDigit = this.ttokenDetail.tokenDigit;
            this.isPriceErr = this.price && !this.$validAmount(this.price, tokenDigit);
        },
        validAmount() {
            let tokenDigit = this.ttokenDetail.tokenDigit;
            this.isAmountErr = this.amount && !this.$validAmount(this.amount, tokenDigit) ||
                (this.orderType === 'buy' && BigNumber.compared(this.balance, this.amount) < 0);
        },
        validQuantity() {
            let tokenDigit = this.ftokenDetail.tokenDigit;
            this.isQuantityErr = this.quantity && !this.$validAmount(this.quantity, tokenDigit) ||
                (this.orderType === 'sell' && BigNumber.compared(this.balance || 0, this.quantity) < 0);
        },
        validAll() {
            this.validPrice();
            this.validAmount();
            this.validQuantity();
        },
        clearAll() {
            this.amount = '';
            this.quantity = '';
        },

        _clickBtn() {
            if (this.isLoading) {
                return;
            }

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
                    this.newOrder({
                        price: this.price,
                        quantity: this.quantity
                    });
                }
            });
        },
        newOrder({
            price, quantity
        }) {
            let tradeToken = this.activeTxPair ? this.activeTxPair.ftoken : '';
            let quoteToken = this.activeTxPair ? this.activeTxPair.ttoken : '';
            
            this.isLoading = true;
            let tokenDigit = this.ftokenDetail.tokenDigit;
            quantity = BigNumber.toMin(quantity, tokenDigit);

            newOrder({
                tradeToken,
                quoteToken,
                side: this.orderType === 'buy' ? 0 : 1,
                price,
                quantity
            }).then(() => {
                this.isLoading = false;
                this.clearAll();
                this.$toast( this.$t('exchange.newOrderSuccess') );
            }).catch((err) => {
                console.warn(err);
                if (!err || !err.error || !err.error.code || err.error.code !== -35002) {
                    this.isLoading = false;
                    this.$toast( this.$t('exchange.newOrderFail') );
                    return;
                }

                this.$refs.powProcess.startPowTx(err.accountBlock, 0).then(() => {
                    this.isLoading = false;
                    this.clearAll();
                    this.$toast( this.$t('exchange.newOrderSuccess') );
                }).catch((err) => {
                    this.isLoading = false;
                    this.$toast( this.$t('exchange.newOrderFail') );
                    console.warn(err);
                });
            });
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
        .quantity-percent {
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
            background: linear-gradient(315deg,rgba(226,43,116,1) 0%,rgba(237,81,88,1) 100%);;
        }
        &.green {
            background: linear-gradient(315deg,rgba(0,212,208,1) 0%,rgba(0,215,100,1) 100%);;
        }
        &.gray {
            background: rgba(0, 0, 0, 0.4);
        }
    }
}
</style>
