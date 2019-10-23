<template>
    <i class="tipsicon">
        <tooltips class="fee-tips" :content="content"></tooltips>
    </i>
</template>

<script>
import tooltips from 'components/tooltips';

export default {
    components: { tooltips },
    props: {
        content: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/scss/vars.scss";

.tipsicon {
    margin-left: 3px;
    position: relative;
    display: inline-block;
    background: url(~assets/imgs/gray_hover_help.svg) center no-repeat;
    background-size: 100% 100%;
    overflow: visible;
    width: 16px;
    height: 16px;
    vertical-align: sub;
    cursor: pointer;
    margin-bottom: -1px;
    .fee-tips {
        z-index: 100;
        top: 25px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
        color: #5E6875;
        width: 200px;
        box-shadow: 0px 5px 20px 0px rgba(176,192,237,0.4);
        word-break: break-word;
        @include font-family-normal();
        /deep/.trigle {
            border: 7px solid transparent;
            border-bottom: 7px solid #fff;
            top: -14px;
            transform: translateX(-50%);
            left: 50%;
        }
    }
    &:hover .fee-tips {
        display: inline-block;
    }
}
</style>
