<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li v-for="(tab, index) in tabList" :key="index"
                class="tab __pointer" :class="{ 'active': active === tab }"
                @click="go(tab)" > {{ $t(`${tab}.title`) }}
            </li>
        </ul>

        <go-net-btn class="go-net-wrapper"></go-net-btn>
        <change-lang class="menu change-lang-wrapper"></change-lang>

        <ul class="right-lab-list">
            <div v-show="!isLogin" @click="dexStart" class="tab __pointer">
                {{ isHaveUsers ? $t('unlockAcc') : $t('login')  }}</div>
            <div v-show="!isLogin" @click="dexChange" class="tab __pointer">
                {{ isHaveUsers ? $t('changeAcc') : $t('register') }}</div>
            <div v-show="active.indexOf('trade') !== -1 " class="tab __pointer"
                 v-unlock-account="showToken" @noactiveacc="dexStart">
                {{ $t('dexToken') }}</div>
        </ul>

        <dex-token v-if="isShowDexToken" :close="closeToken"></dex-token>
    </div>
</template>

<script>
import changeLang from 'components/changeLang';
import dexToken from 'components/dexToken';
import goNetBtn from './goNetBtn.vue';

export default {
    components: { goNetBtn, changeLang, dexToken },
    props: {
        tabList: {
            type: Array,
            default: () => []
        },
        go: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.$router.afterEach(to => {
            this.active = to.name;
        });
        this.isLogin = !!this.$wallet.isLogin;
        this.$wallet.onLogin(() => {
            this.isLogin = true;
        });
        this.$wallet.onLogout(() => {
            this.isLogin = false;
        });
    },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();

        return {
            active: this.$route.name,
            isLogin: false,
            isShowDexToken: false,
            isHaveUsers: !!activeAccount
        };
    },
    methods: {
        showToken() {
            this.isShowDexToken = true;
        },
        closeToken() {
            this.isShowDexToken = false;
        },

        dexStart() {
            if (!this.isHaveUsers) {
                this.go('start');
                return;
            }
            const activeAccount = this.$wallet.getActiveAccount();
            activeAccount && activeAccount.unlockAccount();
        },
        dexChange() {
            if (!this.isHaveUsers) {
                this.$router.push({ name: 'startCreate' });

                return;
            }
            this.go('start');
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.dex .head .tab {
    color: rgba(189, 193, 209, 1);
    font-size: 13px;
}

.head {
    box-sizing: border-box;
    padding-left: 10px;
    line-height: 43px;
    margin: 0 10px;
    border-bottom: 1px solid rgba(198, 203, 212, 0.3);

    .tab-list-wrapper {
        display: block;
        display: flex;
        flex-wrap: wrap;
        float: left;
    }

    .right-lab-list {
        float: right;
    }

    .tab {
        font-size: 14px;
        font-family: $font-bold, arial, sans-serif;
        font-weight: 600;
        color: rgba(29, 32, 36, 0.6);
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        white-space: nowrap;
        margin-right: 28px;
        text-align: center;

        &.active {
            position: relative;
            color: rgba(0, 122, 255, 1);
            border-bottom: 2px solid rgba(0, 122, 255, 1);

            &::after {
                content: '';
                display: inline-block;
                border: 6px solid transparent;
                border-bottom: 6px solid rgba(0, 122, 255, 1);
                position: absolute;
                bottom: 0;
                left: 50%;
                margin-left: -6px;
            }
        }
    }

    .go-net-wrapper {
        float: right;
        margin-top: 8px;
    }

    .change-lang-wrapper {
        float: right;
    }
}

@media only screen and (max-width: 940px) {
    .wallet .head .tab-list-wrapper {
        width: 100%;
    }

    .wallet .head .change-lang-wrapper {
        float: left;
        margin-left: 20px;
    }

    .wallet .head {
        .go-net-wrapper {
            float: left;
        }

        .right-lab-list {
            float: left;
        }
    }
}

@media only screen and (max-width: 900px) {
    .wallet .head .tab-list-wrapper .tab {
        box-sizing: border-box;
        padding: 0 10px;
    }
}
</style>
