<template>
    <layout>
        <div v-show="showPassWrapper" class="item" :class="{ 'unlock': !lock }">
            <div class="title __pointer">{{$t('setting.unlock')}}</div>
            <input :disabled="!lock" class="pass" v-model="pass" type="password" :placeholder="$t('create.input')" />
            <span class="btn __pointer" @click="validPass">{{$t('btn.submit')}}</span>
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
        let acc = viteWallet.Wallet.getAccInstance(this.$route.params);
        let showPassWrapper = acc ? !!acc.entropy : false;

        return {
            showPassWrapper,
            pass: '',
            lock: true
        };
    },
    methods: {
        validPass() {
            if (!this.lock || !this.pass) {
                return;
            }
            this.lock = false;
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.item {
    width: 474px;
    margin-bottom: 20px;
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
        line-height: 38px;
        background: #007AFF;
        border-radius: 2px;
        font-family: $font-normal-b;
        font-size: 14px;
        color: #FFFFFF;
    }
}
</style>
