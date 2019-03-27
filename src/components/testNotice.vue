<template>
    <div class="hover-wrapper">
        <div class="hover-notice">
            <div class="hover-title">{{ $t('preview.t') }}</div>
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
    z-index: 100;
}

.hover-notice {
    max-width: 260px;
    padding: 30px;
    text-align: left;
    background: #fff;
    border: 1px solid #e5edf3;
    box-shadow: 0 2px 15px 1px rgba(176, 192, 237, 0.17);
    border-radius: 8px;

    .hover-title {
        font-family: $font-bold, arial, sans-serif;
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
        color: #172c39;
        line-height: 22px;
        margin-bottom: 10px;

        &:last-child {
            margin-bottom: 0;
        }

        &.bold {
            font-weight: bolder;
        }
    }
}
</style>
