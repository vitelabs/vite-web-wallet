<template>
    <div class="create-account-wrapper">
        <template v-if="!isDesktop">
            <div class="__title">{{ $t("regAcc") }}</div>
            <div class="notice">{{ $t('startCreate.notice') }}</div>
            <div class="__btn_list">
                <div class="__btn __btn_all_in __pointer">
                    <font-awesome-icon class="download" :icon="['fab', 'google-play']" />Google Play
                </div>
                <div class="__btn __btn_all_in __pointer">
                    <font-awesome-icon class="download" :icon="['fab', 'app-store-ios']" />APP Store
                </div>
                <a class="__btn __btn_all_in __pointer" :href="downloadUrl('win')" target="_blank">
                    <font-awesome-icon class="download" :icon="['fab', 'windows']" />Windows
                </a>
                <a class="__btn __btn_all_in __pointer" :href="downloadUrl('mac')" target="_blank">
                    <font-awesome-icon class="download" :icon="['fab', 'apple']" />Mac
                </a>
            </div>
        </template>
        <create-page v-else></create-page>
        <div class="go-list clearfix">
            <span class="__pointer" @click="go('startLogin')">
                <img class="back" src="~assets/imgs/arrow-back.svg"/>{{ $t('startCreate.goLogin') }}
            </span>
            <span class="__pointer" @click="go('tradeCenter')">{{ $t('startCreate.goDex') }}</span>
        </div>
    </div>
</template>

<script>
import createPage from '../../create/index';

export default {
    components: { createPage },
    data() {
        return { desktopVersion: '1.3.27' };
    },
    computed: {
        isDesktop() {
            return window.DESKTOP;
        }
    },
    methods: {
        go(name) {
            this.$router.push({ name });
        },
        downloadUrl(platform) {
            return 'https://github.com/vitelabs/vite-wallet/releases/latest';
            // let name = 'dmg';
            // if (platform === 'win') {
            //     name = 'exe';
            // }
            // return `https://github.com/vitelabs/vite-wallet/releases/download/v${ this.desktopVersion }/Vite-Desktop-Wallet-${ this.desktopVersion }-${ platform }.${ name }`;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "../start.scss";

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
    .__btn_list {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
        .__btn {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
    }
    div.__btn:hover {
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

