<template>
    <div v-click-outside="hideMenu" class="menu-wrapper">
        <div class="header">
            <img class="vite-logo" :src="viteLogo" />
            <span class="menu __pointer" @click="clickMenu"></span>
        </div>

        <div class="menu-list" :style="`height: ${showList ? menuListHeight : 0}px`">
            <div v-for="(name, i) in menuList" :key="i"
                 class="item" :style="`height: ${itemHeight}px; line-height: ${itemHeight}px`" @click="_go(name)"
                 :class="{ 'active': active.indexOf(name) >= 0 }">
                {{ name !== 'logout' && name !== 'login' ? $t(`${name}.title`) : $t(name) }}
            </div>
        </div>
    </div>
</template>

<script>
import viteLogo from 'assets/imgs/ViteLogo2.svg';

const itemHeight = 60;

export default {
    props: {
        active: {
            type: String,
            default: ''
        },
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
            viteLogo,
            itemHeight,
            showList: false
        };
    },
    computed: {
        menuListHeight() {
            return itemHeight * this.menuList.length;
        }
    },
    methods: {
        clickMenu() {
            this.showList = !this.showList;
        },
        hideMenu() {
            this.showList = false;
        },

        _go(name) {
            this.hideMenu();
            this.go(name);
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
    background: #fff;
    box-shadow: 0 6px 36px 0 rgba(0, 62, 100, 0.04);

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
    color: #1d2024;
    letter-spacing: 0.35px;
    padding: 0 15px;
    width: 100%;
    background: #fff;
    box-shadow: 0 6px 36px 0 rgba(0, 62, 100, 0.04);
    overflow: hidden;
    transition: all 0.3s ease-in-out;

    .item {
        box-sizing: border-box;
        margin-top: 0;
        border-bottom: 1px solid #d7dce5;

        &:last-child {
            border: none;
        }

        &.active {
            color: #007aff;
        }
    }
}
</style>
