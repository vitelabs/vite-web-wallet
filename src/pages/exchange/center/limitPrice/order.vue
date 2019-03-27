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

        <div class="order-row-title">{{ $t(`exchange.${orderType}.price`) }}</div>
        <vite-input class="order-input" :class="{'err': isPriceErr}"
                    v-model="price" @input="priceChanged">
            <span class="ex-order-token" slot="after">{{ ttokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t(`exchange.${orderType}.quantity`) }}
            <ul class="quantity-percent">
                <li class="__pointer" @click="percentChanged(0.25)">25%</li>
                <li class="__pointer" @click="percentChanged(0.5)">50%</li>
                <li class="__pointer" @click="percentChanged(0.75)">75%</li>
                <li class="__pointer" @click="percentChanged(1)">100%</li>
            </ul>
        </div>
        <vite-input class="order-input" :class="{'err': isQuantityErr}"
                    v-model="quantity" @input="quantityChanged">
            <span class="ex-order-token" slot="after">{{ ftokenShow }}</span>
        </vite-input>

        <div class="order-row-title">{{ $t('exchange.amount') }}</div>
        <vite-input class="order-input" :class="{'err': isAmountErr}"
                    v-model="amount" @input="amountChanged">
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
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';
import { newOrder } from 'services/exchange';

export default {
    components: { viteInput },
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
            isPriceErr: false,
            isAmountErr: false,
            isQuantityErr: false,
            isLoading: false,
            oldPrice: '',
            oldAmount: '',
            oldQuantity: ''
        };
    },
    watch: {
        activeTxPair: function () {
            if (+this.price) {
                return;
            }
            this.price = this.activeTxPair && this.activeTxPair.price ? this.activeTxPair.price : '';
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
        activeTx: function () {
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

            const balanceList = this.$store.state.exchangeBalance.balanceList;
            if (!tokenId || !balanceList || !balanceList[tokenId]) {
                return null;
            }

            return balanceList[tokenId];
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
        }
    },
    methods: {
        percentChanged(percent) {
            this.validAll();

            const price = this.price;
            let quantity = this.quantity;
            let amount = this.amount;

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
        amountChanged() {
            this.validAll();

            if (this.isAmountErr) {
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

            if (this.isPriceErr) {
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

            if (this.isQuantityErr) {
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
            const isRightQuantity = quantity && this.$validAmount(quantity) && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            const isRightAmount = amount && this.$validAmount(amount) && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            const tokenDigit = this.ttokenDetail.tokenDigit;
            const limit = tokenDigit >= 8 ? 8 : tokenDigit;

            return BigNumber.dividedToNumber(amount, quantity, limit, 'nofix');
        },
        getPercentBalance(percent, decimals) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0)) {
                return '';
            }
            const limit = decimals >= 8 ? 8 : decimals;
            const result = BigNumber.multi(percent, this.balance, limit, 'nofix');

            return BigNumber.isEqual(result, 0) ? '' : result;
        },
        getAmount(price, quantity) {
            const isRightPrice = price && this.$validAmount(price) && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            const isRightQuantity = quantity && this.$validAmount(quantity) && !BigNumber.isEqual(quantity, 0);
            if (!isRightQuantity) {
                return '';
            }

            const tokenDigit = this.ttokenDetail.tokenDigit;
            const limit = tokenDigit >= 8 ? 8 : tokenDigit;

            return BigNumber.multi(price, quantity, limit, 'nofix');
        },
        getQuantity(price, amount) {
            const isRightPrice = price && this.$validAmount(price) && !BigNumber.isEqual(price, 0);
            if (!isRightPrice) {
                return '';
            }

            const isRightAmount = amount && this.$validAmount(amount) && !BigNumber.isEqual(amount, 0);
            if (!isRightAmount) {
                return '';
            }

            const tokenDigit = this.ftokenDetail.tokenDigit;
            const limit = tokenDigit >= 8 ? 8 : tokenDigit;

            return BigNumber.dividedToNumber(amount, price, limit, 'nofix');
        },
        getPercent(val) {
            if (!this.balance || BigNumber.isEqual(this.balance, 0)
                || !val || !this.$validAmount(val) || BigNumber.isEqual(val, 0)) {
                return 0;
            }

            return BigNumber.dividedToNumber(val, this.balance, 2);
        },

        validPrice() {
            if (!this.ttokenDetail) {
                return;
            }
            const tokenDigit = this.ttokenDetail.tokenDigit;
            this.isPriceErr = this.price && !this.$validAmount(this.price, tokenDigit);
        },
        validAmount() {
            const tokenDigit = this.ttokenDetail.tokenDigit;
            this.isAmountErr = this.amount && !this.$validAmount(this.amount, tokenDigit)
                || (this.orderType === 'buy' && BigNumber.compared(this.balance || 0, this.amount) < 0);
        },
        validQuantity() {
            const tokenDigit = this.ftokenDetail.tokenDigit;
            this.isQuantityErr = this.quantity && !this.$validAmount(this.quantity, tokenDigit)
                || (this.orderType === 'sell' && BigNumber.compared(this.balance || 0, this.quantity) < 0);
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
            font-size: 12px;

            li {
                display: inline-block;
                box-sizing: border-box;
                border-bottom: 1px dashed $blue;
                font-family: $font-normal, arial, sans-serif;
                color: $blue;
                line-height: 16px;
                margin-left: 10px;

                &:active {
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
