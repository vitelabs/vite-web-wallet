<template>
    <div class="title">
        <span class="title-t">{{ title }}</span>
        <span v-show="amount" class="amount">{{ amount }}</span>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        amount: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.title {
    height: 50px;
    font-size: 13px;
    @include font-family-bold();
    color: rgba(94,104,117,0.8);
    display: flex;
    align-items: center;
    .amount {
        font-size: 20px;
        color: rgba(29,32,36,1);
        &:before {
            content: ' ';
            margin: 0 10px 3px;
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 8px;
            background: rgba(0,122,255,1);
        }
    }
}
</style>

