<template>
    <div class="my-quota-wrapper">
        <div class="row">
            <div class="title">{{ $t('quota.myQuota') }}</div>
            <div class="text">{{ quota }}</div>
        </div>
        <div class="row">
            <div class="title">{{ $t('quota.maxTxNum') }}</div>
            <div class="text">{{ txNum }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            quota: '',
            txNum: ''
        };
    },
    methods: {

    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.my-quota-wrapper {
    padding: 35px 24px;
}
.row {
    font-family: $font-bold;
    &:first-child {
        margin-bottom: 40px;
    }
    .title {
        font-size: 14px;
        color: #1D2024;
        letter-spacing: 0.35px;
        margin-bottom: 12px;
    }
    .text {
        font-size: 24px;
        color: #1D2024;
        line-height: 32px;
    }
}
</style>
