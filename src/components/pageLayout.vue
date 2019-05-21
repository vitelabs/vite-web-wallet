<template>
    <div class="page-layout-wrapper" @click="operate">
        <sidebar class="sidebar" :active="active" :go="go" :menuList="menuList" ></sidebar>

        <div class="page-content">
            <div class="page-scroll-wrapper">
                <second-menu v-show="secondMenuList && secondMenuList.length"
                             :go="go" class="second-menu" :tabList="secondMenuList">
                </second-menu>
                <div class="page-wrapper">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from 'components/sidebar';
import secondMenu from 'components/secondMenu';
import { StatusMap } from 'wallet';

let autoLogout = null;

export default {
    components: { sidebar, secondMenu },
    props: {
        active: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.setMenuList();
    },
    data() {
        return { menuList: [] };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        secondMenuList() {
            if (this.active.indexOf('trade') === 0) {
                return [ 'trade', 'tradeAssets', 'tradeOpenOrders', 'tradeOrderHistory' ];
            }

            if (this.active.indexOf('wallet') !== 0) {
                return [];
            }

            const list = [ 'wallet', 'walletQuota', 'walletSBP', 'walletVote', 'walletTransList' ];
            this.isLogin && list.push('walletConversion');
            return list;
        },
        autoLogoutTime() {
            return this.$store.state.env.autoLogoutTime * 60 * 1000;
        }
    },
    watch: {
        isLogin: function () {
            this.setMenuList();

            if (this.isLogin) {
                this.operate();
                return;
            }

            this.clearAutoLogout();
        }
    },
    methods: {
        setMenuList() {
            const menuList = [ 'wallet', 'trade', 'setting' ];
            menuList.push(this.isLogin ? 'logout' : 'login');
            this.menuList = menuList;
        },
        go(name) {
            if (name === 'logout') {
                this.$store.commit('logout');
                return;
            }

            if (name === 'login') {
                this.$router.push({ name: 'start' });
                return;
            }

            if (this.active === name) {
                return;
            }

            const account = this.$store.state.wallet.currHDAcc;
            if (!account && name !== 'setting') {
                this.$router.push({ name: 'start' });
                return;
            }

            this.$router.push({ name });
        },

        clearAutoLogout() {
            clearTimeout(autoLogout);
            autoLogout = null;
        },
        operate() {
            this.clearAutoLogout();

            if (!this.isLogin) {
                return;
            }

            autoLogout = setTimeout(() => {
                autoLogout = null;
                location.reload();
            }, this.autoLogoutTime);
        }
    }
};
</script>

<style lang="scss" scoped>
.dex .page-layout-wrapper .page-content {
    .page-scroll-wrapper .page-wrapper {
        flex: none;
        height: calc(100% - 60px);
    }
}
.wallet .page-layout-wrapper .page-content .second-menu {
    margin: 0 30px;
}

.page-layout-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: #fafcff;
    overflow: auto;

    .sidebar {
        width: 70px;
    }

    .page-content {
        flex: 1;
        height: 100%;
        overflow: auto;

        .page-scroll-wrapper {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            min-width: 1200px;
        }

        .page-wrapper {
            flex: 1;
        }
    }
}
</style>
