<template>
    <div class="sidebar-wrapper">
        <div @mouseenter="overLogo"  @mouseleave="leaveLogo" class="logo __pointer">
            <img :src="viteLogo" />
            <test-notice class="notice" :class="{'hide': !isShowNotice}"></test-notice>
        </div>

        <router-link class="__pointer icon" :class="{
            'active': active === 'account'
        }" :to="{ name: 'account' }">
            <img v-show="active !== 'account'" :src="home" />
            <img v-show="active === 'account'" :src="homeActive"  />
        </router-link>

        <router-link class="__pointer icon" :class="{
            'active': active === 'transList'
        }" :to="{ name: 'transList' }">
            <img v-show="active !== 'transList'" :src="send" />
            <img v-show="active === 'transList'" :src="sendActive"  />
        </router-link>

        <router-link class="__pointer icon" :class="{
            'active': active === 'quota'
        }" :to="{ name: 'quota' }">
            <img v-show="active !== 'quota'" :src="quota" />
            <img v-show="active === 'quota'" :src="quotaActive"  />
        </router-link>

        <div class="_bottom">
            <router-link class="icon setting __pointer" :class="{
                'active': active === 'setting'
            }" :to="{ name: 'setting' }">
                <img v-show="active !== 'setting'" :src="setting" />
                <img v-show="active === 'setting'" :src="settingActive"  />
            </router-link>

            <div class="icon logout __pointer" @click="logout" 
                 @mouseenter="enterLogout" @mouseleave="leaveLogout">
                <img v-show="!logoutHover" :src="logoutDefault" />
                <img v-show="logoutHover" :src="logoutActive" />
            </div>
        </div>
    </div>
</template>

<script>
import testNotice from 'components/testNotice';

import viteLogo from 'assets/imgs/ViteLogo2.svg';
import home from 'assets/imgs/index_icon_default.svg';
import homeActive from 'assets/imgs/index_icon_pressed.svg';
import send from 'assets/imgs/transfer_default.svg';
import sendActive from 'assets/imgs/transfer_pressed.svg';
import setting from 'assets/imgs/settings_default.svg';
import settingActive from 'assets/imgs/settings_pressed.svg';
import logoutDefault from 'assets/imgs/logout_default.svg';
import logoutActive from 'assets/imgs/logout_pressed.svg';
import quota from 'assets/imgs/quota_default.svg';
import quotaActive from 'assets/imgs/quota_pressed.svg';

export default {
    components: {
        testNotice
    },
    props: {
        active: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isShowNotice: false,
            logoutHover: false,

            viteLogo,
            home,
            homeActive,
            send,
            sendActive,
            setting,
            settingActive,
            logoutDefault,
            logoutActive,
            quota,
            quotaActive
        };
    },
    methods: {
        overLogo() {
            this.isShowNotice = true;
        },
        leaveLogo() {
            this.isShowNotice = false;
        },

        enterLogout() {
            this.logoutHover = true;
        },
        leaveLogout() {
            this.logoutHover = false;
        },
        logout() {
            let activeAccount = viteWallet.Wallet.getActiveAccount();
            activeAccount && activeAccount.lock();
            this.$router.push({
                name: 'login'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 40px 1px rgba(221,229,252,0.50);
    .logo {
        display: inline-block;
        margin-top: 24px;
        width: 100%;
        height: 50px;
        img {
            width: 100%;
            height: 100%;
        }
        .notice {
            transition: opacity 0.5s ease-in-out;
            opacity: 1;
            &.hide {
                width: 0;
                height: 0;
                opacity: 0;
                overflow: hidden;
            }
        }
    }
    .icon {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 54px;
        margin-top: 48px;
        &.active:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 4.5px;
            display: inline-block;
            width: 4.5px;
            height: 54px;
            background-image: linear-gradient(-90deg, #1B3BD8 100%, #176CE0 100%, #0B92E7 100%, #0BB6EB 100%, #00E0F2 100%);
        }
    }
    ._bottom {
        position: absolute;
        bottom: 60px;
        width: 100%;
        .setting {
            margin-bottom: 35px;
        }
        .logout {
            height: 30px;
        }
    }
}
</style>
