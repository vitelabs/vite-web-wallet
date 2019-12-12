<template>
    <div class="order-arrow-wrapper __pointer">
        <div @click="_setOrderRule(true)" class="arrow-icon"></div>
        <div @click="_setOrderRule(false)" class="arrow-icon"></div>
    </div>
</template>

<script>
export default {
    props: {
        orderItem: {
            type: String,
            default: ''
        },
        setOrderRule: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        _setOrderRule(isUp) {
            const rule = `${ this.orderItem }${ isUp ? 'Up' : 'Down' }`;
            this.setOrderRule && this.setOrderRule(rule);
        }
    }
};
</script>

<style lang="scss" scoped>
.order-arrow-wrapper {
    display: inline-block;
    height: 100%;
    .arrow-icon {
        display: block;
        width: 12px;
        height: 50%;
        &:first-child {
            background: url("~assets/imgs/ascend.svg") bottom no-repeat;
        }
        &:last-child {
            background: url("~assets/imgs/decend.svg") top no-repeat;
        }
    }
}
</style>
