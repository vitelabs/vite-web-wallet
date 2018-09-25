<template>
    <div class="import-account-wrapper">
        <div class="__title">{{ $t(`${title}`) }}</div>

        <div v-show="showNote" class="note">
            {{ $t('mnemonic.prompt') }}
        </div>
        <div class="input-wrapper">
            <slot></slot>
        </div>

        <div class="btn_list">
            <span class="__btn __btn_border __pointer" @click="back">{{ $t('btn.back') }}</span>
            <span class="__btn __btn_all_in __pointer" @click="submit">{{ $t('btn.submit') }}</span>
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
            showNote: false
        };
    },
    mounted() {
        this.showNote = this.$route.name === 'record';
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
    text-align: center;
    line-height: 20px;
    margin-bottom: 30px;
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
    .__err_msg {
        background: rgba(255,41,41, 0.08);
        width: 100%;
        height: 34px;
        line-height: 34px;
        text-align: center;
        font-size: 12px;
        color: #FF2929;
    }
}
.btn_list {
    margin-top: 20px;
    .__btn {
        display: inline-block;
        width: 167px;
    }
    .__btn_border {
        margin-right: 20px;
    }
}
</style>
