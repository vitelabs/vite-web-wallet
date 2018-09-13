<template>
    <div class="import-account-wrapper">
        <div class="__title">导入账户</div>

        <div ref="fileArea" class="file-drag" @drop="dragFile">
            {{ $t('dragDrop.text') }}
            <span class="msg __err_msg" v-show="errMsg" >
                {{ errMsg === 'dragDrop.err2' || errMsg === 'dragDrop.err1' ? $t(errMsg) : errMsg }}
            </span>
        </div>
        <div @click="openFile" class="__btn __btn_all_in __pointer">
            <input ref="file" type="file" name="file" style="display:none"/>
            打开文件夹导入
        </div>
        <span class="__btn __btn_border __pointer" @click="back" >{{ $t('btn.back') }}</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            files: [],
            errMsg: ''
        };
    },
    methods: {
        dragFile(e) {
            e.preventDefault();
            e.stopPropagation();

            let files = e.dataTransfer.files;
            files && files.length && this.getFile(files);
        },
        openFile() {
            let fileDom = this.$refs.file;
            if (!fileDom) {
                return;
            }
            fileDom.click();
            let _this = this;
            fileDom.onchange = function () {     
                _this.getFile(this.files);
            };
        },
        getFile(files) {
            if (files.length > 1) {
                this.errMsg = 'dragDrop.err2';
                return;
            }

            let file = files[0];
            let reader = new FileReader();
            reader.onload = (e) => {
                let keystore = viteWallet.Wallet.isValidKeystore(e.target.result);

                if (!keystore) {
                    this.errMsg = 'dragDrop.err1';
                    return;
                }

                let account = viteWallet.Wallet.saveAcc({ keystore });
                this.$router.push({
                    name: 'login',
                    params: {
                        addr: account.addr
                    }
                });
            };
            reader.readAsText(file);
        },
        back() {
            this.$router.go(-1);
        }
    }
};
</script>

<style lang="scss" scoped>
.file-drag {
    position: relative;
    height: 228px;
    background: #F3F6F9;
    border: 1px solid #D4DEE7;
    border-radius: 3px;
    line-height: 228px;
    text-align: center;
    font-size: 16px;
    color: rgba(94,104,117,0.30);
    .msg {
        position: absolute;
        left: 0;
        bottom: 0;
    }
}
.__btn {
    margin-top: 20px;
}

</style>

