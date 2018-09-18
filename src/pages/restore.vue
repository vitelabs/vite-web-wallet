<template>
    <mnemonic title="title.restore" :submit="validMnemonic">
        <div class="wrapper">
            <textarea v-model="mnemonic" :class="{
                'center': !mnemonic
            }" :placeholder="$t('mnemonic.placeholder')"></textarea>
            <span v-show="errMsg" class="msg __err_msg" >
                {{ errMsg === 'dragDrop.err2' || errMsg === 'dragDrop.err1' ? $t(errMsg) : errMsg }}
            </span>
        </div>
    </mnemonic>
</template>

<script>
import mnemonic from 'components/mnemonic.vue';

export default {
    components: {
        mnemonic
    },
    data() {
        return {
            mnemonic: '',
            errMsg: '',
            isLoading: false
        };
    },
    methods: {
        validMnemonic() {
            if (this.isLoading) {
                return;
            }

            if (!this.mnemonic) {
                this.errMsg = '助记词输入为空';
                return;
            }

            this.isLoading = true;
            viteWallet.Wallet.getAddrsFromMnemonic(this.mnemonic).then((list)=>{
                this.isLoading = false;
            }).catch(err => {
                console.warn(err);
                this.errMsg = '助记词错误';
                this.isLoading = false;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.wrapper {
    box-sizing: border-box;
    position: relative;
    padding: 20px;
    height: 120px;
    color: rgba(94,104,117,0.30);
    textarea {
        width: 100%;
        height: 100%;
        resize: none;
        text-align: center;
        word-break: break-all;
        &.center {
            line-height: 80px;
        }
    }
    .msg {
        position: absolute;
        left: 0;
        bottom: 0;
    }
}
</style>
