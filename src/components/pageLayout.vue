<template>
    <div class="page-layout-wrapper" @click="operate">
        <div class="page-wrapper">
            <sidebar class="sidebar" :active="active" :go="go" :menuList="menuList" ></sidebar>
            <vite-menu class="menu" :active="active" :go="go" :menuList="menuList"></vite-menu>

            <div class="page-content">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
import sidebar from 'components/sidebar';
import viteMenu from 'components/menu';
import routeConfig from 'routes';

let operateTimeout = null;
const loginRoutes = routeConfig.loginRoutes;

export default {
    components: {
        sidebar, viteMenu
    },
    props: {
        active: {
            type: String,
            default: '',
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
        isLogin: function() {
            this.setMenuList();
            if (this.isLogin) {
                this.operate();
                return;
            }
            this.clearOperate();
        }
    },
    methods: {
        setMenuList() {
            let activeAccount = this.$wallet.getActiveAccount();
            let menuList = ['account', 'quota', 'SBP', 'vote', 'transList'];
            if (activeAccount && activeAccount.type === 'wallet') {
                menuList.push('conversion');
            }
            menuList.push('index');
            menuList.push('setting');
            menuList.push(this.isLogin ? 'logout' : 'login');
            this.menuList = menuList;
        },
        go(name) {
            if (name === 'logout') {
                this.$wallet.logout();
                this.$router.push({
                    name: 'index'
                });
                return;
            }

            if (name === 'login') {
                this.login(name);
                return;
            }

            if (this.active === name) {
                return;
            }

            if (loginRoutes.indexOf(name) === -1 || this.$wallet.isLogin) {
                this.$router.push({ name });
                return;
            }

            this.login(name);
        },
        login(name) {
            (name !== 'login') && this.$wallet.setLastPage(name);
            this.$router.push({
                name: 'start'
            });
        },
        clearOperate() {
            clearTimeout(operateTimeout);
            operateTimeout = null;
        },
        operate() {
            this.clearOperate();
            operateTimeout = setTimeout(()=>{
                operateTimeout = null;
                location.reload();
            }, 5 * 60 * 1000);
        }
    }
};
</script>

<style lang="scss" scoped>
.page-layout-wrapper {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
}
.head {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background-image: linear-gradient(126deg, #1B3BD8 0%, #176CE0 31%, #0B92E7 49%, #0BB6EB 71%, #00E0F2 100%);
    text-align: center;
    .sync-block {
        display: inline-block;
        line-height: 60px;
    }
}
.page-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fafcff;
    .menu {
        display: none;
    }
    .sidebar {
        float: left;
        width: 70px;
    }
}
.page-content {
    margin-left: 70px;
    height: 100%;
    overflow: auto;
    .__wrapper {
        padding: 40px;
    }
}

@media only screen and (max-width: 750px) {
    .page-wrapper .page-content .__wrapper {
        padding: 15px;
    }
}

@media only screen and (max-width: 500px) {
    .page-wrapper {
        display: flex;
        flex-direction: column;
    }
    .page-wrapper .menu  {
        display: block;
    }
    .page-wrapper .sidebar  {
        display: none;
    }
    .page-wrapper .page-content {
        flex: 1;
        margin-left: 0;
    }
}
</style>
