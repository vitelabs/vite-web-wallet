<template>
    <div class="account-head-wrapper">
        <div class="head-content">
            <div class="custom-name">
                <div class="head-title">
                    <span>{{ $t('accDetail.name') }}</span>
                    <img @click="startRename" class="edit __pointer" src="../../assets/imgs/edit_icon.svg"/>
                </div>
                <div v-show="!isShowNameInput" class="name" :class="{
                    'small-font': account.name && account.name.length > 16
                }" @click="startRename">{{ account.name }}</div>
                <input ref="nameInput" v-show="isShowNameInput" type="text"
                       v-model="editName" :placeholder="account.name"
                       @blur="rename"/>
            </div>

            <div class="addr-wrapper">
                <div class="head-title">
                    <span>{{ $t('accDetail.address') }}</span>
                    <span ref="codeContainer" class="title_icon __pointer qrcode"><img src="../../assets/imgs/qrcode_default.svg" @click="toggleQrCode" />
                        <div class="code-container" v-show="qrcodeShow">
                            <div class="code">
                                <qrcode :text="addressStr" :options="{ size:146 }" @genImage="getImage"></qrcode>
                            </div>
                            <div class="btn" @click="downLoadQrCode">{{ $t('accDetail.saveQrcode') }}</div>
                        </div>
                    </span>
                    <img src="../../assets/imgs/copy_default.svg" @click="copy" class="title_icon copy __pointer"/>
                    <copyOK :copySuccess="copySuccess"></copyOK>
                </div>
                <div class="copy addr-content">{{ account.addr }}</div>
            </div>
        
            <div class="btn-group">
                <div class="btn__small __pointer __btn-test" @click="getTestToken">
                    <span>{{ $t('accDetail.getTestToken') }}</span>
                    <img src="../../assets/imgs/Vite_icon.svg" class="icon" />
                </div>
                <div @click="goDetail" class="btn__small __pointer __btn-detail">
                    {{ $t('accDetail.transDetail') }}
                    <img src="../../assets/imgs/more.svg" class="more-icon" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import qrcode from 'components/qrcode';
import copyOK from 'components/copyOK';
import copy from 'utils/copy';
import { stringify } from 'utils/viteSchema';
import toast from 'utils/toast/index.js';

let activeAccount = null;

export default {
    components: { 
        qrcode, copyOK
    },
    data() {
        return {
            account: {},
            addressStr: '',
            isShowNameInput: false,
            editName: '',
            copySuccess: false,
            qrcode: null,
            qrcodeShow: false
        };
    },
    mounted() {
        activeAccount = viteWallet.Wallet.getActiveAccount();
        this.account = this.getSimpleAcc();
        this.addressStr = stringify({ targetAddress: this.account.addr });
    },
    methods: {
        getImage(i) {
            this.qrcode = i;
        },
        copy() {
            copy(this.account.addr);

            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 1000);
        },
        toggleQrCode() {
            this.qrcodeShow = !this.qrcodeShow;
        },
        closeQrCode(e) {
            if (!e || !e.target) {
                return;
            }

            let codeContainer = this.$refs.codeContainer;
            if (!codeContainer || 
                e.target === codeContainer ||
                codeContainer.contains( e.target )) {
                return;
            }
            
            this.qrcodeShow = false;
        },
        downLoadQrCode(){
            if (!this.qrcode) {
                return;
            }
            location.href = this.qrcode.replace('image/png', 'image/octet-stream');
            this.qrcodeShow = false;
        },
        goDetail() {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`${process.env.viteNet}${locale}account/${this.account.addr}`);
        },

        getTestToken() {
            if (!this.account || !this.account.addr) {
                toast( this.$t('accDetail.hint.tErr') );
            }
            viteWallet.TestToken.get(this.account.addr).then(() => {
                toast( this.$t('accDetail.hint.token') );
            }).catch((err) => {
                console.warn(err);
                toast( this.$t('accDetail.hint.tErr') );
            });
        },
        getSimpleAcc() {
            return {
                name: activeAccount.getName(),
                addr: activeAccount.getDefaultAddr()
            };
        },

        clearEditName() {
            this.isShowNameInput = false;
            this.editName = '';
            this.$offEnterKey();
        },
        startRename() {
            if (this.isShowNameInput) {
                return;
            }
            this.isShowNameInput = true;
            Vue.nextTick(() => {
                this.$onEnterKey(() => {
                    this.rename();
                });
                this.$refs.nameInput.focus();
            });
        },
        rename() {
            if (!this.editName) {
                this.clearEditName();
                return;
            }

            if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.editName)) {
                toast(this.$t('create.hint.name'), 'error');
                this.clearEditName();
                return;
            }

            if (this.editName.length > 32) {
                toast(this.$t('create.hint.nameLong'), 'error');
                this.clearEditName();
                return;
            }

            activeAccount.rename(this.editName);
            this.clearEditName();
            this.account = this.getSimpleAcc();
        }
    }
};
</script>

