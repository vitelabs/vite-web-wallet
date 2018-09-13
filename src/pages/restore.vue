<template>
    <div class="import-account-wrapper">
        <div class="__title">助记词恢复账户</div>

        <div class="input-wrapper">
            <textarea v-model="mnemonic" :class="{
                'center': !mnemonic
            }" placeholder="请输入您的助记词"></textarea>
            <span v-show="errMsg" class="msg" >
                {{ errMsg === 'dragDrop.err2' || errMsg === 'dragDrop.err1' ? $t(errMsg) : errMsg }}
            </span>
        </div>
        <div class="btn_list">
            <span class="__btn __btn_border __pointer" @click="back">返回</span>
            <span class="__btn __btn_all_in __pointer" @click="validMnemonic">确定</span>
        </div>
    </div>
</template>

<script>
export default {
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

            this.isLoading = true;
            viteWallet.Wallet.getAddrsFromMnemonic(this.mnemonic).then((list)=>{
                console.log(list);
                this.isLoading = false;
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
            });
        },
        back() {
            if (this.isLoading) {
                return;
            }
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.input-wrapper {
    position: relative;
    height: 120px;
    background: #F3F6F9;
    border: 1px solid #D4DEE7;
    border-radius: 3px;
    text-align: center;
    font-size: 16px;
    color: rgba(94,104,117,0.30);
    textarea {
        width: 100%;
        height: 100%;
        resize: none;
        box-sizing: border-box;
        padding: 20px;
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
        opacity: 0.08;
        background: #FF2929;
        width: 100%;
        height: 34px;
        line-height: 34px;
        font-size: 12px;
        color: #FF2929;
        text-align: center;
    }
}
.__btn {
    margin-top: 20px;
}
.btn_list {
    .__btn {
        display: inline-block;
        width: 167px;
    }
    .__btn_border {
        margin-right: 20px;
    }
}
</style>

