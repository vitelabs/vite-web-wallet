<template>
    <div class="page-layout-wrapper" @click="operate">
        <guide></guide>

        <sidebar class="sidebar" :active="active" :go="go" :menuList="menuList" ></sidebar>

        <div class="page-content">
            <div class="page-scroll-wrapper">
                <second-menu v-show="active.indexOf('setting') === -1"
                             :go="go" class="second-menu"
                             :tabList="secondMenuList"
                             :class="{ 'assets': active.indexOf('assets') === 0 }" >
                </second-menu>
                <div class="page-wrapper">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { StatusMap } from 'wallet';
import sidebar from './sidebar';
import secondMenu from './secondMenu';
import { sidebarMenuList, secondMenuList } from './config';
import guide from 'components/guide';

let autoLogout = null;

export default {
    components: { guide, sidebar, secondMenu },
    mounted() {
        this.$router.afterEach(to => {
            this.active = to.name;
        });
        this.setMenuList();
    },
    data() {
        return {
            active: this.$route.name,
            menuList: []
        };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        secondMenuList() {
            let list = [];
            if (this.active.indexOf('trade') === 0) {
                list = secondMenuList.trade;
            } else if (this.active.indexOf('assets') === 0) {
                list = secondMenuList.assets;
            }

            if (this.active.indexOf('wallet') !== 0) {
                return [].concat(list);
            }

            list = [].concat(secondMenuList.wallet);
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
        },
        autoLogoutTime: function () {
            this.operate();
        }
    },
    methods: {
        setMenuList() {
            const menuList = [];
            for (const key in sidebarMenuList) {
                menuList.push(key);
            }
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

            this.$router.push({ name: sidebarMenuList[name] || name });
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
.wallet .page-layout-wrapper .page-content {
    .page-scroll-wrapper .page-wrapper {
        display: flex;
    }
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
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 100%;
        overflow: auto;

        .page-scroll-wrapper {
            position: relative;
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            min-width: 1350px;
            .assets{
                padding: 0 10px;
            }
        }

        .page-wrapper {
            flex: 1;
        }
    }
}
</style>
