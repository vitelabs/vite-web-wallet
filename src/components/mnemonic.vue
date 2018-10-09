<template>
    <div class="import-account-wrapper">
        <div class="__title">{{ $t(`${title}`) }}</div>

        <div v-show="isRecord" class="note">{{ $t('mnemonic.prompt') }}</div>
        <div class="input-wrapper"> <slot></slot> </div>
        <div v-show="isRestore" class="note hint">{{ $t('mnemonic.hint') }}</div>

        <div class="__btn_list">
            <span class="__btn __btn_border __pointer" @click="back">{{ $t('btn.back') }}</span>
            <span class="__btn __btn_all_in __pointer" @click="submit">
                {{ isRestore ? $t('btn.submit') : $t('create.finish') }}
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        submit: {
            type: Function,
            default: ()=>{}
        }
    },
    data() {
        return {
            isRecord: false,
            isRestore: false
        };
    },
    mounted() {
        this.isRecord = this.$route.name === 'record';
        this.isRestore = this.$route.name === 'restore';
    },
    methods: {
        back() {
            viteWallet.Wallet.clearActiveAccount();
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.note {
    font-size: 14px;
    color: #FFFFFF;
    text-align: left;
    line-height: 20px;
    margin-bottom: 30px;
    &.hint {
        margin-top: 30px;
    }
}
.input-wrapper {
    box-sizing: border-box;
    position: relative;
    background: #F3F6F9;
    border: 1px solid #D4DEE7;
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    color: #1D2024;
}
.__btn_list {
    margin-top: 20px;
}
</style>
