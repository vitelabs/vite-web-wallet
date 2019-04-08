<template>
    <div class="order-wrapper">
        <div class="order-title">
            {{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}
            <div class="wallet">
                {{ balance || '0' }}
                <span class="ex-order-token">
                    {{ orderType === 'buy' ? ttokenShow : ftokenShow }}
                </span>
            </div>
        </div>

        <div class="input-wrapper">
            <span class="tips" :class="{'active':
                focusInput === 'price' && priceErr
            }">{{  priceErr }}</span>
            <vite-input class="order-input b" :class="{'err': priceErr}"
                        v-model="price"
                        @focus="showTips('price')" @blur="hideTips('price')">
                <span class="ex-order-token" slot="before">
                    {{ $t(`exchange.${orderType}.price`, { token: ttokenShow }) }}
                </span>
            </vite-input>
        </div>

        <div class="input-wrapper">
            <span class="tips" :class="{'active':
                focusInput === 'quantity' && quantityErr
            }">{{  quantityErr }}</span>
            <vite-input class="order-input" :class="{'err': quantityErr}"
                        v-model="quantity" @input="quantityChanged"
                        @focus="showTips('quantity')" @blur="hideTips('quantity')">
                <span class="ex-order-token" slot="before">
                    {{ $t(`exchange.${orderType}.quantity`, { token: ftokenShow }) }}
                </span>
            </vite-input>
        </div>

        <div class="slider-wrapper">
            <slider :class="orderType" :min="0" :max="100" :default="0"
                    v-model="percent" v-on:drag="percentChanged"></slider>
        </div>

        <div class="input-wrapper">
            <span class="tips" :class="{'active':
                focusInput === 'amount' && amountErr
            }">{{  amountErr }}</span>
            <vite-input class="order-input" :class="{'err': amountErr}"
                        v-model="amount" @input="amountChanged"
                        @focus="showTips('amount')" @blur="hideTips('amount')">
                <span class="ex-order-token" slot="before">
                    {{ $t('exchange.quantityTitle', { quantity: ttokenShow }) }}
                </span>
            </vite-input>
        </div>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'green': orderType === 'buy',
            'gray': isLoading || amountErr || priceErr || quantityErr
        }" @click="_clickBtn">{{ $t(`exchange.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import slider from 'components/slider';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';
import { newOrder } from 'services/exchange';

const taker = 0.001;
const maxDigit = 8;

