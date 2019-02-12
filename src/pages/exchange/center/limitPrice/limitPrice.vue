<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            {{ $t('exchange.limitPrice.title') }}
            <span class="fee">{{ $t('exchange.limitPrice.fee') }} Taker（0.0XX%）/ Maker（0.0XX%）</span>
        </div>

        <logout-view v-show="!isLogin"></logout-view>

        <div v-show="isLogin" class="ex-center-login">
            <order orderType="buy"></order>
            <div class="order-border"></div>
            <order orderType="sell" class="order-wrapper"></order>
        </div>
    </div>
</template>

<script>
import logoutView from './logout';
import order from './order.vue';

export default {
    components: {
        logoutView, order
    },
    created() {
        this.isLogin = !!this.$wallet.isLogin;
        this.getBalance();
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
    },
    destroyed() {
        this.$store.dispatch('stopLoopExchangeBalance');
    },
    data() {
        return {
            isLogin: !!this.$wallet.isLogin
        };
    },
    watch: {
        isLogin: function() {
            this.getBalance();
        }
    },
    methods: {
        getBalance() {
            if (!this.isLogin) {
                this.$store.dispatch('stopLoopExchangeBalance');
                return;
            }
            let activeAccount = this.$wallet.getActiveAccount();
            let addr = activeAccount.getDefaultAddr();
            this.$store.dispatch('startLoopExchangeBalance', addr);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "../center.scss";

.limit-price-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    font-size: 14px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    .fee {
        float: right;
        font-size: 12px;
        color: rgba(94,104,117,1);
    }
}
.ex-center-login {
    display: flex;
    flex-direction: row;
    flex: 1;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 8px 0 10px;
    .order-border {
        height: 100%;
        opacity: 0.136;
        border: 1px solid rgba(212,222,231,1);
    }
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";

.order-input.input-wrapper input {
    text-indent: 6px;
    color: #24272B;
    font-size: 12px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
}
</style>