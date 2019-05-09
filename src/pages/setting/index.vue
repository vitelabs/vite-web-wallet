<template>
    <div class="setting-wrapper">
        <sec-title :isShowHelp="false"></sec-title>
        <div class="content-wrapper">
            <div class="content">
                <div v-if="!!activeAccount" class="big-title">{{ $t('setting.addrList') }}</div>
                <accList v-if="!!activeAccount"></accList>

                <div v-if="!!isLogin" class="big-title">{{ $t('setting.secure') }}</div>
                <mnemonic v-if="!!isLogin"></mnemonic>
                <hold-pwd v-if="!!isLogin" class="item"></hold-pwd>
            </div>

            <div class="area">
                <div class="big-title">{{ $t('setting.config') }}</div>
                <auto-logout v-if="!!isLogin"></auto-logout>
                <lang></lang>
                <currency></currency>
            </div>

            <div class="area">
                <div class="big-title">{{ $t('setting.netInfo') }}</div>
                <net-info></net-info>
            </div>
        </div>
    </div>
</template>

<script>
import secTitle from 'components/secTitle';
import holdPwd from 'components/password/holdPwd.vue';
import netInfo from './netInfo';
import lang from './lang.vue';
import autoLogout from './autoLogout.vue';
import accList from './accList.vue';
import mnemonic from './mnemonic.vue';
import currency from './currency.vue';

export default {
    components: {
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
        const activeAccount = this.$wallet.getActiveAccount();

        return {
            isLogin: !!this.$wallet.isLogin,
            activeAccount,
            isTestEnv: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test'
        };
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./setting.scss";

.setting-wrapper {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    padding: 40px;

    .content-wrapper {
        position: absolute;
        top: 102px;
        bottom: 30px;
        left: 40px;
        right: 40px;
        overflow: auto;
        background: #fff;
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.17);
        border-radius: 8px;

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

@media only screen and (max-width: 850px) {
    .setting-wrapper {
        padding: 15px;
    }

    .setting-wrapper .content-wrapper {
        top: 70px;
        bottom: 15px;
        left: 15px;
        right: 15px;
    }
}

@media only screen and (max-width: 500px) {
    .setting-wrapper {
        background: #fff;
    }

    .setting-wrapper .content-wrapper {
        left: 15px;
        right: 15px;
        bottom: 15px;
        box-shadow: none;
        border-radius: 0;

        .content {
            padding: 0;
        }
        .area {
            padding: 0;
            border: none;
        }
    }
}
</style>
