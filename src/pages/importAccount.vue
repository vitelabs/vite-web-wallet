/**  vite-wallet index-layout */

<template>
    <div class="import-account-wrapper">
        <div class="__title">{{ $t('nav.head.imported') }}</div>

        <div ref="fileArea" class="file-drag" @drop="dragFile">
            {{ $t('dragDrop.text') }}
            <span class="msg __err_msg" v-show="errMsg" >
                {{ errMsg === 'dragDrop.err2' || errMsg === 'dragDrop.err1' ? $t(errMsg) : errMsg }}
            </span>
        </div>
        <div class="hint">{{ $t('dragDrop.hint') }}</div>
        <div @click="openFile" class="__btn __btn_all_in __pointer">
            <input ref="file" type="file" name="file" style="display:none"/>
            {{ $t('dragDrop.guide') }}
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
                let result = this.$wallet.importKeystore(e.target.result);

                if (!result) {
                    this.errMsg = 'dragDrop.err1';
                    return;
                }

                this.$router.push({
                    name: 'login'
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
.hint {
    font-size: 14px;
    color: #FFFFFF;
    text-align: center;
    line-height: 20px;
    margin-bottom: 30px;
    margin-top: 30px;
}

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
@media only screen and (max-width: 500px) {
    .file-drag {
        height: 100px;
        line-height: 100px;
    }
}

.__btn {
    margin-top: 20px;
}
</style>
