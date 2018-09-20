<template>
    <div class="sidebar-wrapper">
        <div @mouseenter="overLogo"  @mouseleave="leaveLogo" class="logo __pointer">
            <img src="../assets/imgs/ViteLogo2.svg" />
            <test-notice class="notice" :class="{'hide': !isShowNotice}"></test-notice>
        </div>

        <router-link :class="{
            'icon': true,
            'home': true,
            'active': active === 'account'
        }" :to="{
            name: 'account',
            params: { addr, entropy }
        }"></router-link>

        <router-link class="__pointer icon send" :class="{
            'active': active === 'transList'
        }" :to="{ 
            name: 'transList',
            params: { addr, entropy }
        }"></router-link>

        <div class="_bottom">
            <router-link class="icon setting __pointer" :class="{
                'active': active === 'setting'
            }" :to="{
                name: 'setting',
                params: { addr, entropy }
            }"></router-link>
            <div class="logout __pointer" @click="logout"></div>
        </div>
    </div>
</template>

<script>
import testNotice from 'components/testNotice';

export default {
    components: {
        testNotice
    },
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            active: this.$route.name,
            addr: this.$route.params.addr || '',
            entropy: this.$route.params.entropy || '',
            isShowNotice: false
        };
    },
    mounted() {
        this.$router.afterEach((to) => {
            this.active = to.name;
        });
    },
    methods: {
        overLogo() {
            this.isShowNotice = true;
        },
        leaveLogo() {
            this.isShowNotice = false;
        },

        logout() {
            let activeAccount = viteWallet.Wallet.getActiveAccount();
            activeAccount.lock();
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
        display: inline-block;
        width: 100%;
        height: 54px;
        margin-top: 48px;
        &.active:before {
            content: '';
            display: inline-block;
            width: 4.5px;
            height: 54px;
            background-image: linear-gradient(-90deg, #1B3BD8 100%, #176CE0 100%, #0B92E7 100%, #0BB6EB 100%, #00E0F2 100%);
        }
    }
    .home {
        background: url('../assets/imgs/index_icon_default.svg') no-repeat center;
        &.active {
            background: url('../assets/imgs/index_icon_pressed.svg') no-repeat center;
        }
    }
    .send {
        background: url('../assets/imgs/transfer_default.svg') no-repeat center;
        &.active {
            background: url('../assets/imgs/transfer_pressed.svg') no-repeat center;
        }
    }
    ._bottom {
        position: absolute;
        bottom: 60px;
        width: 100%;
        .setting {
            margin-bottom: 35px;
            background: url('../assets/imgs/settings_default.svg') no-repeat center;
            &.active {
                background: url('../assets/imgs/settings_pressed.svg') no-repeat center;
            }
        }
        .logout {
            width: 100%;
            height: 30px;
            background: url('../assets/imgs/logout_default.svg') no-repeat center;
            &:hover {
                background: url('../assets/imgs/logout_pressed.svg') no-repeat center;
            }
        }
    }
}
</style>
