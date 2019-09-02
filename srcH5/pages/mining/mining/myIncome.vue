<template>
    <div class="my-income">
        <div class="item">
            <div class="item-title">{{ title }}</div>
            <div class="item-amount">{{ miningTotal | formatNum }}</div>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        miningTotal: {
            type: String,
            default: '0'
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.my-income {
    background: url('~h5Assets/imgs/assets.svg') no-repeat;
    background-size: cover;
    border-radius: 2px;
    line-height: 16px;
    margin: 20px 0;
    font-size: 12px;
    @include font-normal();

    .item {
        padding: 10px 12px;
        .item-title {
            color: rgba(62,74,89,0.6);
            margin-bottom: 6px;
        }
        .item-amount {
            font-size: 24px;
            @include font-bold();
            line-height: 30px;
            color: rgba(62,74,89,1);
        }
    }
}
</style>
