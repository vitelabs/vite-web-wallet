<template>
    <page-layout>
        <div class="setting-wrapper">
            <sec-title class="setting-sec-title" :isShowHelp="false"></sec-title>
            <div class="content-wrapper">
                <div class="content">
                    <div v-if="!!currHDAcc" class="big-title">{{ $t('setting.addrList') }}</div>
                    <accList v-if="!!currHDAcc"></accList>

                    <div v-if="!!isLogin&&!currHDAcc.isSeparateKey" class="big-title">{{ $t('setting.secure') }}</div>
                    <mnemonic v-if="!!isLogin&&!currHDAcc.isSeparateKey"></mnemonic>
                    <hold-pwd v-if="!!isLogin&&!currHDAcc.isSeparateKey" class="item"></hold-pwd>
                </div>

                <div class="area">
                    <div class="big-title">{{ $t('setting.config') }}</div>
                    <auto-logout v-if="!!isLogin&&!currHDAcc.isSeparateKey"></auto-logout>
                    <lang></lang>
                    <currency></currency>
                    <gate></gate>
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
import pageLayout from '@pc/components/pageLayout/index.vue';
import secTitle from '@pc/components/secTitle.vue';
import holdPwd from '@pc/components/password/holdPwd.vue';
import netInfo from './netInfo.vue';
import lang from './lang.vue';
import gate from './gate.vue';
import autoLogout from './autoLogout.vue';
import accList from './accList.vue';
import mnemonic from './mnemonic.vue';
import currency from './currency.vue';
import { StatusMap } from '@pc/wallet';

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
        currency,
        gate
    },
    data() {
        return { isTestEnv: import.meta.env.DEV };
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
@use "@assets/scss/theme.scss" as *;
@use "./setting.scss";

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
        border-radius: 2px;
        @include bg_color_2();
        @include box_shadow();
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
