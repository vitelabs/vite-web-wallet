<template>
    <div class="hover-wrapper">
        <div class="hover-notice">
            <div class="hover-title">{{ $t('preview.t', { version }) }}</div>
            <div class="hover-content">{{ $t('preview.txt1') }}</div>
            <div class="hover-content">{{ $t('preview.txt2') }}</div>
            <div class="hover-content">{{ $t('preview.txt3') }}</div>
            <div class="hover-content bold">{{ $t('preview.v', { version }) }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return { version: process.env.version };
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.hover-wrapper {
    position: absolute;
    top: 0;
    left: 65px;
    padding: 20px 0 0 20px;
    width: 350px;
    z-index: 1000;
}

.hover-notice {
    max-width: 260px;
    padding: 30px;
    text-align: left;
    border-radius: 8px;
    @include bg_color_3();
    [data-theme="0"] & {
        border: 1px solid #e5edf3;
        box-shadow: 0 2px 15px 1px rgba(176, 192, 237, 0.17);
    }
    .hover-title {
        @include font-family-bold();
        text-align: left;
        font-size: 16px;
        line-height: 16px;
        color: #195add;
        margin-bottom: 16px;
        word-break: break-all;
    }
    .hover-content {
        opacity: 0.66;
        font-size: 14px;
        line-height: 22px;
        margin-bottom: 10px;
        @include font_color_to_white(#172c39);
        &:last-child {
            margin-bottom: 0;
        }
        &.bold {
            font-weight: bolder;
        }
    }
}
</style>
