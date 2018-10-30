<template>
    <div :class="{ 'confirm-gray-wrapper': showMask }">
        <div class="confirm-wrapper">
            <div class="title">
                {{ title }}
                <span v-show="closeIcon" @click="close" class="close-icon __pointer"></span>
            </div>
            <div v-if="content" class="content-wrapper" v-html="content"></div>
            <div v-if="!content" class="content-wrapper" > <slot></slot> </div>
            <div class="bottom" :class="{ 'single': !!singleBtn }">
                <div v-show="singleBtn" class="__btn btn-single __btn_all_in __pointer" 
                     @click="leftBtnClick">{{ leftBtnTxt }}</div>
                <div v-show="!singleBtn" class="__btn btn-left __pointer" 
                     @click="leftBtnClick">{{ leftBtnTxt }}</div>
                <div v-show="!singleBtn" class="__btn __btn_all_in __pointer" 
                     :class="{'unuse': rightBtnUnuse }"
                     @click="rightBtnClick">{{ rightBtnTxt }}</div>
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
        closeIcon: {
            type: Boolean,
            default: false
        },
        close: {
            type: Function,
            default: ()=>{}
        },
        singleBtn: {
            type: Boolean,
            default: false
        },
        leftBtnTxt: {
            type: String,
            default: ''
        },
        rightBtnTxt: {
            type: String,
            default: ''
        },
        leftBtnClick: {
            type: Function,
            default: ()=>{}
        },
        rightBtnClick: {
            type: Function,
            default: ()=>{}
        },
        rightBtnUnuse: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: ''
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.confirm-gray-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
}
.confirm-wrapper {
    width: 90%;
    max-width: 460px;
    max-height: 85%;
    display: flex;
    flex-direction: column;
    background: #FFFFFF;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    .title {
        background: #268EFF;
        height: 60px;
        line-height: 60px;
        padding-left: 30px;
        font-family: $font-bold;
        font-size: 16px;
        color: #FFFFFF;
        .close-icon {
            box-sizing: border-box;
            display: block;
            float: right;
            padding: 30px;
            width: 20px;
            height: 20px;
            background: url('../assets/imgs/confirm_close.svg') no-repeat center;
            background-size: 20px 20px;
        }
    }
    .content-wrapper {
        position: relative;
        flex: 1;
        box-sizing: border-box;
        padding: 30px;
        overflow: auto;
        font-family: $font-bold;
        font-size: 18px;
        color: #1D2024;
        line-height: 26px;
    }
    .bottom {
        padding: 0 30px;
        display: flex;
        min-height: 80px;
        box-sizing: border-box;
        justify-content: space-between;
        &.single {
            justify-content: space-around;
        }
        .__btn {
            display: inline-block;
            width: 48%;
            max-width: 190px;
            font-family: $font-bold;
            color: #FFFFFF;
            &.btn-left {
                box-sizing: border-box;
                border: 1px solid #007AFF;
                border-radius: 2px;
                color: #007AFF;
            }
            &.unuse {
                background: #efefef;
                color: #666;
            }
        }
        .btn-single {
            width: 200px;
            max-width: 200px;
        }
    }
}
</style>

