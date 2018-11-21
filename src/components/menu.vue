<template>
    <div class="menu-wrapper">
        <div class="header">
            <img class="vite-logo" :src="viteLogo" />
            <span class="menu" @click="clickMenu"></span>
        </div>

        <div class="menu-list" :class="{ 'show': showList }">
            <div class="item" @click="go('account')" 
                 :class="{ 'active': active === 'account'}">
                {{ $t('nav.home') }}
            </div>

            <div class="item" @click="go('quota')" 
                 :class="{ 'active': active === 'quota'}">
                {{ $t('quota.title') }}
            </div>

            <div class="item" @click="go('SBP')" 
                 :class="{ 'active': active === 'SBP'}">
                {{ $t('SBP.title') }}
            </div>

            <div class="item" @click="go('vote')" 
                 :class="{ 'active': active === 'vote'}">
                {{ $t('vote.title') }}
            </div>

            <div class="item" @click="go('transList')" 
                 :class="{ 'active': active === 'transList'}">
                {{ $t('transList.title') }}
            </div>

            <div class="item" @click="go('setting')" 
                 :class="{ 'active': active === 'setting'}">
                {{ $t('setting.title') }}
            </div>

            <div class="item" @click="logout" >
                {{ $t('logout') }}
            </div>
        </div>
    </div>
</template>

<script>
import viteLogo from 'assets/imgs/ViteLogo2.svg';

export default {
    props: {
        active: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            viteLogo,
            showList: false
        };
    },
    methods: {
        clickMenu() {
            this.showList = !this.showList;
        },

        go(name) {
            this.showList = false;
            (this.active !== name) && this.$router.push({ name });
        },

        logout() {
            this.$router.push({
                name: 'index'
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.menu-wrapper {
    position: relative;
    z-index: 50;
}
.header {
    padding: 15px 15px 13px 15px;
    background: #FFFFFF;
    box-shadow: 0 6px 36px 0 rgba(0,62,100,0.04);
    .vite-logo {
        width: 67.5px;
        height: 35px;
    }
    .menu {
        display: block;
        float: right;
        width: 35px;
        height: 35px;
        line-height: 35px;
        background: url('../assets/imgs/menu.svg') no-repeat center;
        background-size: 16px 14px;
        &:active {
            background: url('../assets/imgs/menu_presssed.svg') no-repeat center;
            background-size: 16px 14px;
        }
    }
}
.menu-list {
    margin-top: 5px;
    box-sizing: border-box;
    position: absolute;
    top: 64px;
    font-family: $font-bold, arial, sans-serif;
    font-size: 14px;
    color: #1D2024;
    letter-spacing: 0.35px;
    padding: 0 15px;
    width: 100%;
    background: #FFFFFF;
    box-shadow: 0 6px 36px 0 rgba(0,62,100,0.04);
    height: 0px;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    &.show {
        height: 420px;
    }
    .item {
        margin-top: 0px;
        height: 60px;
        line-height: 60px;
        border-bottom: 1px solid #d7dce5;
        &:last-child {
            border: none;
        }
        &.active {
            color: #007AFF;
        }
    }
}
</style>
