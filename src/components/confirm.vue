<template>
    <div class="confirm-wrapper">
        <div class="title">{{ title }}</div>
        <div class="content-wrapper">
            <div class="content"> <slot></slot> </div>
            <div class="bottom">
                <div class="__btn btn-left" @click="leftBtnClick">{{ leftBtnTxt }}</div>
                <div class="__btn __btn_all_in" @click="rightBtnClick">{{ rightBtnTxt }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        closeIcon: {
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
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.confirm-wrapper {
    width: 90%;
    max-width: 460px;
    background: #FFFFFF;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    .title {
        background: #268EFF;
        height: 60px;
        line-height: 60px;
        padding: 0 30px;
        font-family: $font-bold;
        font-size: 16px;
        color: #FFFFFF;
    }
    .content-wrapper {
        padding: 30px;
    }
    .bottom {
        display: flex;
        justify-content: space-between;
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
        }
    }
}
</style>

