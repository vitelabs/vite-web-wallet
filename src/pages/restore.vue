<template>
    <mnemonic title="mnemonic.restore" :submit="validMnemonic">
        <div class="wrapper">
            <textarea v-model="mnemonic" :class="{
                'center': !mnemonic
            }" :placeholder="$t('mnemonic.placeholder')"></textarea>
            <span v-show="errMsg" class="msg __err_msg" >
                {{ errMsg === 'mnemonic.empty' || errMsg === 'mnemonic.error' ? $t(errMsg) : errMsg }}
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
    mounted() {
        this.$onEnterKey(() => {
            this.validMnemonic();
        });
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

            let mnemonic = this.mnemonic.replace(/(^\s*)|(\s*$)/g,'');
            if (!mnemonic) {
                this.errMsg = 'mnemonic.empty';
                return;
            }

            this.isLoading = true;
            viteWallet.Wallet.restoreAddrs(mnemonic).then(()=>{
                this.isLoading = false;
                this.$router.push({
                    name: 'createAccount'
                });
            }).catch(err => {
                console.warn(err);
                this.errMsg = 'mnemonic.error';
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
        text-align: left;
        word-wrap: break-word;
        &.center {
            text-align: center;
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
