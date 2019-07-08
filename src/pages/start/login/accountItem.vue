<template>
    <div class="__btn_input_active" @click="clickAccount(account)">
        <div class="name __ellipsis">{{ account.name }}</div>
        <div class="address __ellipsis">{{ account.showAddr }}</div>
    </div>
</template>

<script>
export default {
    props: {
        account: {
            type: Object,
            default: () => {
                return {};
            }
        },
        clickAccount: {
            type: Function,
            default: () => {}
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.__btn_input_active {
    border: 1px solid #d4dee7;
    border-top: none;
    padding: 10px 40px 8px 20px;
    text-align: left;
    background: #fff;

    &:last-child {
        border-bottom: none;
    }

    .name {
        @include font-family-bold();
        font-size: 14px;
        color: #333;
        line-height: 20px;
    }

    .address {
        font-family: $font-normal-b;
        font-size: 12px;
        line-height: 20px;
        color: #333;
    }
}
</style>