export default {
    components: { viteInput, slider },
    props: {
        orderType: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.price = this.activeTxPair && this.activeTxPair.price ? this.activeTxPair.price : '';
    },
    data() {
        return {
            price: '',
            amount: '',
            quantity: '',
            priceErr: '',
            amountErr: '',
            quantityErr: '',
            isLoading: false,
            oldPrice: '',
            oldAmount: '',
            oldQuantity: '',
            focusInput: ''
        };
    },
    watch: {
        activeTxPair: function (val, old) {
            if (old && old.pairCode === this.activeTxPair.pairCode) {
                return;
            }
            this.price = this.activeTxPair && this.activeTxPair.price ? this.activeTxPair.price : '';
            this.quantity = '';
            this.amount = '';
        },
        balance: function () {
            this.validAll();
        },
        amount: function () {
            this.validAll();
        },
        quantity: function () {
            this.validAll();
        },
        price: function () {
            this.validAll();
            this.priceChanged();
        },
        minAmount: function () {
            this.validAll();
        },
        activeTx: function () {
            this.price = this.activeTx.price;

            if (!this.activeTx.num) {
                return;
            }

            if (this.orderType === 'buy' && this.activeTx.txSide === 1) {
                this.quantity = this.activeTx.num;
            } else if (this.orderType === 'sell' && this.activeTx.txSide === 0) {
                this.quantity = this.activeTx.num;
            }
            this.quantityChanged();
        }
    },
    computed: {
        minAmount() {
            const markets = this.$store.state.exchangeMarket.marketMap;
            const ttoken = this.activeTxPair ? this.activeTxPair.ttoken : '';

            if (!markets || !markets.length || !ttoken) {
                return 0;
            }

            for (let i = 0; i < markets.length; i++) {
                if (markets[i].token === ttoken) {
                    return markets[i].minAmount;
                }
            }

            return 0;
        },
        percent() {
            if (!this.availableBalance) {
                return '0';
            }

            const balance = this.availableBalance;

            if (this.orderType === 'buy') {
                const basicAmount = BigNumber.toMin(this.amount || 0, this.ttokenDetail.tokenDigit);
                return BigNumber.dividedToNumber(basicAmount || 0, balance, 3, 'nofix');
            }

            const basicQuantity = BigNumber.toMin(this.quantity || 0, this.ftokenDetail.tokenDigit);
            return BigNumber.dividedToNumber(basicQuantity || 0, balance, 3, 'nofix');
        },
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

            const balanceList = this.$store.state.exchangeBalance.balanceList;
            if (!tokenId || !balanceList || !balanceList[tokenId]) {
                return null;
            }

            return balanceList[tokenId];
        },
        availableBalance() {
            return this.rawBalance && this.rawBalance.available ? this.rawBalance.available : '0';
        },
        balance() {
            if (!this.rawBalance) {
                return '';
            }
            const tokenInfo = this.rawBalance.tokenInfo;
            const balance = this.rawBalance.available || 0;

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
        },
        ttokenDigit() {
            if (!this.ttokenDetail || !this.activeTxPair) {
                return 0;
            }

            const tDigit = this.ttokenDetail.tokenDigit;
            const pariDigit = this.activeTxPair.decimals;

            const digit = tDigit > pariDigit ? pariDigit : tDigit;
            return digit > maxDigit ? maxDigit : digit;
        },
        ftokenDigit() {
            if (!this.ftokenDetail || !this.activeTxPair) {
                return 0;
            }

            const fDigit = this.ftokenDetail.tokenDigit;
            const pariDigit = this.activeTxPair.decimals;

            const digit = fDigit > pariDigit ? pariDigit : fDigit;
            return digit > maxDigit ? maxDigit : digit;
        }
    },
    methods: {
        hideTips(type) {
            this.focusInput === type && (this.focusInput = '');
        },
        showTips(type) {
            this.focusInput = type;
        },

        percentChanged(percent) {
            percent = percent / 100;

            this.validAll();

            const price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;

            if (this.orderType === 'buy') {
                amount = this.getPercentBalance(percent, this.ttokenDigit);
                quantity = this.getQuantity(price, amount);
            } else {
                quantity = this.getPercentBalance(percent, this.ftokenDigit);
                amount = this.getAmount(price, quantity);
            }

            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },
        amountChanged() {
            this.validAll();

            if (this.amountErr) {
                return;
            }

            const price = this.price;
            let quantity = this.quantity;
            const amount = this.amount;

            if (!+price && +quantity) {
                this.price = this.getPrice(quantity, amount);
                return;
            }

            quantity = this.getQuantity(price, amount);
            !BigNumber.isEqual(quantity, this.quantity) && (this.quantity = quantity);
        },
        priceChanged() {
            this.validAll();

            if (this.priceErr) {
                return;
            }

            const price = this.price;
            const quantity = this.quantity;
            let amount = this.amount;

            amount = this.getAmount(price, quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },
        quantityChanged() {
            this.validAll();

            if (this.quantityErr) {
                return;
            }

            const price = this.price;
            const quantity = this.quantity;
            let amount = this.amount;

            if (!+price && +amount) {
                this.price = this.getPrice(quantity, amount);
                return;
            }

            amount = this.getAmount(price, quantity);
            !BigNumber.isEqual(amount, this.amount) && (this.amount = amount);
        },

        getPrice(quantity, amount) {
            const isRightQuantity = quantity
                                    && this.$validAmount(quantity) === 0
                                    && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            const isRightAmount = amount
                                    && this.$validAmount(amount) === 0
                                    && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            if (this.orderType === 'buy') {
                quantity = BigNumber.multi(quantity, 1 + taker);
            }
            return BigNumber.dividedToNumber(amount, quantity, this.ttokenDigit, 'nofix');
        },
        getPercentBalance(percent, digit) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0)) {
                return '';
            }
            const result = BigNumber.multi(percent, this.balance, digit, 'nofix');
            return BigNumber.isEqual(result, 0) ? '' : result;
        },
        getAmount(price, quantity) {
            const isRightPrice = price
                                && this.$validAmount(price) === 0
                                && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            const isRightQuantity = quantity
                                    && this.$validAmount(quantity) === 0
                                    && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            if (this.orderType !== 'buy') {
                return BigNumber.multi(price, quantity, this.ttokenDigit);
            }

            const amount = BigNumber.multi(price, quantity);
            return BigNumber.multi(amount, 1 + taker, this.ttokenDigit);
        },
        getQuantity(price, amount) {
            const isRightPrice = price
                                && this.$validAmount(price) === 0
                                && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            const isRightAmount = amount
                                    && this.$validAmount(amount) === 0
                                    && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            if (this.orderType === 'buy') {
                price = BigNumber.multi(price, 1 + taker);
            }
            return BigNumber.dividedToNumber(amount, price, this.ftokenDigit, 'nofix');
        },

        validPrice() {
            if (!this.price) {
                this.priceErr = '';
                return;
            }

            const result = this.$validAmount(this.price, this.ttokenDigit);

            if (result === 1) {
                this.priceErr = '格式不合法';
                return;
            }

            if (result === 2) {
                this.priceErr = '小数点位数不合法';
                return;
            }

            if (result !== 0) {
                this.priceErr = '格式不合法';
                return;
            }

            if (BigNumber.compared(this.minAmount || 0, this.price) > 0) {
                this.priceErr = '小于最小值';
                return;
            }

            this.priceErr = '';
        },
        validAmount() {
            if (!this.amount) {
                this.amountErr = '';
                return;
            }

            const result = this.$validAmount(this.amount, this.ttokenDigit);

            if (result === 1) {
                this.amountErr = '格式不合法';
                return;
            }

            if (result === 2) {
                this.amountErr = '小数点位数不合法';
                return;
            }

            if (result !== 0) {
                this.amountErr = '格式不合法';
                return;
            }

            if (this.orderType === 'buy' && BigNumber.compared(this.balance || 0, this.amount) < 0) {
                this.amountErr = '余额不足';
                return;
            }

            if (BigNumber.compared(this.minAmount || 0, this.amount) > 0) {
                this.amountErr = '小于最小值';
                return;
            }

            this.amountErr = '';
        },
        validQuantity() {
            if (!this.quantity) {
                this.quantityErr = '';
                return;
            }

            const result = this.$validAmount(this.quantity, this.ftokenDigit);

            if (result === 1) {
                this.quantityErr = '格式不合法';
                return;
            }

            if (result === 2) {
                this.quantityErr = '小数点位数不合法';
                return;
            }

            if (result !== 0) {
                this.quantityErr = '格式不合法';
                return;
            }

            if (this.orderType === 'sell' && BigNumber.compared(this.balance || 0, this.quantity) < 0) {
                this.quantityErr = '余额不足';
                return;
            }

            this.quantityErr = '';
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

            if (!this.price) {
                this.priceErr = 'price 不能为空';
            }
            if (!this.amount) {
                this.amountErr = 'amount 不能为空';
            }
            if (!this.quantity) {
                this.quantityErr = 'quantity 不能为空';
            }

            if (this.priceErr || this.amountErr || this.quantityErr) {
                return;
            }

            const activeAccount = this.$wallet.getActiveAccount();
            activeAccount.initPwd({
                submit: () => {
                    this.newOrder({
                        price: this.price,
                        quantity: this.quantity
                    });
                }
            });
        },
        newOrder({ price, quantity }) {
            const tradeToken = this.activeTxPair ? this.activeTxPair.ftoken : '';
            const quoteToken = this.activeTxPair ? this.activeTxPair.ttoken : '';

            this.isLoading = true;
            const tokenDigit = this.ftokenDetail.tokenDigit;
            quantity = BigNumber.toMin(quantity, tokenDigit);

            sendTx(newOrder, {
                tradeToken,
                quoteToken,
                side: this.orderType === 'buy' ? 0 : 1,
                price,
                quantity
            }).then(() => {
                this.isLoading = false;
                this.clearAll();
                this.$toast(this.$t('exchange.newOrderSuccess'));
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast(this.$t('exchange.newOrderFail'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";
$font-black: rgba(36, 39, 43, 0.8);

.input-wrapper {
    position: relative;
}
.tips {
    position: absolute;
    left: 50%;
    bottom: 42px;
    transform: translate(-50%, 0);
    background: #fff;
    box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
    border-radius: 2px;
    font-size: 12px;
    color: #5E6875;
    box-sizing: border-box;
    font-family: $font-normal, arial, sans-serif;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    width: auto;
    height: auto;
    &.active {
        min-width: 0;
        height: auto;
        opacity: 1;
        padding: 6px;
    }
    &::after {
        content: ' ';
        display: inline-block;
        border: 6px solid transparent;
        border-top: 6px solid #fff;
        position: absolute;
        bottom: -12px;
        left: 50%;
        margin-left: -6px;
    }
}

.order-wrapper {
    flex: 1;
    padding: 0 6px;

    .order-title {
        height: 17px;
        line-height: 17px;
        font-size: 12px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: $font-black;
        text-indent: 6px;
        border-left: 2px solid $blue;
        margin-bottom: 10px;
        .wallet {
            display: block;
            float: right;
            &::before {
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
        font-weight: 400;
        color: rgba(94, 104, 117, 1);
        width: 86px;
        white-space: nowrap;
    }

    .slider-wrapper {
        margin: 16px 5px;
    }

    .order-input {
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        &.b {
            margin-bottom: 10px;
        }
        &.err {
            border: 1px solid $red;
        }
        input {
            text-indent: 6px;
        }
        .ex-order-token {
            padding: 0 6px;
            color: rgba(94,104,117,0.58);
        }
    }

    .order-btn {
        height: 30px;
        line-height: 30px;
        text-align: center;
        margin-top: 12px;
        border-radius: 2px;
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: #fff;
        &.red {
            background: linear-gradient(270deg, rgba(226, 43, 116, 1) 0%, rgba(237, 81, 88, 1) 100%);
        }
        &.green {
            background: linear-gradient(270deg, rgba(0, 212, 208, 1) 0%, rgba(0, 215, 100, 1) 100%);
        }
        &.gray {
            color: rgba(29, 32, 36, 0.6);
            background: #f3f5f9;
        }
    }
}
</style>
