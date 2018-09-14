<template>
    <div class="setting-wrapper">
        <div class="title  __pointer">设置</div>
        <div class="content-wrapper">
            <div class="content">
                <slot></slot>
            </div>
            <div class="description">
                <div class="row">
                    <span class="title">当前区块高度</span>
                </div>
                <div class="row">
                    <span class="title">版本</span>sdsdsd
                </div>
                <div class="row">
                    <span class="title">客户服务</span>sdsdsd
                    <span class="title">Vite官方网站</span>sdsdsdsd
                </div>
                <div class="row">
                    <span class="title">系统门户网站</span>sdsdsdsd
                    <span class="title">Vite项目开源代码</span>sdsdsdsdsd
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.setting-wrapper {
    position: relative;
    box-sizing: border-box;
    padding: 30px;
    height: 100%;
    .title {
        font-family: $font-bold;
        font-size: 24px;
        color: #1D2024;
        line-height: 32px;
    }
    .content-wrapper {
        position: absolute;
        top: 92px;
        bottom: 30px;
        left: 30px;
        right: 30px;
        overflow: auto;
        background: #FFFFFF;
        box-shadow: 0 2px 48px 1px rgba(176,192,237,0.17);
        border-radius: 8px;
        .content {
            padding: 20px;
        }
        .description {
            padding: 20px;
            border-top: 1px solid #C6CBD4;
            opacity: 0.8;
            line-height: 28px;
            font-size: 14px;
            color: #5E6875;
            letter-spacing: 0.35px;
            .title {
                opacity: 0.8;
                font-size: 14px;
                font-family: $font-bold;
                margin-right: 15px;
                &:last-child {
                    margin-left: 20px;
                }
                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }
}
</style>
