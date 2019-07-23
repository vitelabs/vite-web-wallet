<template>
    <span class="tips" :class="{ show: !!text }">{{ text }}</span>
</template>

<script>
// tips for input or sheet;
// todo-- 1,vue direct 2,bind position from props;
export default {
    props: {
        tipsContent: {
            type: String,
            default: ''
        }
    },
    data() {
        return { text: '' };
    },
    methods: {
        tip(text = this.tipsContent, time = 1000) {
            this.text = text;
            setTimeout(() => {
                this.text = '';
            }, time);
        },
        show(text = this.tipsContent) {
            this.text = text;
        },
        hide() {
            this.text = '';
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.tips {
    transition: all 0.3s ease-in-out;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: #5b638d;
    box-sizing: border-box;
    border-radius: 6px;
    font-size: 12px;
    line-height: 12px;
    color: #fff;
    opacity: 0;
    height: 0;
    width: 0;
    @include font-family-normal();
    &.show {
        opacity: 1;
        padding: 0 6px;
        width: auto;
        height: 24px;
        line-height: 24px;

        &::after {
            content: " ";
            display: inline-block;
            border: 6px solid transparent;
            border-top: 6px solid #5b638d;
            position: absolute;
            bottom: -12px;
            left: 50%;
            margin-left: -6px;
        }
    }
}
</style>
