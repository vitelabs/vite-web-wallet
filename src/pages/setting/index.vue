<template>
    <layout>
        <div v-show="showPassWrapper" class="item" :class="{ 'unlock': !lock }">
            <div class="title __pointer">{{ $t('setting.unlock') }}</div>
            <div class="input-wrapper">
                <input :disabled="!lock" class="pass" v-model="pass" type="password" :placeholder="$t('startCreate.input')" />
            </div>
            <span class="btn __pointer" @click="validPass">{{ $t('btn.submit') }}</span>
        </div>

        <mnemonic v-if="!!isLogin" :lock="lock" class="item"></mnemonic>
        <accList v-if="!!activeAccount" class="item"></accList>
        <lang class="item"></lang>
        <auto-logout v-if="!!isLogin" class="item"></auto-logout>
        <no-pass v-if="!!isLogin" class="item"></no-pass>

        <router-link v-if="!!isLogin && isTestEnv" :to="{ name: 'mintage' }">mintage</router-link>
    </layout>
</template>

<script>
import layout from './layout.vue';
import accList from './accList.vue';
import lang from './lang.vue';
import mnemonic from './mnemonic.vue';
import autoLogout from './autoLogout.vue';
import noPass from './noPass.vue';

export default {
    components: { layout, accList, lang, mnemonic, autoLogout, noPass },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const showPassWrapper = activeAccount ? activeAccount.type === 'wallet' : false;

        return {
            isLogin: !!this.$wallet.isLogin,
            isSubmiting: false,
            activeAccount,
            showPassWrapper,
            pass: '',
            lock: true,
            isTestEnv: process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test'
        };
    },
    methods: {
        validPass() {
            if (this.isSubmiting || !this.lock) {
                return;
            }

            if (!this.pass) {
                this.$toast(this.$t('hint.pwErr'));
                return;
            }

            this.isSubmiting = true;
            this.activeAccount.verify(this.pass).then(result => {
                this.isSubmiting = false;
                this.lock = !result;
                this.lock && this.$toast(this.$t('hint.pwErr'));
            }).catch(() => {
                this.isSubmiting = false;
                this.lock = true;
                this.$toast(this.$t('hint.pwErr'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.item {
    margin-bottom: 20px;
    margin-top: 0;

    &.unlock {
        .pass {
            border: 1px solid #efefef;
        }

        .btn {
            background: #efefef;
            color: #666;
        }
    }

    .title {
        font-size: 14px;
        color: #1d2024;
        font-family: $font-bold, arial, sans-serif;
        letter-spacing: 0.35px;
        line-height: 16px;
        margin-bottom: 16px;
    }

    .input-wrapper {
        display: inline-block;
        width: 83%;
        height: 40px;
        margin-right: 10px;

        .pass {
            display: inline-block;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            padding: 0 15px;
            line-height: 40px;
            background: #fff;
            border: 1px solid #d4dee7;
            border-radius: 2px;
            font-size: 14px;
        }
    }

    .btn {
        position: relative;
        top: -1px;
        float: right;
        width: 12%;
        max-width: 60px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: #007aff;
        border-radius: 2px;
        font-family: $font-normal-b, arial, sans-serif;
        font-size: 14px;
        color: #fff;

        &.unuse {
            background: #efefef;
            color: #666;
        }
    }
}

@media only screen and (max-width: 500px) {
    .item .input-wrapper {
        width: 75%;
    }

    .item .btn {
        width: 60px;
    }
}
</style>
