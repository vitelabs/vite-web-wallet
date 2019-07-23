<template>
    <div>
        <div class="__title">File</div>

        <div ref="fileArea" class="file-drag" @drop="dragFile">
            {{ $t('keystore.dragDrop.text') }}
            <span class="msg __err_msg" v-show="errMsg" >
                {{ errMsg === 'keystore.dragDrop.err2' || errMsg === 'keystore.dragDrop.err1' ? $t(errMsg) : errMsg }}
            </span>
        </div>

        <div class="hint">{{ $t('keystore.dragDrop.hint') }}</div>

        <div @click="openFile" class="__btn __btn_all_in __pointer">
            <input class="open-file" ref="file" type="file" name="file"/>
            {{ $t('keystore.dragDrop.guide') }}
        </div>

        <div class="account-list-wrapper">
            <div class="__title">Exited Account</div>
            <div class="__btn_input_active __pointer"
                 v-for="(account, i) in accountList" :key="i"
                 @click="getKeystoreCB(account, 'localStorage')">
                <div class="name">{{ account.name }}</div>
                <div class="address __ellipsis">{{ account.addr }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import { keystore } from '@vite/vitejs';
import { getKeystoreAccList } from 'utils/store';

export default {
    props: {
        getKeystoreCB: {
            type: Function,
            default: () => {}
        }
    },

    data() {
        const accountList = getKeystoreAccList() || [];

        return {
            accountList,
            files: [],
            errMsg: ''
        };
    },
    methods: {
        dragFile(e) {
            e.preventDefault();
            e.stopPropagation();

            const files = e.dataTransfer.files;
            files && files.length && this.getFile(files);
        },
        openFile() {
            const fileDom = this.$refs.file;
            if (!fileDom) {
                return;
            }
            fileDom.click();
            const _this = this;
            fileDom.onchange = function () {
                _this.getFile(this.files);
            };
        },
        getFile(files) {
            if (files.length > 1) {
                this.errMsg = 'keystore.dragDrop.err2';
                return;
            }

            const file = files[0];
            const reader = new FileReader();
            reader.onload = e => {
                const result = keystore.isValid(e.target.result);

                if (!result) {
                    this.errMsg = 'keystore.dragDrop.err1';
                    return;
                }

                const keystoreObj = JSON.parse(e.target.result);
                this.getKeystoreCB({
                    keystore: keystoreObj,
                    addr: keystoreObj.hexaddress
                }, 'file');
            };
            reader.readAsText(file);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "./common.scss";

.hint {
    font-size: 14px;
    color: #000;
    text-align: center;
    line-height: 20px;
    margin-bottom: 30px;
    margin-top: 30px;
}

.file-drag {
    position: relative;
    background: #f3f6f9;
    border: 1px solid #d4dee7;
    border-radius: 3px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    font-size: 16px;
    color: rgba(94, 104, 117, 0.3);

    .msg {
        position: absolute;
        left: 0;
        bottom: 0;
    }
}

.__btn {
    margin-top: 20px;
    .open-file {
        width: 0;
    }
}

.account-list-wrapper {
    margin-top: 30px;
    background: #fff;
    .address {
        width: 100%;
        font-family: $font-normal-b;
        font-size: 12px;
        line-height: 20px;
        color: #333;
    }
}
</style>
