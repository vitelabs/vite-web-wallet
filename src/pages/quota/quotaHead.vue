<template>
    <div class="quota-head-wrapper">
        <span>{{ $t('quota.title') }}</span>
        <ul class="qa-list">
            <li class="__pointer">
                <img src="../../assets/imgs/help.svg" />{{ $t('quota.Q1') }}
            </li>
            <li class="__pointer">
                <img src="../../assets/imgs/help.svg" />{{ $t('quota.Q2') }}
            </li>
            <li class="__pointer">
                <img src="../../assets/imgs/help.svg" />{{ $t('quota.Q3') }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.quota-head-wrapper {
    padding-bottom: 40px;
    font-size: 24px;
    color: #1D2024;
    .title {
        font-family: $font-bold;
    }
}
.qa-list {
    float: right;
    font-size: 14px;
    color: #007AFF;
    letter-spacing: 0.35px;
    line-height: 32px;
    li {
        display: inline-block;
        margin-left: 54px;
        img {
            width: 18px;
            height: 18px;
            margin-right: 6px;
            margin-bottom: -4px;
        }
    }
}
</style>
