<template>
    <div class="title">
        <span class="title-t">{{ title }}</span>
        <span v-if="help" class="help __pointer" @mouseenter="showHelp" @mouseleave="hideHelp">
            <span v-show="isShowHelp" class="help-text">{{ help }}</span>
        </span>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        help: {
            type: String,
            default: ''
        }
    },
    data() {
        return { isShowHelp: false };
    },
    methods: {
        showHelp() {
            this.isShowHelp = true;
        },
        hideHelp() {
            this.isShowHelp = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.title {
    padding: 14px 0;
    line-height: 18px;
    font-size: 13px;
    @include font-family-bold();
    [data-theme="0"] & {
        color: rgba(94,104,117,0.8);
    }
    [data-theme="1"] & {
        color: $white-color;
    }
}

.help {
    position: relative;
    @include background_common_img("info.svg");
    width: 12px;
    height: 12px;
    display: inline-block;
    margin-bottom: -1px;
    .help-text {
        position: absolute;
        left: 24px;
        top: -12px;
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        @include bg_color_4();
        [data-theme="0"] & {
            box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
        }
        border-radius: 2px;
        @include font-family-normal();
        @include font_color_2();
        font-size: 12px;
        white-space: nowrap;
        &:after {
            position: absolute;
            content: ' ';
            top: 50%;
            left: 0;
            transform: translate(-100%, -50%);
            display: inline-block;
            border: 6px solid transparent;
            [data-theme="0"] & {
                border-right: 6px solid #fff;
            }
            [data-theme="1"] & {
                border-right: 6px solid $black-color-4;
            }
        }
    }
}
</style>

