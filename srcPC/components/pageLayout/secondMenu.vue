<template>
    <div class="head">
        <ul class="tab-list-wrapper">
            <li
                v-for="(tab, index) in tabList"
                :key="index"
                class="tab __pointer"
                :class="{ active: $route.name === tab }"
                @click="_go(tab)"
            >
                {{ $t(`${tab}.title`) }}
            </li>
        </ul>

        <ul class="right-lab-list">
            <SwitchComp class="tab __pointer invite-switch" :optList="inviteOptLit" :value="selectInvite" @input="inviteDialog" v-show="$route.name.indexOf('trade') !== -1"/>
            <div v-show="$route.name.indexOf('trade') === -1" class="tab __pointer" @click="goAnnouncements">{{ $t("announcements") }}</div>
            <div v-show="$route.name.indexOf('trade') === -1" class="tab __pointer" @click="goHelp">{{ $t("help") }}</div>
            <div v-show="!isHaveUsers" @click="login"
                 class="tab __pointer"> {{ $t("login") }}</div>
            <div v-show="!isLogin && isHaveUsers" @click="_unlock" class="tab __pointer">{{ $t("unlockAcc") }}</div>
            <div v-show="!isLogin && isHaveUsers" class="tab __pointer"
                 @click="changeAcc">{{ $t('changeAcc') }}</div>

            <SwitchComp @input="operateAction" v-show="isHaveUsers && $route.name.indexOf('trade') !== -1" class="more-switch tab __pointer" :title="$t('trade.more')" :optList="moreOptList" />
            <switch-addr class="switch-tab menu" v-show="$route.name !== 'assets'" ></switch-addr>
            <div class="tab __pointer" v-show="isLogin" @click="logout">{{ $t('saveLogout') }}</div>
        </ul>
    </div>
</template>

<script>
import { StatusMap } from 'wallet';
import switchAddr from 'pcComponents/switchAddress';

import statistics from 'utils/statistics';
import SwitchComp from 'uiKit/switch.vue';
import { inviteDialog, receiveInviteDialog } from 'pcComponents/dialog';
import { execWithValid } from 'pcUtils/execWithValid';
import openUrl from 'utils/openUrl';

