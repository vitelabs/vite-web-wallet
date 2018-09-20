<template>
    <span class="copy-success" :class="{'show': copySuccess}">{{ $t('accDetail.hint.copy') }}</span>
</template>

<script>
export default {
    props: {
        copySuccess: {
            type: Boolean,
            default: false
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.copy-success {
    transition: all 0.3s ease-in-out;
    position: absolute;
    bottom: 6px;
    left: 50%;
    margin-left: -62px; 
    background: #5B638D;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 12px;
    line-height: 12px;
    color: #FFFFFF;
    padding: 6px;
    opacity: 0;
    font-family: $font-normal;
    &.show {
        opacity: 1;
    }
    &:after {
        content: ' ';
        display: inline-block;
        border: 6px solid transparent;
        border-top: 6px solid #5B638D;
        position: absolute;
        bottom: -12px;
        left: 50%;
        margin-left: -6px;
    }
}
</style>
