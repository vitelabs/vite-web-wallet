<template>
    <span class="help __pointer" @mouseenter="showHelp" @mouseleave="hideHelp">
        <span v-show="isShowHelp" class="help-text">{{ helpText }}</span>
    </span>
</template>

<script>

export default {
    props: {
        helpText: {
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
        top: 6px;
        transform: translateY(-50%);
        z-index: 100;
        width: 200px;
        word-break: break-word;
        line-height: 16px;
        padding: 10px;
        @include bg_color_4();
        [data-theme="0"] & {
            box-shadow: 0px 5px 20px 0px rgba(0,0,0,0.1);
        }
        border-radius: 2px;
        @include font-family-normal();
        @include font_color_2();
        font-size: 12px;
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
