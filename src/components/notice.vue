<template>
    <div class="notice-wrapper" :class="type">
        <img v-show="isShowClose" @click="close(rawData)" src="../assets/imgs/close.svg" class="close __pointer"/>
        <div class="title">{{ title }}</div>
        <div class="describe" v-html="describe"></div>
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
@import "~assets/scss/vars.scss";

.dex .notice-wrapper {
    padding: 20px 30px;
    .title {
        font-size: 14px;
    }
    .describe {
        font-size: 12px;
        font-family: $font-normal, arial, sans-serif;
    }
}

.notice-wrapper {
    position: relative;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    width: 360px;
    margin-bottom: 20px;
    box-sizing: border-box;
    padding: 30px;
    font-family: $font-bold, arial, sans-serif;
    word-wrap: break-word;
    &.normal {
        &::before {
            background-image: linear-gradient(138deg, #052ef5 0%, #094bf3 31%, #0d6df0 49%, #0b92e7 71%, #0ba8e9 100%);
        }
    }
    &.notice {
        &::before {
            background: linear-gradient(270deg, rgba(0,212,208,1) 0%, rgba(0,215,100,1) 100%);
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
        font-size: 16px;
        color: #1d2024;
        line-height: 24px;
    }

    .describe {
        font-size: 14px;
        color: #5e6875;
        line-height: 28px;
    }
}

@media only screen and (max-width: 500px) {
    .notice-wrapper {
        width: 300px;
        padding: 15px;
    }
}
</style>