export default {
    components: { switchAddr, SwitchComp },
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
        return { selectInvite: this.showInvite ? 'invite' : 'receiveInvite' };
    },
    computed: {
        moreOptList() {
            return [ {
                name: this.$t('tradeOperator.title'),
                value: 'operator'
            }, {
                name: this.$t('trade.proxy.title'),
                value: 'proxy'
            }, {
                name: this.$t('tradeVip.title'),
                value: 'tradeVip'
            }, {
                name: this.$t('announcements'),
                value: 'announcements'
            }, {
                name: this.$t('help'),
                value: 'help'
            } ];
        },
        showInvite() {
            if (this.address && this.$store.state.uiConfig.allShowInvite) {
                return true;
            }
            return this.address && this.$store.state.uiConfig.inviteAddrList && this.$store.state.uiConfig.inviteAddrList.find(a => a === this.address);
        },
        inviteOptLit() {
            return this.showInvite ? [
                { name: this.$t('assets.invite.inviteTitle'), value: 'invite' },
                { name: this.$t('assets.invite.receiveInviteTitle'), value: 'receiveInvite' }
            ] : [
                { name: this.$t('assets.invite.receiveInviteTitle'), value: 'receiveInvite' }
            ];
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        isHaveUsers() {
            return !!this.$store.state.wallet.currHDAcc;
        }
    },
    methods: {
        operateAction(action) {
            action === 'operator' && this.goOperator();
            action === 'proxy' && this.goProxy();
            action === 'tradeVip' && this.goTradeVip();
            action === 'help' && this.goHelp();
            action === 'announcements' && this.goAnnouncements();
        },
        inviteDialog(v) {
            this.selectInvite = this.showInvite ? 'invite' : 'receiveInvite';
            statistics.event('secondMenu', `${ this.$route.name }-${ this.selectInvite }`, this.address || '');

            if (v === 'invite') {
                inviteDialog().catch(() => {
                    console.log('not close');
                });
            } else if (v === 'receiveInvite') {
                receiveInviteDialog().catch(() => {
                    console.log('not close');
                });
            }
        },
        _go(name) {
            statistics.event('secondMenu', name, this.address || '');
            this.go && this.go(name);
        },
        goOperator() {
            statistics.event('secondMenu', `${ this.$route.name }-tradeOperator`, this.address || '');
            this.$router.push({ name: 'tradeOperator' });
        },
        goProxy() {
            statistics.event('secondMenu', `${ this.$route.name }-tradeTrust`, this.address || '');
            this.$router.push({ name: 'tradeTrust' });
        },
        goTradeVip() {
            statistics.event('secondMenu', `${ this.$route.name }-tradeVip`, this.address || '');
            this.$router.push({ name: 'tradeVip' });
        },
        goHelp() {
            statistics.event('secondMenu', `${ this.$route.name }-help`, this.address || '');
            if (this.$i18n.locale === 'zh') {
                openUrl('https://forum.vite.net/topic/2250/%E5%A6%82%E6%9E%9C%E6%82%A8%E5%9C%A8%E4%BD%BF%E7%94%A8vitex%E7%9A%84%E6%97%B6%E5%80%99%E9%81%87%E5%88%B0%E4%BA%86%E9%97%AE%E9%A2%98-%E8%AF%B7%E7%9C%8B%E6%AD%A4%E8%B4%B4');
                return;
            }
            openUrl('https://forum.vite.net/topic/2251/if-you-have-a-question-about-using-vitex-please-read-this-article');
        },
        goAnnouncements() {
            statistics.event('secondMenu', `${ this.$route.name }-announcements`, this.address || '');
            if (this.$i18n.locale === 'zh') {
                openUrl('https://vitex.zendesk.com/hc/zh-cn/categories/360002539494-%E5%85%AC%E5%91%8A');
                return;
            }
            openUrl('https://vitex.zendesk.com/hc/en-001/categories/360002539494-Announcement');
        },

        _unlock() {
            statistics.event('secondMenu', `${ this.$route.name }-unlockAccount`, this.address || '');
            this.unlock();
        },
        unlock: execWithValid(function () {},
            function () {
                this.go('startLogin');
            }),
        login() {
            statistics.event('secondMenu', `${ this.$route.name }-login`, this.address || '');
            this.go('startLogin');
        },
        changeAcc() {
            statistics.event('secondMenu', `${ this.$route.name }-switchAccount`, this.address || '');
            this.go('startLogin');
        },
        logout() {
            statistics.event('secondMenu', `${ this.$route.name }-logout`, this.address || '');
            this.$store.commit('logout');
        }
    }
};
</script>

<style lang="scss" scoped>
.head {
    box-sizing: border-box;
    line-height: 43px;
    margin: 0 10px;
    [data-theme="0"] & {
        border-bottom: 1px solid rgba(198, 203, 212, 0.3);
    }
    [data-theme="1"] & {
        border-bottom: 1px solid $black-color-2;
    }
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
            &:last-child {
                margin-left: 18px;
            }
            position: relative;
            margin-left: 28px;
            &.invite-switch{
                /deep/ .list-title{
                    padding: 0!important;
                }
            }
            &.more-switch{
                /deep/ .list-title{
                    padding: 0!important;
                }
            }
        }
    }

    .switch-tab {
        display: inline-block;
        width: auto;
        margin-left: 20px;
    }

    .tab {
        @include second_title_font_color();
        @include font-family-bold();
        font-size: 13px;
        display: inline-block;
        box-sizing: border-box;
        height: 100%;
        white-space: nowrap;
        text-align: center;
        border: none;
        user-select: none;
        &.active {
            position: relative;
            color: $blue-color-1;
            border-bottom: 2px solid $blue-color-1;

            &::after {
                content: "";
                display: inline-block;
                border: 6px solid transparent;
                border-bottom: 6px solid $blue-color-1;
                position: absolute;
                bottom: 0;
                left: 50%;
                margin-left: -6px;
            }
        }
    }
}
</style>
