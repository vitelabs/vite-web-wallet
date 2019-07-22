<template>
    <div class="create-account-wrapper">
        <div class="__title">{{ $t("regAcc") }}</div>
        <div class="notice">{{ $t('startCreate.notice') }}</div>
        <div class="__btn_list">
            <span class="__btn __btn_all_in __pointer">
                <img class="download" src="~assets/imgs/google.svg"/>Google Play
            </span>
            <div class="__btn __btn_all_in __pointer">
                <img class="download" src="~assets/imgs/apple.svg"/>APP Store
            </div>
        </div>
        <div class="go-list clearfix">
            <span class="__pointer" @click="go('startLogin')">
                <img class="back" src="~assets/imgs/arrow-back.svg"/>{{ $t('startCreate.goLogin') }}
            </span>
            <span class="__pointer" @click="go('tradeCenter')">{{ $t('startCreate.goDex') }}</span>
        </div>
    </div>
</template>

<script>

export default {
    methods: {
        go(name) {
            this.$router.push({ name });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.create-account-wrapper{
    max-width: 360px;
    .notice {
        box-sizing: border-box;
        padding: 20px;
        background: rgba(255,255,255,1);
        border-radius: 2px;
        font-size: 14px;
        @include font-family-normal();
        color: rgba(51,51,51,1);
        line-height: 20px;
        text-align: left;
        margin-bottom: 20px;
    }
    .download {
        width: 28px;
        height: 28px;
        margin-bottom: -8px;
        margin-right: 10px;
    }
    .go-list {
        margin-top: 100px;
        font-size: 16px;
        @include font-family-bold();
        color: rgba(255,255,255,1);
        line-height: 20px;
        .back {
            width: 16px;
            height: 16px;
            margin-right: 6px;
            margin-bottom: -2px;
        }
        span {
            &:first-child {
                float: left;
            }
            &:last-child {
                float: right;
            }
        }
    }
    .__btn:hover {
        position: relative;
        &::before {
            position: absolute;
            top: 54px;
            left: 50%;
            margin-left: -6px;
            content: ' ';
            display: inline-block;
            border: 6px solid transparent;
            border-bottom: 6px solid #fff;
        }
        &::after {
            position: absolute;
            top: 65px;
            left: 50%;
            margin-left: -56px;
            display: inline-block;
            background: rgba(255,255,255,1);
            box-shadow: 0px 5px 10px 0px rgba(0,145,216,0.6);
            content: ' ';
            background: url('~assets/imgs/download.png') center no-repeat #fff;
            background-size: 100px 100px;
            padding: 6px;
            width: 100px;
            height: 100px;
            z-index: 1;
        }
    }
}
</style>

