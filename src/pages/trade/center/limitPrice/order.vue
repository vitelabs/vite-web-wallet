<template>
    <div class="order-wrapper">
        <div class="order-title">
            {{ $t(`trade.${orderType}.title`, { token: ftokenShow }) }}
            <div class="wallet">
                {{ balance || '0' }}
                <span class="ex-order-token">
                    {{ orderType === 'buy' ? ttokenShow : ftokenShow }}
                </span>
            </div>
        </div>

        <div class="dex-input-wrapper b">
            <span class="ex-order-token __ellipsis">
                {{ $t(`trade.${orderType}.price`, { token: ttokenShow }) }}
            </span>
            <div class="else-input-wrapper" :class="{'err': priceErr}">
                <span class="tips" :class="{'active':
                    focusInput === 'price' && priceErr
                }">{{  priceErr ? $t(priceErr, { digit: ttokenDigit }) : '' }}</span>
                <vite-input v-model="price" @input="priceChanged"
                            @focus="showTips('price')" @blur="hideTips('price')">
                    <span class="real-price __ellipsis" slot="after">{{ realPrice }}</span>
                </vite-input>
            </div>
        </div>

        <div class="dex-input-wrapper">
            <span class="ex-order-token __ellipsis">
                {{ $t(`trade.${orderType}.quantity`, { token: ftokenShow }) }}
            </span>
            <div class="else-input-wrapper" :class="{'err': quantityErr}">
                <span class="tips" :class="{'active':
                    focusInput === 'quantity' && quantityErr
                }">{{  $t(quantityErr, { digit: ftokenDigit }) }}</span>
                <vite-input v-model="quantity" @input="quantityChanged"
                            @focus="showTips('quantity')" @blur="hideTips('quantity')">
                </vite-input>
            </div>
        </div>

        <div class="slider-wrapper">
            <slider :class="orderType" :min="0" :max="100" :default="0"
                    v-model="percent" v-on:drag="percentChanged"></slider>
        </div>

        <div class="dex-input-wrapper">
            <span class="ex-order-token __ellipsis">
                {{ $t('trade.quantityTitle', { quantity: ttokenShow }) }}
            </span>
            <div class="else-input-wrapper" :class="{'err': amountErr}">
                <span class="tips" :class="{'active':
                    focusInput === 'amount' && amountErr
                }">{{ $t(amountErr, {
                    digit: ttokenDigit,
                    amount: minAmount,
                    token: ttokenShow
                }) }}</span>
                <vite-input v-model="amount" @input="amountChanged"
                            @focus="showTips('amount')" @blur="hideTips('amount')">
                </vite-input>
            </div>
        </div>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'green': orderType === 'buy',
            'gray': isLoading || amountErr || priceErr || quantityErr
        }" @click="_clickBtn">{{ $t(`trade.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import viteInput from 'components/viteInput';
import slider from 'components/slider';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';
import { newOrder } from 'services/trade';

