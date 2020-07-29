<template>
    <div class="sidebar-wrapper">
        <div class="content">
            <div @mouseenter="overLogo" @mouseleave="leaveLogo" class="logo __pointer">
                <img @click="goVX" :src="viteLogo" />
                <test-notice class="notice" :class="{'hide': !isShowNotice}"></test-notice>
            </div>

            <div class="_top">
                <div v-for="(name, index) in menuTops" :key="index"
                     class="__pointer"
                     @click="_go(name)">
                    <div class="icon" :class="{ 'active': $route.name.indexOf(name) >= 0 }">
                        <img v-show="$route.name.indexOf(name) < 0" :src="icon[name]" />
                        <img v-show="$route.name.indexOf(name) >= 0" :src="icon[`${name}Active`]"  />
                    </div>
                </div>
            </div>

            <div class="_bottom">
                <div v-for="(name, index) in menuBottoms" :key="index"
                     class="icon __pointer" :class="{ 'active': $route.name === name }"
                     @click="_go(name)">
                    <img class="default" v-show="$route.name !== name" :src="icon[name]" />
                    <img class="active" v-show="$route.name === name" :src="icon[`${name}Active`]"  />
                </div>
                <div class="icon __pointer" @click="changeTheme" key="theme">
                    <font-awesome-icon :icon="themeIcon" class="theme-icon"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import testNotice from 'pcComponents/testNotice';
import statistics from 'utils/statistics';
import openUrl from 'utils/openUrl';

import viteLogo from 'assets/imgs/sidebar_logo.svg';
import assets from 'assets/imgs/assets_default.svg';
import assetsActive from 'assets/imgs/assets_pressed.svg';
import wallet from 'assets/imgs/wallet_default.svg';
import walletActive from 'assets/imgs/wallet_pressed.svg';
import setting from 'assets/imgs/settings_default.svg';
import settingActive from 'assets/imgs/settings_pressed.svg';
import trade from 'assets/imgs/trade_default.svg';
import tradeActive from 'assets/imgs/trade_pressed.svg';
import defiActive from 'assets/imgs/sidebar_defi_pressed.svg';

import theme1viteLogo from 'assets/theme1_imgs/sidebar_logo.png';
import theme1wallet from 'assets/theme1_imgs/wallet_default.png';
import theme1walletActive from 'assets/theme1_imgs/wallet_pressed.png';
import theme1trade from 'assets/theme1_imgs/trade_default.png';
import theme1assets from 'assets/theme1_imgs/assets_default.png';
import theme1setting from 'assets/theme1_imgs/settings_default.png';

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
        return { isShowNotice: false };
    },
    computed: {
        theme() {
            return +this.$store.state.env.theme;
        },
        themeIcon() {
            return this.theme ? 'lightbulb' : 'moon';
        },
        viteLogo() {
            if (+this.theme === 0) {
                return viteLogo;
            }
            return theme1viteLogo;
        },
        icon() {
            if (+this.theme) {
                return {
                    assets: theme1assets,
                    assetsActive,
                    wallet: theme1wallet,
                    walletActive: theme1walletActive,
                    trade: theme1trade,
                    tradeActive,
                    setting: theme1setting,
                    settingActive,
                    index: theme1trade,
                    indexActive: tradeActive,
                    defiActive
                };
            }
            return {
                assets,
                assetsActive,
                wallet,
                walletActive,
                trade,
                tradeActive,
                setting,
                settingActive,
                index: trade,
                indexActive: tradeActive,
                defiActive
            };
        },
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
        changeTheme() {
            this.$store.commit('setTheme', this.theme ? '0' : '1');
        }
    }
};
</script>

<style lang="scss" scoped>
.sidebar-wrapper {
    height: 100%;
    overflow: auto;
    @include bg_color_2();
    [data-theme="0"] & {
        box-shadow: 0 2px 40px 1px rgba(221, 229, 252, 0.5);;
    }

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
        height: 38px;
        text-align: center;

        img {
            width: 38px;
            height: 38px;
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
        height: 20px;

        img {
            width: 20px;
            height: 20px;
        }
        .theme-icon {
            @include second_title_font_color();
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
            background-image: linear-gradient(-90deg, #1b3bd8 100%, #176ce0 100%, #0b92e7 100%, #0bb6eb 100%, #00e0f2 100%);
        }
    }

    ._top {
        flex: 1;
        margin-top: 30px;
        & > .__pointer {
            padding-top: 15px;
            padding-bottom: 15px;
        }
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
