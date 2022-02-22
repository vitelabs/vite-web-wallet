<template>
    <div class="order-wrapper">
        <div class="dex-input-wrapper">
            <div class="ex-order-token">
                {{ $t(`mobileTradeCenter.${orderType}.price`) }} ({{ originQuoteTokenSymbol }})
            </div>
            <div class="else-input-wrapper" :class="{'err': priceErr}">
                <span v-show="focusInput === 'price' && priceErr" class="tips">{{  priceErr || '' }}</span>
                <span v-show="isShowBuyMining" class="tips">
                    {{ $t('tradeCenter.buyMiningPrice', { price: buyMiningPrice }) }}
                </span>
                <span v-show="isShowSellMining" class="tips">
                    {{ $t('tradeCenter.sellMiningPrice', { price: sellMiningPrice }) }}
                </span>
                <vite-input v-model="price" @input="priceChanged" type="number"
                            @focus="showTips('price')" @blur="hideTips('price')">
                    <span class="real-price __ellipsis" slot="after">{{ realPrice }}</span>
                </vite-input>
            </div>
        </div>

        <div class="dex-input-wrapper">
            <div class="ex-order-token">
                {{ $t(`mobileTradeCenter.${orderType}.quantity`) }} ({{ originTradeTokenSymbol }})
                <dex-balance :tokenShow="orderType === 'sell' ? originTradeTokenSymbol : originQuoteTokenSymbol"
                             :balance="balance"></dex-balance>
            </div>
            <div class="else-input-wrapper" :class="{'err': quantityErr}">
                <span v-show="focusInput === 'quantity' && quantityErr" class="tips">{{ quantityErr }}</span>
                <vite-input v-model="quantity" @input="quantityChanged" type="number"
                            @focus="showTips('quantity')" @blur="hideTips('quantity')">
                </vite-input>
            </div>
        </div>

        <div class="dex-input-wrapper">
            <div class="ex-order-token">
                {{ $t("trade.amount") }} ({{ originQuoteTokenSymbol }})
            </div>
            <div class="else-input-wrapper" :class="{'err': amountErr}">
                <span v-show="focusInput === 'amount' && amountErr" class="tips">{{ amountErr }}</span>
                <vite-input v-model="amount" @input="amountChanged" type="number"
                            @focus="showTips('amount')" @blur="hideTips('amount')">
                </vite-input>
            </div>
        </div>

        <div class="slider-wrapper">
            <slider class="dex-order" :class="orderType" :min="0" :max="100" :default="0"
                    v-model="percent" v-on:drag="percentChanged"></slider>
        </div>

        <div class="order-btn __pointer" :class="{
            'red': orderType === 'sell',
            'green': orderType === 'buy',
            'gray': isLoading || amountErr || priceErr || quantityErr || activeTxPairIsClose
        }" @click="toSubmit">{{ $t(`trade.${orderType}.title`, { token: ftokenShow }) }}</div>
    </div>
</template>

<script>
import dexBalance from './dexBalance';
import slider from 'components/slider';
import viteInput from 'components/viteInput';
import viteConfirm from 'h5Components/confirm/index.js';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'h5Utils/sendTx';
import { verifyAmount, checkAmountFormat } from 'h5Utils/validations';

