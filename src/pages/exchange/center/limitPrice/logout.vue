<template>
    <div class="logout">
        <div class="text">{{ $t('exchange.limitPrice.text') }}</div>
        <div class="btn btn-login __pointer" @click="login">{{ $t('login') }}</div>
        <div class="btn btn-register __pointer" @click="register">{{ $t('register') }}</div>
    </div>
</template>
        
<script>
export default {
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
@import "../center.scss";

.logout {
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
        background: $blue;
        color: rgba(251,251,251,1);
    }
    .btn-register {
        float: right;
        border: 1px solid $blue;
        color: $blue;
    }
}
</style>
