<template>
    <div class="page-layout-wrapper" @click="operate">
        <sidebar class="sidebar" :active="active" :go="go" :menuList="menuList" ></sidebar>
        <vite-menu class="menu" :active="active" :go="go" :menuList="menuList"></vite-menu>

        <div class="page-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import sidebar from 'components/sidebar';
import viteMenu from 'components/menu';
import localStorage from 'utils/localStorage';

let autoLogout = null;
let _t = localStorage.getItem('autoLogoutTime') || 5;   // Minutes
const autoLogoutTime = _t * 60 * 1000;

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
            this.clearAutoLogout();
        }
    },
    methods: {
        setMenuList() {
            let activeAccount = this.$wallet.getActiveAccount();
            let menuList = ['account', 'quota', 'SBP', 'vote', 'transList'];
            if (activeAccount && activeAccount.type === 'wallet') {
                menuList.push('conversion');
            }
            menuList.push('exchange');
            menuList.push('setting');
            menuList.push(this.isLogin ? 'logout' : 'login');
            this.menuList = menuList;
        },
        go(name) {
            if (name === 'logout') {
                this.$wallet.logout();
                this.$router.push({ 
                    name: 'exchange' 
                });
                return;
            }

            if (name === 'login') {
                this.$router.push({
                    name: 'start'
                });
                return;
            }

            (this.active !== name) && this.$router.push({ name });
        },

        clearAutoLogout() {
            clearTimeout(autoLogout);
            autoLogout = null;
        },
        operate() {
            this.clearAutoLogout();
            autoLogout = setTimeout(()=>{
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
        overflow: auto;
        .__wrapper {
            padding: 40px;
        }
    }
}

@media only screen and (max-width: 750px) {
    .page-layout-wrapper .page-content .__wrapper {
        padding: 15px;
    }
}

@media only screen and (max-width: 500px) {
    .page-layout-wrapper {
        display: flex;
        flex-direction: column;
    }
    .page-layout-wrapper .menu  {
        display: block;
    }
    .page-layout-wrapper .sidebar  {
        display: none;
    }
    .page-layout-wrapper .page-content {
        flex: 1;
        margin-left: 0;
    }
}
</style>
