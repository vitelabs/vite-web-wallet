<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            {{ $t('exchange.limitPrice.title') }}
            <span class="fee">{{ $t('exchange.limitPrice.fee') }} Taker（0.0XX%）/ Maker（0.0XX%）</span>
        </div>
        <logout v-show="!isLogin"></logout>
        <login v-show="isLogin"></login>
        <!-- <login></login> -->
    </div>
</template>

<script>
import logout from './logout';
import login from './login';

export default {
    components: {
        logout, login
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