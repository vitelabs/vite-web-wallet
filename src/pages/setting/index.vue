<template>
    <layout>
        <div v-show="showPassWrapper" class="item" :class="{ 'unlock': !lock }">
            <div class="title __pointer">{{ $t('setting.unlock') }}</div>
            <input :disabled="!lock" class="pass" v-model="pass" type="password" :placeholder="$t('create.input')" />
            <span class="btn __pointer" @click="validPass">{{ $t('btn.submit') }}</span>
        </div>

        <mnemonic :lock="lock" class="item"></mnemonic>
        <accList class="item"></accList>
        <lang class="item"></lang>
    </layout>
</template>

<script>
import layout from './layout.vue';
import accList from './accList.vue';
import lang from './lang.vue';
import mnemonic from './mnemonic.vue';
import toast from 'utils/toast/index.js';

export default {
    components: {
        layout, accList, lang, mnemonic
    },
    data() {
        let activeAccount = viteWallet.Wallet.getActiveAccount();
        let showPassWrapper = activeAccount ? !!activeAccount.isWalletAcc : false;

        return {
            isSubmiting: false,
            activeAccount,
            showPassWrapper,
            pass: '',
            lock: true
        };
    },
    methods: {
        validPass() {
            if (this.isSubmiting || !this.lock) {
                return;
            }

            if (!this.pass) {
                toast( this.$t('accDetail.hint.wrong') );
                return;
            }

            this.isSubmiting = true;
            this.lock = !this.activeAccount.verify(this.pass);
            this.isSubmiting = false;
            this.lock && toast( this.$t('accDetail.hint.wrong') );
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.item {
    width: 474px;
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
        color: #1D2024;
        letter-spacing: 0.35px;
        line-height: 16px;
        margin-bottom: 16px;
    }
    .pass {
        display: inline-block;
        box-sizing: border-box;
        width: 397px;
        height: 40px;
        padding: 0 15px;
        margin-right: 10px;
        line-height: 40px;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
    }
    .btn {
        position: relative;
        top: -2px;
        display: inline-block;
        width: 60px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        background: #007AFF;
        border-radius: 2px;
        font-family: $font-normal-b;
        font-size: 14px;
        color: #FFFFFF;
        &.unuse {
            background: #efefef;
            color: #666;
        }
    }
}

@media only screen and (max-width: 500px) {
    .item {
        width: auto;
    }
    .item .pass {
        width: 78%;
    }
    .item .btn {
        float: right;
    }
}
</style>
