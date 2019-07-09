<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li v-for="(tab, index) in tabList" :key="index"
                class="tab __pointer" :class="{ 'active': $route.name === tab }"
                @click="go(tab)" > {{ $t(`${tab}.title`) }}
            </li>
        </ul>

        <ul class="right-lab-list">
            <div class="tab __pointer" @click="goHelp">{{ $t("help") }}</div>
            <div v-show="!isLogin" @click="dexStart" class="tab __pointer">
                {{ isHaveUsers ? $t("unlockAcc") : $t("login") }}
            </div>
            <div v-show="!isLogin" @click="dexChange" class="tab __pointer">
                {{ isHaveUsers ? $t('changeAcc') : $t('register') }}</div>
            <div v-show="isHaveUsers && $route.name.indexOf('trade') !== -1" class="tab __pointer"
                 @click="showToken">
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
import { execWithValid } from 'utils/execWithValid';

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
        return { isShowDexToken: false };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        isHaveUsers() {
            return !!this.$store.state.wallet.currHDAcc;
        }
    },
    methods: {
        showToken: execWithValid(function () {
            this.isShowDexToken = true;
        }, function () {
            return this.dexStart();
        }),
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
        color: #bdc1d1;
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
                content: "";
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