const taker = process.env.NODE_ENV === 'dexTestNet' ? 0.0025 : 0.001;
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
        },
        minAmount: function () {
            this.validAll();
        },
        activeTx: function () {
            this.price = this.activeTx.price;

            if (!this.activeTx.num) {
                this.priceChanged();
                return;
            }

            if (!(this.orderType === 'buy' && this.activeTx.txSide === 1)
                && !(this.orderType === 'sell' && this.activeTx.txSide === 0)) {
                this.priceChanged();
                return;
            }

            const quantity = BigNumber.normalFormatNum(this.activeTx.num, this.ftokenDigit);

            if (this.orderType === 'sell'
                && BigNumber.compared(this.balance || 0, quantity) < 0) {
                if (+this.balance === 0) {
                    this.priceChanged();
                    return;
                }
                this.quantity = BigNumber.normalFormatNum(this.balance, this.ftokenDigit);
                this.quantityChanged();
                return;
            }

            if (this.orderType === 'buy') {
                const amount = this.getAmount(this.price, quantity);
                if (BigNumber.compared(this.balance || 0, amount) < 0) {
                    if (+this.balance === 0) {
                        return;
                    }
                    this.amount = BigNumber.normalFormatNum(this.balance || '', this.ttokenDigit);
                    this.quantity = this.getQuantity(this.price, this.amount);
                    return;
                }
            }

            this.quantity = quantity;
            this.quantityChanged();
        }
    },
    computed: {
        realPrice() {
            if (!this.rate || this.priceErr || !this.price) {
                return '';
            }

            let pre = '≈$';
            if (this.$i18n.locale === 'zh') {
                pre = '≈￥';
            }
            if (!this.activeTxPair) {
                return `≈${ pre }0`;
            }

            return pre + BigNumber.multi(this.price || 0, this.rate || 0, 2);
        },
        rate() {
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const tokenId = this.activeTxPair && this.activeTxPair.ttoken ? this.activeTxPair.ttoken : null;
            const coin = this.$store.state.exchangeRate.coins[this.$i18n.locale || 'zh'];
            if (!tokenId || !rateList[tokenId]) {
                return null;
            }

            return rateList[tokenId][coin] || null;
        },
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
            if (!this.availableBalance
                || (this.orderType === 'buy' && !this.ttokenDetail)
                || (this.orderType !== 'buy' && !this.ftokenDetail)) {
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
            const pariDigit = this.activeTxPair.toDecimals;

            const digit = tDigit > pariDigit ? pariDigit : tDigit;
            return digit > maxDigit ? maxDigit : digit;
        },
        ftokenDigit() {
            if (!this.ftokenDetail || !this.activeTxPair) {
                return 0;
            }

            const fDigit = this.ftokenDetail.tokenDigit;
            const pariDigit = this.activeTxPair.fromDecimals;

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

        // price = amount / quantity / (1+taker)
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
        // amount = quantity * price * (1+taker)
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
        // quantity = amount/price/（1+taker)
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

            let minAmount = BigNumber.toMin(amount, this.ttokenDetail.tokenDigit);
            const minPrice = BigNumber.toMin(price, this.ttokenDetail.tokenDigit);

            if (this.orderType === 'buy') {
                minAmount = BigNumber.dividedToNumber(minAmount, 1 + taker, 0);
            }

            return BigNumber.dividedToNumber(minAmount, minPrice, this.ftokenDigit, 'nofix');
        },

        validPrice() {
            if (!this.price) {
                this.priceErr = '';
                return;
            }

            const result = this.$validAmount(this.price, this.ttokenDigit);

            if (result === 1) {
                this.priceErr = 'hint.amtFormat';
                return;
            }

            if (result === 2) {
                this.priceErr = 'trade.limitPrice.validMaxDigit';
                return;
            }

            if (result !== 0) {
                this.priceErr = 'hint.amtFormat';
                return;
            }

            if (+this.price === 0) {
                this.priceErr = 'trade.limitPrice.bigger0';
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
                this.amountErr = 'hint.amtFormat';
                return;
            }

            if (result === 2) {
                this.amountErr = 'trade.limitPrice.validMaxDigit';
                return;
            }

            if (result !== 0) {
                this.amountErr = 'hint.amtFormat';
                return;
            }

            if (this.orderType === 'buy' && BigNumber.compared(this.balance || 0, this.amount) < 0) {
                this.amountErr = 'hint.insufficientBalance';
                return;
            }

            if (BigNumber.compared(this.minAmount || 0, this.amount) > 0) {
                this.amountErr = 'trade.limitPrice.validAmountDigit';
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
                this.quantityErr = 'hint.amtFormat';
                return;
            }

            if (result === 2) {
                this.quantityErr = 'trade.limitPrice.validMaxDigit';
                return;
            }

            if (result !== 0) {
                this.quantityErr = 'hint.amtFormat';
                return;
            }

            if (this.orderType === 'sell' && BigNumber.compared(this.balance || 0, this.quantity) < 0) {
                this.quantityErr = 'hint.insufficientBalance';
                return;
            }

            if (+this.quantity === 0) {
                this.quantityErr = 'trade.limitPrice.bigger0';
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

            if (!+this.price) {
                this.priceErr = 'trade.limitPrice.priceNotNull';
            }
            if (!+this.amount) {
                this.amountErr = 'trade.limitPrice.amountNotNull';
            }
            if (!+this.quantity) {
                this.quantityErr = 'trade.limitPrice.quantityNotNull';
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
            }, {
                pow: true,
                powConfig: {
                    isShowCancel: true,
                    cancel: () => {
                        this.isLoading = false;
                    }
                }
            }).then(() => {
                this.isLoading = false;
                this.clearAll();
                this.$toast(this.$t('trade.newOrderSuccess'));
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast(this.$t('trade.newOrderFail'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";
$font-black: rgba(36, 39, 43, 0.8);

.dex-input-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 30px;
    line-height: 30px;
    font-family: $font-normal, arial, sans-serif;
    &.b {
        margin-bottom: 10px;
    }
    .real-price {
        max-width: 100px;
        box-sizing: border-box;
        padding: 0 6px;
        font-size: 12px;
        color: rgba(94,104,117,0.58);
    }
    .ex-order-token {
        font-size: 12px;
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;
        color: rgba(94, 104, 117, 1);
        width: 95px;
        white-space: nowrap;
        margin-right: 6px;
    }
    .else-input-wrapper {
        position: relative;
        border-radius: 2px;
        border: 1px solid rgba(212,222,231,1);
        box-sizing: border-box;
        flex: 1;
        &.err {
            border: 1px solid $red;
        }
    }
}

.tips {
    position: absolute;
    left: 50%;
    bottom: 42px;
    z-index: 10;
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
    width: 0;
    height: auto;
    white-space: nowrap;
    &.active {
        display: block;
        min-width: 0;
        width: auto;
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

    .slider-wrapper {
        margin: 6px 5px;
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

<style lang="scss">
@import "~assets/scss/vars.scss";

.dex-input-wrapper .input-wrapper {
    height: 100%;
    line-height: 30px;
    border: none;
    input {
        font-family: $font-normal, arial, sans-serif;
        font-size: 12px;
        color: #24272B;
        text-indent: 6px;
    }
}
</style>
