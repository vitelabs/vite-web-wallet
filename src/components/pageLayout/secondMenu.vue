<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li
                v-for="(tab, index) in tabList"
                :key="index"
                class="tab __pointer"
                :class="{ active: $route.name === tab }"
                @click="go(tab)"
            >
                {{ $t(`${tab}.title`) }}
            </li>
        </ul>

        <ul class="right-lab-list">
            <SwitchComp class="tab __pointer" :optList="optList" :value="selectInvite" @input="inviteDialog"/>
            <div class="tab __pointer" @click="goHelp">{{ $t("help") }}</div>
            <div v-show="!isLogin" @click="dexStart" class="tab __pointer">
                {{ isHaveUsers ? $t("unlockAcc") : $t("login") }}
            </div>
            <div v-show="!isLogin" @click="dexChange" class="tab __pointer">
                {{ isHaveUsers ? $t('changeAcc') : $t('register') }}</div>
            <div v-show="isHaveUsers && $route.name.indexOf('trade') !== -1" class="tab __pointer"
                 @click="goOperator">{{ $t('tradeOperator.title') }}</div>
            <switch-addr class="switch-tab menu" v-show="$route.name !== 'assets'" ></switch-addr>
        </ul>
    </div>
</template>

<script>
import { StatusMap } from 'wallet';
import switchAddr from 'components/switchAddress';
import SwitchComp from 'uiKit/switch.vue';
import { inviteDialog, receiveInviteDialog } from 'components/dialog';
import { execWithValid } from 'utils/execWithValid';

export default {
    components: { switchAddr, SwitchComp },
    data() {
        return {
            optList: [ { name: this.$t('assets.invite.inviteTitle'), value: 'invite' }, { name: this.$t('assets.invite.receiveInviteTitle'), value: 'receiveInvite' } ],
            selectInvite: 'invite'
        };
    },
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
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        isHaveUsers() {
            return !!this.$store.state.wallet.currHDAcc;
        }
    },
    methods: {
        inviteDialog(v) {
            this.selectInvite = 'invite';
            if (v === 'invite') {
                inviteDialog();
            } else if (v === 'receiveInvite') {
                receiveInviteDialog();
            }
        },
        goOperator() {
            this.$router.push({ name: 'tradeOperator' });
        },
        goHelp() {
            window.open('/help');
        },
        dexStart: execWithValid(function () {},
            function () {
                this.go('start');
            }),
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
        border: none;
        user-select: none;
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