export default {
    components: { viteInput, slider, dexBalance },
    props: {
        orderType: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.initNormalFormatPrice();
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
            if (!this.activeTxPair
                || (old && old.symbol === this.activeTxPair.symbol)) {
                return;
            }

            this.initNormalFormatPrice();
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
        isOperatorTxPairLoading() {
            return this.$store.state.exchangeTokens.isLoading;
        },
        operatorInfo() {
            return this.$store.state.exchangeTokens.operator;
        },
        isShowBuyMining() {
            return this.orderType === 'buy' && this.focusInput === 'price' && !this.priceErr && this.buyMiningPrice;
        },
        isShowSellMining() {
            return this.orderType === 'sell' && this.focusInput === 'price' && !this.priceErr && this.sellMiningPrice;
        },
        buyMiningPrice() {
            return this.$store.getters.showActiveTxPairBuyMiningPrice;
        },
        sellMiningPrice() {
            return this.$store.getters.showActiveTxPairSellMiningPrice;
        },
        blockingLevel() {
            return this.$store.getters.dexBlockingLever;
        },
        fee() {
            return this.$store.getters.exBuyOrderFee;
        },
        realPrice() {
            if (!this.rate || this.priceErr || !this.price) {
                return '';
            }

            const pre = `≈${ this.$store.getters.currencySymbol }`;

            if (!this.activeTxPair) {
                return `${ pre }0`;
            }

            const realPrice = BigNumber.multi(this.price || 0, this.rate || 0, 6);
            return `${ pre }${ BigNumber.onlyFormat(realPrice, 2) }`;
        },
        rate() {
            return this.$store.getters.activeTxPairQuoteCurrencyRate || null;
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
            if (!+balance) {
                return '0';
            }

            if (this.orderType === 'buy') {
                const basicAmount = BigNumber.toMin(this.amount || 0, this.ttokenDetail.tokenDecimals);
                return BigNumber.dividedToNumber(basicAmount || 0, balance, 3, 'nofix');
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
            return this.$store.getters.quoteTokenDecimalsLimit;
        },
        ftokenDigit() {
            return this.$store.getters.tradeTokenDecimalsLimit;
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

        initNormalFormatPrice() {
            const price = this.activeTxPair && this.activeTxPair.closePrice
                ? this.activeTxPair.closePrice
                : '';
            if (!+price) {
                this.price = '';
                return;
            }
            this.price = BigNumber.normalFormatNum(price, this.ttokenDigit);
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
            this.priceErr = verifyAmount({
                formatDecimals: this.ttokenDigit,
                integerBits: 12
            })(this.price);
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

        toSubmit() {
            if (this.isLoading || this.activeTxPairIsClose
                || this.amountErr || this.priceErr || this.quantityErr) {
                return;
            }

            statistics.event(`H5${ this.$route.name }`, `limitPrice-${ this.orderType }`, this.address || '');

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

            // Sell order or No activeTxPair or No operatorInfo or No dager
            if (this.orderType === 'sell'
                || this.isOperatorTxPairLoading || !this.activeTxPair
                || (this.operatorInfo && this.operatorInfo.level)) {
                this.prepareOrder();
                return;
            }

            const tradeTokenSymbol = this.activeTxPair.tradeTokenSymbol.split('-')[0];
            const quoteTokenSymbol = this.activeTxPair.quoteTokenSymbol.split('-')[0];

            viteConfirm({
                size: 'small',
                type: 'description',
                title: this.$t('tradeCenter.operator.confirmTitle'),
                singleBtn: true,
                closeBtn: { show: true },
                leftBtn: {
                    text: this.$t('btn.understand'),
                    click: () => {
                        this.prepareOrder();
                    }
                },
                content: this.$t('tradeCenter.operator.confirmText', { symbol: `${ tradeTokenSymbol }/${ quoteTokenSymbol }` })
            });
        },
        prepareOrder() {
            this.newOrder({
                price: this.price,
                quantity: this.quantity
            });
        },
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
                methodName: 'dexPlaceOrder',
                data: { tradeToken, quoteToken, side, price, quantity }
            }).then(() => {
                this.isLoading = false;
                this.clearAll();
                // this.$toast(this.$t('trade.newOrderSuccess'));
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                // this.$toast(this.$t('trade.newOrderFail'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

$font-black: rgba(36, 39, 43, 0.8);

.dex-input-wrapper {
    position: relative;
    @include font-normal();
    margin-top: 4px;
    .symbol {
        font-size: 14px;
        font-family: $font;
        font-weight: 300;
        padding: 0 14px;
        color: rgba(62,74,89,0.7);
    }
    .ex-order-token {
        font-size: 14px;
        height: 38px;
        line-height: 38px;
        @include font-normal();
        white-space: nowrap;
        color: rgba(62,74,89,0.7);
    }
    .else-input-wrapper {
        position: relative;
        border-radius: 2px;
        box-sizing: border-box;
        flex: 1;
        height: 40px;
        &.err {
            /deep/ .input-wrapper {
                border: 1px solid $red;
            }
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
    line-height: 16px;
    color: #5e6875;
    box-sizing: border-box;
    @include font-normal();
    display: block;
    left: 50%;
    bottom: 50px;
    padding: 6px 12px;
    word-break: break-all;
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
    padding-bottom: 4px;

    .slider-wrapper {
        margin: 13px 5px;
    }

    .order-btn {
        height: 50px;
        line-height: 50px;
        text-align: center;
        border-radius: 2px;
        font-size: 16px;
        @include font-bold();
        color: #fff;
        &.red {
            background: $red;
        }
        &.green {
            background: $green;
        }
        &.gray {
            color: rgba(29, 32, 36, 0.6);
            background: #f3f5f9;
        }
    }
}
.real-price {
    @include font-normal();
    max-width: 150px;
    box-sizing: border-box;
    padding: 0 14px;
    font-size: 14px;
    color: rgba(62, 74, 89, 0.45);
}
</style>

<style lang="scss">
@import "~h5Assets/scss/vars.scss";

.dex-input-wrapper .input-wrapper {
    line-height: 40px;
    border: none;
    height: 100%;
    input {
        font-family: $font;
        font-size: 16px;
        color: rgba(36,39,43,1);
        text-indent: 14px;
    }
}
</style>
