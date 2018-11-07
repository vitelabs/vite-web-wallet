<template>
    <layout>
        <div v-show="showPassWrapper" class="item" :class="{ 'unlock': !lock }">
            <div class="title __pointer">{{ $t('setting.unlock') }}</div>
            <div class="input-wrapper">
                <input :disabled="!lock" class="pass" v-model="pass" type="password" :placeholder="$t('create.input')" />
            </div>
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

export default {
    components: {
        layout, accList, lang, mnemonic
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();
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
                this.$toast( this.$t('accDetail.hint.wrong') );
                return;
            }

            this.isSubmiting = true;
            this.lock = !this.activeAccount.verify(this.pass);
            this.isSubmiting = false;
            this.lock && this.$toast( this.$t('accDetail.hint.wrong') );
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
        color: #1D2024;
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
            background: #FFFFFF;
            border: 1px solid #D4DEE7;
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
        background: #007AFF;
        border-radius: 2px;
        font-family: $font-normal-b, arial, sans-serif;
        font-size: 14px;
        color: #FFFFFF;
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
