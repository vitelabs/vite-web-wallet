<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            {{ $t('trade.limitPrice.title') }}
            <span class="fee">{{ $t('trade.limitPrice.fee') }} Taker（0.25 %）/ Maker（0.25 %）</span>
        </div>

        <logout-view v-if="!isLogin"></logout-view>

        <div v-if="isLogin" class="ex-center-login">
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
    components: { logoutView, order },
    mounted() {
        this.isLogin = !!this.$wallet.isLogin;
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
    },
    data() {
        return { isLogin: !!this.$wallet.isLogin };
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
        color: rgba(94, 104, 117, 1);
        font-family: $font-normal, arial, sans-serif;
        font-weight: 400;
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
        border: 1px dashed #D7E0E8;
        margin: 0 6px;
    }
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";

.order-input.input-wrapper input {
    text-indent: 6px;
    color: rgba(36, 39, 43, 0.8);
    font-size: 12px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
}
</style>
