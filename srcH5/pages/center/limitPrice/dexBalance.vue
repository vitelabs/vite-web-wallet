<template>
    <div class="wallet">
        {{ balance || "0" }}
        <span class="ex-order-token">{{ tokenShow }}</span>
    </div>
</template>

<script>
export default {
    props: {
        balance: {
            type: String,
            default: ''
        },
        tokenShow: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.wallet {
    @include font-normal();
    display: block;
    float: right;
    color: rgba(62, 74, 89, 0.7);
    &::before {
        content: "";
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url("~h5Assets/imgs/wallet_balance.svg");
        background-size: cover;
        margin-bottom: -4px;
    }
}
</style>
