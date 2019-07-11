<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li v-for="(tab, index) in tabList" :key="index"
                class="tab __pointer" :class="{ 'active': $route.name === tab }"
                @click="go(tab)" > {{ $t(`${tab}.title`) }}
            </li>
        </ul>

        <ul class="right-lab-list">
            <!-- <div class="tab __pointer" @click="goHelp">{{ $t('help') }}</div> -->
            <!-- <div v-show="isHaveUsers && $route.name.indexOf('assets') !== -1"
                 @click="getTestToken" class="tab __pointer">{{ $t('wallet.getTestToken') }}</div> -->
            <div v-show="!isLogin" @click="dexStart" class="tab __pointer">
                {{ isHaveUsers ? $t('unlockAcc') : $t('login')  }}</div>
            <div v-show="!isLogin" @click="dexChange" class="tab __pointer">
                {{ isHaveUsers ? $t('changeAcc') : $t('register') }}</div>
            <div v-show="isHaveUsers && $route.name.indexOf('trade') !== -1" class="tab __pointer"
                 v-unlock-account="showToken" @noactiveacc="dexStart">
                {{ $t('dexToken') }}</div>
            <switch-addr class="switch-tab menu" v-show="$route.name !== 'assets'" ></switch-addr>
        </ul>

        <dex-token v-if="isShowDexToken" :close="closeToken"></dex-token>
    </div>
</template>

<script>
import { StatusMap } from 'wallet';
import dexToken from 'components/dexToken';
import switchAddr from 'components/switchAddress';
import { pwdConfirm } from 'components/password/index.js';
import $ViteJS from 'utils/viteClient';

export default {
    components: { dexToken, switchAddr },
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
    data() {
        return {
            isShowDexToken: false,
            getTestTokenAble: true
        };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        isHaveUsers() {
            return !!this.$store.state.wallet.currHDAcc;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        }
    },
    methods: {
        getTestToken() {
            if (!this.getTestTokenAble) {
                return;
            }

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            if (!this.address) {
                this.$toast(this.$t('wallet.hint.tErr'));
            }

            this.getTestTokenAble = false;
            $ViteJS.request('testapi_getTestToken', this.address).then(() => {
                this.$toast(this.$t('wallet.hint.token'));
                setTimeout(() => {
                    this.getTestTokenAble = true;
                }, 3000);
            }).catch(err => {
                console.warn(err);
                this.getTestTokenAble = true;
                this.$toast(this.$t('wallet.hint.tErr'), err);
            });
        },

        showToken() {
            this.isShowDexToken = true;
        },
        closeToken() {
            this.isShowDexToken = false;
        },

        goHelp() {
            window.open('/help');
        },
        dexStart() {
            if (!this.isHaveUsers) {
                this.go('start');
                return;
            }
            pwdConfirm({ type: 'unlockAccount' });
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

.head {
    box-sizing: border-box;
    padding-left: 10px;
    line-height: 43px;
    margin: 0 10px;
    border-bottom: 1px solid rgba(198, 203, 212, 0.3);
    justify-content: space-between;
    display: flex;
    flex-wrap: nowrap;

    .tab-list-wrapper {
        display: flex;
        .tab {
            margin-right: 28px;
        }
    }

    .right-lab-list {
        display: flex;
        flex-wrap: nowrap;
        .tab {
            margin-left: 28px;
        }
    }

    .switch-tab {
        display: inline-block;
        width: auto;
        margin-left: 20px;
    }

    .tab {
        color: #BDC1D1;
        font-size: 13px;
        @include font-family-bold();
        font-weight: 600;
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        white-space: nowrap;
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
}
</style>
