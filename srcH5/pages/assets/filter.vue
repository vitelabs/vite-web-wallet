<template>
    <div class="filter-wrapper clearfix" @click="triggerHideZero">
        <span class="check-zero" :class="{'active': isHideZero}"></span>
        {{ $t('tradeAssets.zero') }}
    </div>
</template>

<script>
export default {
    data() {
        return { isHideZero: false };
    },
    methods: {
        triggerHideZero() {
            this.isHideZero = !this.isHideZero;
            this.$emit('input', this.isHideZero);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~h5Assets/scss/vars.scss";

.filter-wrapper {
    font-size: 12px;
    @include font-normal();
    color: rgba(62,74,89,0.45);
    line-height: 16px;
    padding: 12px 0;

    .check-zero {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 4px;
        background: url('~h5Assets/imgs/check.svg') center no-repeat;
        background-size: 12px 12px;
        margin-bottom: -2px;
        &.active {
            background: url('~h5Assets/imgs/check_active.svg') center no-repeat;
            background-size: 12px 12px;
        }
    }
}
</style>
