<template>
    <page-layout>
        <div class="setting-wrapper">
            <sec-title class="setting-sec-title" :isShowHelp="false"></sec-title>
            <div class="content-wrapper">
                <div class="content">
                    <div v-if="!!currHDAcc" class="big-title">{{ $t('setting.addrList') }}</div>
                    <accList v-if="!!currHDAcc"></accList>

                    <div v-if="!!isLogin&&!currHDAcc.isBifrost" class="big-title">{{ $t('setting.secure') }}</div>
                    <mnemonic v-if="!!isLogin&&!currHDAcc.isBifrost"></mnemonic>
                    <hold-pwd v-if="!!isLogin&&!currHDAcc.isBifrost" class="item"></hold-pwd>
                </div>

                <div class="area">
                    <div class="big-title">{{ $t('setting.config') }}</div>
                    <auto-logout v-if="!!isLogin&&!currHDAcc.isBifrost"></auto-logout>
                    <lang></lang>
                    <currency></currency>
                </div>

                <div class="area">
                    <div class="big-title">{{ $t('setting.netInfo') }}</div>
                    <net-info></net-info>
                </div>
            </div>
        </div>
    </page-layout>
</template>

<script>
import pageLayout from 'components/pageLayout/index';
import secTitle from 'components/secTitle';
import holdPwd from 'components/password/holdPwd.vue';
import netInfo from './netInfo';
import lang from './lang.vue';
import autoLogout from './autoLogout.vue';
import accList from './accList.vue';
import mnemonic from './mnemonic.vue';
import currency from './currency.vue';
import { StatusMap } from 'wallet';

export default {
    components: {
        pageLayout,
        secTitle,
        netInfo,
        lang,
        autoLogout,
        holdPwd,
        accList,
        mnemonic,
        currency
    },
    data() {
        return { isTestEnv: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test' };
    },
    computed: {
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
        },
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./setting.scss";

.setting-wrapper {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    .setting-sec-title {
        margin-top: 10px;
    }

    .content-wrapper {
        position: absolute;
        top: 40px;
        bottom: 10px;
        left: 0px;
        right: 0px;
        overflow: auto;
        background: #fff;
        box-shadow: 0px 2px 10px 1px rgba(176, 192, 237, 0.42);
        border-radius: 2px;

        .content {
            max-width: 510px;
            padding: 0 20px 20px;
        }
    }
    .area {
        padding: 0 20px 20px;
        border-top: 1px solid rgba(198, 203, 212, .3);
    }
}
</style>
