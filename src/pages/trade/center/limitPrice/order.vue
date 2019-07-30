<template>
    <div class="order-wrapper">
        <div class="order-title">
            {{ $t(`trade.${orderType}.title`, { token: ftokenShow }) }}
            <div class="wallet">
                {{ balance || "0" }}
                <span class="ex-order-token">
                    {{ orderType === "buy" ? ttokenShow : ftokenShow }}
                </span>
            </div>
        </div>

        <div class="dex-input-wrapper b">
            <span class="ex-order-token __ellipsis">
                {{
                    $t(`trade.${orderType}.price`, {
                        token: originQuoteTokenSymbol
                    })
                }}
            </span>
            <div class="else-input-wrapper" :class="{'err': priceErr}">
                <span class="tips" :class="{'active':
                    focusInput === 'price' && priceErr
                }">{{  priceErr || '' }}</span>
                <vite-input v-model="price" @input="priceChanged" type="number"
                            @focus="showTips('price')" @blur="hideTips('price')">
                    <span class="real-price __ellipsis" slot="after">{{ realPrice }}</span>
                </vite-input>
            </div>
        </div>

        <div class="dex-input-wrapper">
            <span class="ex-order-token __ellipsis">
                {{
                    $t(`trade.${orderType}.quantity`, {
                        token: originTradeTokenSymbol
                    })
                }}
            </span>
            <div class="else-input-wrapper" :class="{'err': quantityErr}">
                <span class="tips" :class="{'active':
                    focusInput === 'quantity' && quantityErr
                }">{{ quantityErr }}</span>
                <vite-input v-model="quantity" @input="quantityChanged" type="number"
                            @focus="showTips('quantity')" @blur="hideTips('quantity')">
                </vite-input>
            </div>
        </div>

        <div class="slider-wrapper">
            <slider class="dex-order" :class="orderType" :min="0" :max="100" :default="0"
                    v-model="percent" v-on:drag="percentChanged"></slider>
        </div>

        <div class="dex-input-wrapper">
            <span class="ex-order-token __ellipsis">
                {{
                    $t("trade.quantityTitle", {
                        quantity: originQuoteTokenSymbol
                    })
                }}
            </span>
            <div class="else-input-wrapper" :class="{'err': amountErr}">
                <span class="tips" :class="{'active':
                    focusInput === 'amount' && amountErr
                }">{{ amountErr }}</span>
                <vite-input v-model="amount" @input="amountChanged" type="number"
                            @focus="showTips('amount')" @blur="hideTips('amount')">
                </vite-input>
            </div>
        </div>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'green': orderType === 'buy',
            'gray': isLoading || amountErr || priceErr || quantityErr || activeTxPairIsClose
        }" @click="_clickBtn">{{ $t(`trade.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import slider from 'components/slider';
import viteInput from 'components/viteInput';
import { initPwd } from 'components/password/index.js';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';
import { verifyAmount, checkAmountFormat } from 'utils/validations';
import { execWithValid } from 'utils/execWithValid';
import statistics from 'utils/statistics';

