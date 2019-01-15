<template>
    <div class="sidebar-wrapper">
        <div class="content">
            <div @mouseenter="overLogo"  @mouseleave="leaveLogo" class="logo __pointer">
                <img :src="viteLogo" />
                <test-notice class="notice" :class="{'hide': !isShowNotice}"></test-notice>
            </div>

            <div class="_top">
                <div v-for="(name, index) in menuTops" :key="index"
                     class="__pointer icon" :class="{ 'active': active.indexOf(name) >= 0 }" 
                     @click="go(name)">
                    <img v-show="active.indexOf(name) < 0" :src="icon[name]" />
                    <img v-show="active.indexOf(name) >= 0" :src="icon[`${name}Active`]"  />
                </div>
            </div>

            <div class="_bottom">
                <div v-for="(name, index) in menuBottoms" :key="index" 
                     class="icon __pointer" :class="{ 'active': active === name }" 
                     @click="go(name)" @mouseenter="enterLogout(name)" @mouseleave="leaveLogout(name)">
                    <img v-show="active !== name && (name !== iconHover)" :src="icon[name]" />
                    <img v-show="active === name || (name === iconHover) " :src="icon[`${name}Active`]"  />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import testNotice from 'components/testNotice';

import viteLogo from 'assets/imgs/sidebar_logo.svg';
import account from 'assets/imgs/index_icon_default.svg';
import accountActive from 'assets/imgs/index_icon_pressed.svg';
import transList from 'assets/imgs/transfer_default.svg';
import transListActive from 'assets/imgs/transfer_pressed.svg';
import setting from 'assets/imgs/settings_default.svg';
import settingActive from 'assets/imgs/settings_pressed.svg';
import logout from 'assets/imgs/logout_default.svg';
import logoutActive from 'assets/imgs/logout_pressed.svg';
import login from 'assets/imgs/login_default.svg';
import loginActive from 'assets/imgs/login_pressed.svg';
import quota from 'assets/imgs/quota_default.svg';
import quotaActive from 'assets/imgs/quota_pressed.svg';
import SBP from 'assets/imgs/SBP_default.svg';
import SBPActive from 'assets/imgs/SBP_active.svg';
import vote from 'assets/imgs/vote_default.svg';
import voteActive from 'assets/imgs/vote_active.svg';
import conversion from 'assets/imgs/conversion_default.svg';
import conversionActive from 'assets/imgs/conversion_pressed.svg';
import exchange from 'assets/imgs/exchange_default.svg';
import exchangeActive from 'assets/imgs/exchange_pressed.svg';

export default {
    components: {
        testNotice
    },
    props: {
        active: {
            type: String,
            default: ''
        },
        menuList: {
            type: Array,
            default: () => {
                return [];
            }
        },
        go: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            isShowNotice: false,
            iconHover: false,
            viteLogo,
            icon: {
                account,
                accountActive,
                transList,
                transListActive,
                quota,
                quotaActive,
                SBP,
                SBPActive,
                vote,
                voteActive,
                conversion,
                conversionActive,
                exchange,
                exchangeActive,
                setting,
                settingActive,
                logout,
                logoutActive,
                login,
                loginActive,
                index: exchange,
                indexActive: exchange
            },
        };
    },
    computed: {
        settingIndex() {
            return this.menuList.indexOf('setting');
        },
        menuTops() {
            return this.menuList.slice(0, this.settingIndex);
        },
        menuBottoms() {
            return this.menuList.slice(this.settingIndex);
        }
    },
    methods: {
        overLogo() {
            this.isShowNotice = true;
        },
        leaveLogo() {
            this.isShowNotice = false;
        },

        enterLogout(name) {
            if (name !== 'logout' && name !== 'login') {
                return;
            }
            this.iconHover = name;
        },
        leaveLogout(name) {
            if (name !== 'logout' && name !== 'login') {
                return;
            }
            this.iconHover = '';
        }
    }
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    height: 100%;
    overflow: auto;
    background: #fff;
    box-shadow: 0 2px 40px 1px rgba(221,229,252,0.50);
    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
    .logo {
        display: inline-block;
        margin-top: 24px;
        width: 100%;
        height: 46px;
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
        height: 40px;
        margin-top: 30px;
        img {
            width: 22px;
            height: 22px;
        }
        &.active:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 4px;
            display: inline-block;
            width: 4px;
            height: 40px;
            background-image: linear-gradient(-90deg, #1B3BD8 100%, #176CE0 100%, #0B92E7 100%, #0BB6EB 100%, #00E0F2 100%);
        }
    }
    ._top {
        flex: 1;
    }
    ._bottom {
        width: 100%;
        padding: 30px 0;
        .icon {
            margin-top: 0;
            margin-bottom: 30px;
            &:last-child {
                margin-bottom: 0;
                height: 30px;
            }
        }
    }
}
</style>
