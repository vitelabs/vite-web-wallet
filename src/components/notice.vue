<template>
    <div class="notice-wrapper" :class="type">
        <img v-show="isShowClose" @click="close(rawData)" src="@assets/imgs/close.svg" class="close __pointer"/>
        <div class="title">{{ title }}</div>
        <div class="describe">{{ describe }}</div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'normal'
        },
        isShowClose: {
            type: Boolean,
            default: true
        },
        close: {
            type: Function,
            default: () => {}
        },
        title: {
            type: String,
            default: ''
        },
        describe: {
            type: String,
            default: ''
        },
        rawData: ''
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;

.notice-wrapper {
    position: relative;
    [data-theme="0"] & {
        background: #fff;
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    }
    [data-theme="1"] & {
        background: #18203A;
    }
    border-radius: 2px;
    width: 360px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 20px 30px;
    @include font-family-bold();
    word-wrap: break-word;
    &.normal {
        &::before {
            // background-image: linear-gradient(138deg, #052ef5 0%, #094bf3 31%, #0d6df0 49%, #0b92e7 71%, #0ba8e9 100%);
            background: linear-gradient(180deg, #00BEFF 0%, #00FF95 100%);
        }
    }
    &.notice {
        &::before {
            background: linear-gradient(270deg, rgba(0,212,208,1) 0%, rgba(0,215,100,1) 100%);
        }
    }
    &.error {
        &::before {
            background: linear-gradient(270deg, rgb(241, 93, 35) 0%, rgb(241, 4, 4) 100%);
        }
    }

    &::before {
        content: '';
        display: inline-block;
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
    }

    .close {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .title {
        font-size: 14px;
        @include common_font_color();
        line-height: 24px;
    }

    .describe {
        font-size: 12px;
        @include font-family-normal();
        @include font_color_to_white(#5e6875);
        line-height: 28px;
    }
}

@media screen and (max-width: 500px) {
    .notice-wrapper {
        float: right;
        width: 90%;
        max-width: 360px;
        padding: 16px;
        .describe {
            line-height: 22px;
        }
    }
}
</style>