<style lang="scss">
@import "~assets/scss/vars.scss";

.account-head-wrapper {
    position: relative;
    text-align: center;
    background: #ffffff;
    box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
    border-radius: 2px;
    padding: 30px;
    overflow: auto;
    .head-content {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        min-width: 1050px;
    }
    .head-title {
        position: relative;
        display: block;
        height: 20px;
        line-height: 20px;
        font-size: 14px;
        letter-spacing: 0.35px;
        padding-bottom: 24px;
        font-family: $font-bold;
        .edit {
            display: inline-block;
            width: 20px;
            height: 20px;
            margin-left: 20px;
        }
        .title_icon {
            float: right;
            &.qrcode {
                position: relative;
            }
            .code-container {
                box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
                width: 166px;
                padding: 10px;
                position: absolute;
                right: 100%;
                transform: translateX(20px);
                background: #fff;
                z-index: 1;
                .code {
                    width: 146px;
                    height: 146px;
                    margin: 10px;
                }
                .btn {
                    background: #007aff;
                    border-radius: 2px;
                    color: #fff;
                    margin: 10px 8px;
                    height: 28px;
                    text-align: center;
                    line-height: 28px;
                }
            }
            &.copy {
                margin-right: 10px;
            }
        }
    }
    .addr-wrapper {
        display: inline-block;
        max-width: 510px;
        min-width: 470px;
        text-align: left;
        margin-right: 20px;
        .addr-content {
            font-size: 14px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            background: #f3f6f9;
            border: 1px solid #d4dee7;
            border-radius: 2px;
            padding: 0 8px;
            color: #283d4a;
        }
    }
    .custom-name {
        font-size: 24px;
        color: #1d2024;
        text-align: left;
        font-family: $font-bold;    
        max-width: 28%;
        min-width: 320px;
        word-break: break-all;
        margin-right: 20px;
        .name {
            display: inline-block;
            line-height: 32px;
            &.small-font {
                font-size: 20px;
                line-height: 26px;
            }
        }
        input {
            height: 32px;
            line-height: 32px;
            font-size: 20px;
            width: 100%;
        }
    }
    .btn-group {
        width: 212px;
        font-family: $font-normal-b;
        .btn__small {
            width: 210px;
            height: 33px;
            line-height: 33px;
            text-align: center;
            font-size: 14px;
            border-radius: 2px;
        }
        .__btn-test {
            background: #007aff;
            color: #ffffff;
            height: 35px;
            line-height: 35px;
        }
        .__btn-detail {
            border: 1px solid #007aff;
            color: #007aff;
            margin-top: 12px;
        }
        .icon {
            margin-bottom: -7px;
        }
        .more-icon {
            margin-left: 4px;
        }
    }
}

@media only screen and (max-width: 500px) {
    .account-head-wrapper {
        display: block;
        padding: 15px;
        .head-title {
            padding-bottom: 15px;
            .edit {
                float: right;
            }
        }
    }
    .account-head-wrapper .custom-name {
        width: 100%;
        max-width: 100%;
        min-width: 0px;
        position: relative;
        input {
            width: 100%;
        }
    }
    .account-head-wrapper .addr-wrapper {
        margin-top: 20px;
        display: block;
        width: 100%;
        .addr-content {
            padding: 10px;
            height: auto;
            line-height: 20px;
            word-break: break-all;
        }
    }
    .account-head-wrapper .btn-group {
        margin-top: 20px;
        width: 100%;
        .btn__small {
            width: 100%;
        }
    }
}
</style>
