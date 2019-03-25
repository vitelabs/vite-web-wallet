<template>
    <div class="page-layout-wrapper" @click="operate">
        <sidebar class="sidebar" :active="active" :go="go" :menuList="menuList" ></sidebar>
        <vite-menu class="menu" :active="active" :go="go" :menuList="menuList"></vite-menu>

        <div class="page-content" :class="{'page-scroll': active.indexOf('exchange') === 0}">
            <div class="page-scroll-wrapper">
                <second-menu v-show="secondMenuList && secondMenuList.length"
                             :go="go" class="second-menu" :tabList="secondMenuList"
                             :class="{'have-padding': active.indexOf('exchange') !== 0}">
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
import viteMenu from 'components/menu';
import secondMenu from 'components/secondMenu';
import localStorage from 'utils/localStorage';

let autoLogout = null;
// Minutes
const _t = localStorage.getItem('autoLogoutTime') || 5;
const autoLogoutTime = _t * 60 * 1000;

export default {
    components: { sidebar, viteMenu, secondMenu },
    props: {
        active: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            isLogin: false,
            menuList: []
        };
    },
    mounted() {
        this.isLogin = !!this.$wallet.isLogin;
        this.setMenuList();
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
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
    computed: {
        secondMenuList() {
            if (this.active.indexOf('exchange') === 0) {
                return [ 'exchange', 'exchangeAssets', 'exchangeOpenOrders', 'exchangeOrderHistory' ];
            }
            if (this.active.indexOf('wallet') !== 0) {
                return [];
            }
            const list = [ 'wallet', 'walletQuota', 'walletSBP', 'walletVote', 'walletTransList' ];

            const activeAccount = this.$wallet.getActiveAccount();
            this.isLogin && activeAccount.type === 'wallet' && list.push('walletConversion');

            return list;
        }
    },
    methods: {
        setMenuList() {
            const menuList = [ 'wallet', 'exchange', 'setting' ];
            menuList.push(this.isLogin ? 'logout' : 'login');
            this.menuList = menuList;
        },
        go(name) {
            if (name === 'logout') {
                this.$wallet.logout();
                this.$router.push({ name: 'exchange' });
                return;
            }

            if (name === 'login') {
                this.$router.push({ name: 'start' });
                return;
            }

            if (this.active === name) {
                return;
            }

            const account = this.$wallet.getActiveAccount();
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
            autoLogout = setTimeout(() => {
                autoLogout = null;
                location.reload();
            }, autoLogoutTime);
        }
    }
};
</script>

<style lang="scss" scoped>
.page-layout-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background: #fafcff;

    .menu {
        display: none;
    }

    .sidebar {
        width: 70px;
    }

    .page-content {
        flex: 1;
        height: 100%;
        overflow: hidden;

        .page-scroll-wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .second-menu.have-padding {
            margin: 0 30px;
        }

        &.page-scroll {
            overflow: auto;
            .page-scroll-wrapper {
                width: 100%;
                height: 100%;
                min-width: 1350px;
                .page-wrapper {
                    flex: none;
                    overflow: unset;
                    height: calc(100% - 60px);
                }
            }
        }

        .page-wrapper {
            flex: 1;
            overflow: auto;
        }
    }
}

@media only screen and (max-width: 500px) {
    .page-layout-wrapper {
        display: flex;
        flex-direction: column;
    }

    .page-layout-wrapper .menu {
        display: block;
    }

    .page-layout-wrapper .sidebar {
        display: none;
    }

    .page-layout-wrapper .page-content {
        flex: 1;
        margin-left: 0;
    }
}
</style>
