<template>
    <div class="limit-price-wrapper">
        <div class="__center-title">
            {{ $t('exchange.limitPrice.title') }}
            <span class="fee">{{ $t('exchange.limitPrice.fee') }} Taker（0.0XX%）/ Maker（0.0XX%）</span>
        </div>

        <div v-show="!isLogin" class="login">
            <div class="text">{{ $t('exchange.limitPrice.text') }}</div>
            <div class="btn btn-login __pointer" @click="login">{{ $t('login') }}</div>
            <div class="btn btn-register __pointer" @click="register">{{ $t('register') }}</div>
        </div>
        
        <div v-show="isLogin" class="limit-price"></div>
    </div>
</template>

<script>
export default {
    created() {
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
    },
    data() {
        return {
            isLogin: !!this.$wallet.isLogin
        };
    },
    methods: {
        login() {
            this.$router.push({
                name: 'start'
            });
        },
        register() {
            this.$router.push({
                name: 'startCreate'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "./center.scss";

.limit-price-wrapper {
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

    .login {
        box-sizing: border-box;
        width: 100%;
        padding: 68px 22px;
        text-align: center;
        .text {
            color: rgba(36,39,43,1);
            margin-bottom: 54px;
        }
        .btn {
            box-sizing: border-box;
            width: 48%;
            height: 30px;
            line-height: 30px;
            border-radius: 2px;
            font-family: $font-bold, arial, sans-serif;
            font-weight: 600;
        }
        .btn-login {
            float: left;
            background: rgba(0,122,255,1);
            color:rgba(251,251,251,1);
        }
        .btn-register {
            float: right;
            border:1px solid rgba(0,122,255,1);
            color:rgba(0,122,255,1);
        }
    }
}
</style>
