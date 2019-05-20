<template>
    <div class="confirm-container" :class="{ 'gray': showMask }">
        <div class="confirm-wrapper">
            <div class="title">
                {{ title }}
                <span v-show="showClose" @click="close" class="close-icon __pointer"></span>
            </div>
            <div class="content-wrapper" >
                <div v-if="content" v-html="content"></div>
                <slot></slot>
            </div>
            <div class="bottom">
                <div v-show="singleBtn" class="__btn btn-single __btn_all_in __pointer"
                     :class="{'unuse': btnUnuse }"
                     @click="_leftBtnClick">{{ lTxt }}</div>
                <div v-show="!singleBtn" class="__btn btn-left __pointer"
                     @click="_leftBtnClick">{{ lTxt }}</div>
                <div v-show="!singleBtn" class="__btn __btn_all_in __pointer"
                     :class="{'unuse': btnUnuse }"
                     @click="_rightBtnClick">{{ rTxt }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        showMask: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        showClose: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default: () => {}
        },
        lTxt: {
            type: String,
            default: ''
        },
        rTxt: {
            type: String,
            default: ''
        },
        btnUnuse: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        },
        lClick: {
            type: Function,
            default: () => {}
        },
        rClick: {
            type: Function,
            default: () => {}
        }
    },
    methods: {
        _rightBtnClick() {
            if (this.btnUnuse) {
                return;
            }
            this.rightBtnClick && this.rightBtnClick();
        },
        _leftBtnClick() {
            if (this.singleBtn && this.btnUnuse) {
                return;
            }
            this.leftBtnClick && this.leftBtnClick();
        }
    },
    computed: {
        singleBtn() {
            return !!this.sTxt;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.confirm-container {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;

    &.gray {
        background: rgba(0, 0, 0, 0.6);
    }
}

.confirm-wrapper {
    width: 90%;
    max-width: 460px;
    max-height: 85%;
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;

    .title {
        background: #268eff;
        height: 60px;
        line-height: 60px;
        padding-left: 30px;
        font-family: $font-bold, arial, sans-serif;
        font-size: 16px;
        color: #fff;

        .close-icon {
            box-sizing: border-box;
            display: block;
            float: right;
            padding: 30px;
            width: 20px;
            height: 20px;
            background: url('~assets/imgs/confirm_close.svg') no-repeat center;
            background-size: 20px 20px;
        }
    }

    .content-wrapper {
        position: relative;
        box-sizing: border-box;
        padding: 30px;
        overflow: auto;
        font-family: $font-bold, arial, sans-serif;
        font-size: 18px;
        color: #1d2024;
        line-height: 26px;
    }

    .bottom {
        padding: 0 30px;
        display: flex;
        min-height: 80px;
        box-sizing: border-box;
        justify-content: space-between;

        .__btn {
            white-space: nowrap;
            display: inline-block;
            width: 48%;
            max-width: 190px;
            font-family: $font-bold, arial, sans-serif;
            color: #fff;

            &.btn-left {
                box-sizing: border-box;
                border: 1px solid #007aff;
                border-radius: 2px;
                color: #007aff;
            }

            &.unuse {
                background: #efefef;
                color: #666;
            }
        }

        .btn-single {
            width: 100%;
            max-width: 100%;
        }
    }
}
</style>

