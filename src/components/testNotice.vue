<template>
    <div class="hover-wrapper">
        <div class="hover-notice">
            <div class="hover-title">{{ $t('test.t') }}</div>
            <div class="hover-content">{{ $t('test.txt1') }}</div>
            <div class="hover-content">{{ $t('test.txt2') }}</div>
            <div class="hover-content bold">{{ $t('test.v') }}</div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

    .hover-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        padding: 49.5px 0 0 81.75px;
        z-index: 100;
    }
    .hover-notice {
        max-width: 260px;
        padding: 30px;
        word-break: break-all;
        text-align: left;
        background: #FFFFFF;
        border: 1px solid #E5EDF3;
        box-shadow: 0 2px 15px 1px rgba(176,192,237,0.17);
        border-radius: 8px;
        .hover-title {
            font-family: $font-bold;
            text-align: left;
            font-size: 16px;
            line-height: 16px;
            color: #195ADD;
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
