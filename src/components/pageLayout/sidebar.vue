<template>
    <div class="sidebar-wrapper">
        <div class="content">
            <div @mouseenter="overLogo" @mouseleave="leaveLogo" class="logo __pointer">
                <img @click="goVX" :src="viteLogo" />
                <test-notice class="notice" :class="{'hide': !isShowNotice}"></test-notice>
            </div>

            <div class="_top">
                <div v-for="(name, index) in menuTops" :key="index"
                     class="__pointer icon" :class="{ 'active': $route.name.indexOf(name) >= 0 }"
                     @click="_go(name)">
                    <img v-show="$route.name.indexOf(name) < 0" :src="icon[name]" />
                    <img v-show="$route.name.indexOf(name) >= 0" :src="icon[`${name}Active`]"  />
                </div>
            </div>

            <div class="_bottom">
                <div v-for="(name, index) in menuBottoms" :key="index"
                     class="icon __pointer" :class="{ 'active': $route.name === name }"
                     @click="_go(name)" @mouseenter="enterLogout(name)" @mouseleave="leaveLogout(name)">
                    <img v-show="$route.name !== name && (name !== iconHover)" :src="icon[name]" />
                    <img v-show="$route.name === name || (name === iconHover) " :src="icon[`${name}Active`]"  />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import testNotice from 'components/testNotice';
import statistics from 'utils/statistics';
import openUrl from 'utils/openUrl';

import viteLogo from 'assets/imgs/sidebar_logo.svg';
import assets from 'assets/imgs/assets_default.svg';
import assetsActive from 'assets/imgs/assets_pressed.svg';
import wallet from 'assets/imgs/wallet_default.svg';
import walletActive from 'assets/imgs/wallet_pressed.svg';
import setting from 'assets/imgs/settings_default.svg';
import settingActive from 'assets/imgs/settings_pressed.svg';
import logout from 'assets/imgs/logout_default.svg';
import logoutActive from 'assets/imgs/logout_pressed.svg';
import login from 'assets/imgs/login_default.svg';
import loginActive from 'assets/imgs/login_pressed.svg';
import trade from 'assets/imgs/trade_default.svg';
import tradeActive from 'assets/imgs/trade_pressed.svg';

export default {
    components: { testNotice },
    props: {
        menuList: {
            type: Array,
            default: () => []
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
                assets,
                assetsActive,
                wallet,
                walletActive,
                trade,
                tradeActive,
                setting,
                settingActive,
                logout,
                logoutActive,
                login,
                loginActive,
                index: trade,
                indexActive: trade
            }
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
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        goVX() {
            openUrl(`https://vitex.net/${ this.$i18n.locale === 'zh' ? 'zh' : '' }`);
        },
        _go(name) {
            statistics.event('sidebar', name, this.address || '');
            this.go && this.go(name);
        },
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
    box-shadow: 0 2px 40px 1px rgba(221, 229, 252, 0.5);

    .content {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .logo {
        display: inline-block;
        margin-top: 30px;
        width: 100%;
        height: 52px;

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
        height: 24px;
        margin-top: 30px;

        img {
            width: 24px;
            height: 24px;
        }

        &.active::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 4px;
            display: inline-block;
            width: 4px;
            height: 24px;
            background-image: linear-gradient(-90deg, #1b3bd8 100%, #176ce0 100%, #0b92e7 100%, #0bb6eb 100%, #00e0f2 100%);
        }
    }

    ._top {
        flex: 1;
    }

    ._bottom {
        width: 100%;
        padding: 30px 0 50px;

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