export default {
    components: { viteInput, slider },
    props: {
        orderType: {
            type: String,
            default: ''
        }
    },
    mounted() {
        const price = this.activeTxPair && this.activeTxPair.closePrice
            ? this.activeTxPair.closePrice
            : '';
        this.price = BigNumber.normalFormatNum(price, this.ttokenDigit);
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
            if (old && old.symbol === this.activeTxPair.symbol) {
                return;
            }

            const price = this.activeTxPair && this.activeTxPair.closePrice
                ? this.activeTxPair.closePrice
                : '';
            this.price = BigNumber.normalFormatNum(price, this.ttokenDigit);
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
            this.price = BigNumber.normalFormatNum(this.activeTx.price, this.ttokenDigit);

            if (!this.activeTx.num) {
                this.priceChanged();
                return;
            }

            if (
                !(this.orderType === 'buy' && this.activeTx.side === 1)
                && !(this.orderType === 'sell' && this.activeTx.side === 0)
            ) {
                this.priceChanged();
                return;
            }

            const quantity = BigNumber.normalFormatNum(this.activeTx.num, this.ftokenDigit);

            if (
                this.orderType === 'sell'
                && BigNumber.compared(this.balance || 0, quantity) < 0
            ) {
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
                    this.amount = BigNumber.normalFormatNum(this.balance || '',
                        this.ttokenDigit);
                    this.quantity = this.getQuantity(this.price, this.amount);
                    return;
                }
            }

            this.quantity = BigNumber.normalFormatNum(quantity, this.ftokenDigit);
            this.quantityChanged();
        },
        ttokenDigit: function () {
            if (this.price) {
                this.price = BigNumber.normalFormatNum(this.price, this.ttokenDigit);
            }
            if (this.amount) {
                this.amount = BigNumber.normalFormatNum(this.amount, this.ttokenDigit);
            }
        },
        ftokenDigit: function () {
            if (this.quantity) {
                this.quantity = BigNumber.normalFormatNum(this.quantity, this.ftokenDigit);
            }
        }
    },
    computed: {
        blockingLevel() {
            return this.$store.getters.dexBlockingLever;
        },
        fee() {
            return this.$store.getters.exMakerFee;
        },
        realPrice() {
            if (!this.rate || this.priceErr || !this.price) {
                return '';
            }

            const pre = this.$store.state.env.currency === 'cny' ? '≈¥' : '≈$';

            if (!this.activeTxPair) {
                return `${ pre }0`;
            }

            return pre + BigNumber.multi(this.price || 0, this.rate || 0, 2);
        },
        rate() {
            const rateList = this.$store.state.exchangeRate.rateMap || {};
            const tokenId
                = this.activeTxPair && this.activeTxPair.quoteToken
                    ? this.activeTxPair.quoteToken
                    : null;
            const coin = this.$store.state.env.currency;

            if (!tokenId || !rateList[tokenId]) {
                return null;
            }
            return rateList[tokenId][`${ coin }Rate`] || null;
        },
        minAmount() {
            const minAmount = this.$store.state.exchangeLimit.minAmount;
            const quoteTokenSymbol = this.activeTxPair
                ? this.activeTxPair.quoteTokenSymbol
                : '';

            if (
                !minAmount
                || !quoteTokenSymbol
                || !minAmount[quoteTokenSymbol]
            ) {
                return 0;
            }
            return minAmount[quoteTokenSymbol];
        },
        percent() {
            if (
                !this.availableBalance
                || (this.orderType === 'buy' && !this.ttokenDetail)
                || (this.orderType !== 'buy' && !this.ftokenDetail)
            ) {
                return '0';
            }

            const balance = this.availableBalance;

            if (this.orderType === 'buy') {
                const basicAmount = BigNumber.toMin(this.amount || 0,
                    this.ttokenDetail.tokenDecimals);
                return BigNumber.dividedToNumber(basicAmount || 0,
                    balance,
                    3,
                    'nofix');
            }

            const basicQuantity = BigNumber.toMin(this.quantity || 0,
                this.ftokenDetail.tokenDecimals);
            return BigNumber.dividedToNumber(basicQuantity || 0,
                balance,
                3,
                'nofix');
        },
        rawBalance() {
            if (!this.activeTxPair) {
                return null;
            }

            let tokenId = this.activeTxPair.tradeToken;
            if (this.orderType === 'buy') {
                tokenId = this.activeTxPair.quoteToken;
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
            return this.rawBalance && this.rawBalance.available
                ? this.rawBalance.available
                : '0';
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
        originTradeTokenSymbol() {
            return this.activeTxPair
                ? this.activeTxPair.tradeTokenSymbol.split('-')[0]
                : '';
        },
        originQuoteTokenSymbol() {
            return this.activeTxPair
                ? this.activeTxPair.quoteTokenSymbol.split('-')[0]
                : '';
        },
        ftokenShow() {
            return this.activeTxPair ? this.activeTxPair.tradeTokenSymbol : '';
        },
        ttokenShow() {
            return this.activeTxPair ? this.activeTxPair.quoteTokenSymbol : '';
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        activeTx() {
            return this.$store.state.exchangeActiveTx.activeTx;
        },
        ttokenDigit() {
            return this.$store.state.exchangeTokenDecimalsLimit.quoteToken;
        },
        ftokenDigit() {
            return this.$store.state.exchangeTokenDecimalsLimit.tradeToken;
        },
        closeMarket() {
            return this.$store.state.exchangeMarket.marketClosed;
        },
        activeTxPairIsClose() {
            if (!this.activeTxPair) {
                return true;
            }
            return this.closeMarket.find(v => v.symbol === this.activeTxPair.symbol);
        },
        address() {
            return this.$store.getters.activeAddr;
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

            !BigNumber.isEqual(quantity, this.quantity)
                && (this.quantity = quantity);
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
            !BigNumber.isEqual(quantity, this.quantity)
                && (this.quantity = quantity);
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

        // price = amount / quantity / (1+fee)
        getPrice(quantity, amount) {
            const isRightQuantity = quantity
                                    && checkAmountFormat(quantity) === 0
                                    && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            const isRightAmount = amount
                                    && checkAmountFormat(amount) === 0
                                    && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            if (this.orderType === 'buy') {
                quantity = BigNumber.multi(quantity, 1 + this.fee);
            }
            return BigNumber.dividedCeil(amount,
                quantity,
                this.ttokenDigit,
                'nofix');
        },
        getPercentBalance(percent, digit) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0)) {
                return '';
            }
            const result = BigNumber.multi(percent,
                this.balance,
                digit,
                'nofix');
            return BigNumber.isEqual(result, 0) ? '' : result;
        },
        // amount = quantity * price * (1+fee)
        getAmount(price, quantity) {
            const isRightPrice = price
                                && checkAmountFormat(price) === 0
                                && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            const isRightQuantity = quantity
                                    && checkAmountFormat(quantity) === 0
                                    && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            if (this.orderType !== 'buy') {
                return BigNumber.multi(price, quantity, this.ttokenDigit);
            }

            const amount = BigNumber.multi(price, quantity);
            return BigNumber.multi(amount, 1 + this.fee, this.ttokenDigit);
        },
        // quantity = amount/price/（1+fee)
        getQuantity(price, amount) {
            const isRightPrice = price
                                && checkAmountFormat(price) === 0
                                && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            const isRightAmount = amount
                                    && checkAmountFormat(amount) === 0
                                    && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            const decimals = this.ttokenDetail
                ? this.ttokenDetail.tokenDecimals
                : 0;
            let minAmount = BigNumber.toMin(amount, decimals);
            const minPrice = BigNumber.toMin(price, decimals);

            if (this.orderType === 'buy') {
                minAmount = BigNumber.dividedToNumber(minAmount, 1 + this.fee, 0);
            }

            // const _qSmall = BigNumber.dividedToNumber(minAmount, minPrice, this.ftokenDigit);
            // const _qBig = BigNumber.dividedCeil(minAmount, minPrice, this.ftokenDigit);
            return BigNumber.dividedToNumber(minAmount, minPrice, this.ftokenDigit);
        },

        validPrice() {
            this.priceErr = verifyAmount({ formatDecimals: this.ttokenDigit })(this.price);
        },
        validAmount() {
            this.amountErr = verifyAmount({
                formatDecimals: this.ttokenDigit,
                balance: this.orderType === 'buy' ? this.balance || 0 : undefined,
                minAmount: this.minAmount,
                errorMap: {
                    lessMin: this.$t('trade.limitPrice.validAmount', {
                        amount: this.minAmount,
                        token: this.ttokenShow
                    })
                }
            })(this.amount);
        },
        validQuantity() {
            this.quantityErr = verifyAmount({
                formatDecimals: this.ftokenDigit,
                balance: this.orderType === 'sell' ? this.balance || 0 : undefined
            })(this.quantity);
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

        _clickBtn: execWithValid(function () {
            if (this.isLoading || this.activeTxPairIsClose) {
                return;
            }

            statistics.event(this.$route.name, `limitPrice-${ this.orderType }`, this.address || '');

            this.validPrice();
            this.validAmount();
            this.validQuantity();

            if (!this.price) {
                this.priceErr = this.$t('trade.limitPrice.priceNotNull');
            }
            if (!this.amount) {
                this.amountErr = this.$t('trade.limitPrice.amountNotNull');
            }
            if (!this.quantity) {
                this.quantityErr = this.$t('trade.limitPrice.quantityNotNull');
            }

            if (this.priceErr || this.amountErr || this.quantityErr) {
                return;
            }

            initPwd({
                // yztood
                submit: () => {
                    this.newOrder({
                        price: this.price,
                        quantity: this.quantity
                    });
                }
            });
        }),
        newOrder({ price, quantity }) {
            if (this.blockingLevel === 3) {
                this.$toast(this.$t('tradeCenter.blocking'));
                return;
            }

            const tradeToken = this.activeTxPair
                ? this.activeTxPair.tradeToken
                : '';
            const quoteToken = this.activeTxPair
                ? this.activeTxPair.quoteToken
                : '';
            const side = this.orderType === 'buy' ? 0 : 1;

            this.isLoading = true;
            const tokenDecimals = this.ftokenDetail.tokenDecimals;
            quantity = BigNumber.toMin(quantity, tokenDecimals);

            sendTx({
                methodName: 'dexFundNewOrder',
                data: { tradeToken, quoteToken, side, price, quantity },
                config: {
                    pow: true,
                    powConfig: {
                        isShowCancel: true,
                        cancel: () => {
                            this.isLoading = false;
                        }
                    }
                }
            })
                .then(() => {
                    this.isLoading = false;
                    this.clearAll();
                    this.$toast(this.$t('trade.newOrderSuccess'));
                })
                .catch(err => {
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
    @include font-family-normal();
    &.b {
        margin-bottom: 10px;
    }
    .real-price {
        font-family: $font-H;
        max-width: 100px;
        box-sizing: border-box;
        padding: 0 6px;
        font-size: 12px;
        color: rgba(94, 104, 117, 0.58);
    }
    .ex-order-token {
        font-size: 12px;
        @include font-family-normal();
        font-weight: 400;
        color: rgba(94, 104, 117, 1);
        width: 95px;
        white-space: nowrap;
        margin-right: 6px;
    }
    .else-input-wrapper {
        position: relative;
        border-radius: 2px;
        border: 1px solid rgba(212, 222, 231, 1);
        box-sizing: border-box;
        flex: 1;
        &.err {
            border: 1px solid $red;
        }
    }
}

.tips {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, 0);
    background: #fff;
    box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    font-size: 12px;
    color: #5e6875;
    box-sizing: border-box;
    @include font-family-normal();
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    width: 0;
    line-height: 12px;
    white-space: nowrap;
    &.active {
        display: block;
        min-width: 0;
        width: auto;
        opacity: 1;
        left: 50%;
        bottom: 42px;
        padding: 6px 12px;
    }
    &::after {
        content: " ";
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
        @include font-family-bold();
        font-weight: 600;
        color: #1d2024;
        margin-bottom: 10px;
        .wallet {
            font-family: $font-H;
            display: block;
            float: right;
            &::before {
                content: "";
                display: inline-block;
                width: 16px;
                height: 16px;
                background: url("~assets/imgs/ex-wallet-icon.svg");
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
        @include font-family-bold();
        font-weight: 600;
        color: #fff;
        &.red {
            background: linear-gradient(
                270deg,
                rgba(226, 43, 116, 1) 0%,
                rgba(237, 81, 88, 1) 100%
            );
        }
        &.green {
            background: linear-gradient(
                270deg,
                rgba(0, 212, 208, 1) 0%,
                rgba(0, 215, 100, 1) 100%
            );
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
        font-family: $font-H;
        font-size: 12px;
        color: #1d2024;
        text-indent: 6px;
    }
}
</style>
