<template>
    <div class="quota-head-wrapper">
        <span class="title">{{ $t('quota.title') }}</span>
        <div @click="showHelp" class="qa __pointer">
            <img src="../../assets/imgs/help.svg" />{{ $t('quota.Q1') }}
        </div>
    </div>
</template>

<script>
export default {
    props: {
        showHelp: {
            type: Function,
            default: () => {}
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.quota-head-wrapper {
    font-size: 24px;
    color: #1D2024;
    .title {
        font-family: $font-bold;
    }
}
.qa {
    float: right;
    font-size: 14px;
    color: #007AFF;
    letter-spacing: 0.35px;
    line-height: 32px;
    img {
        width: 18px;
        height: 18px;
        margin-right: 6px;
        margin-bottom: -4px;
    }
}
</style>
