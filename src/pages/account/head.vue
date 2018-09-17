<template>
    <div class="account-head-wrapper">
        <div class="custom-name">
            <div class="head-title">
                <span>{{ $t('accDetail.name') }}</span>
                <img @click="startRename" class="edit __pointer" src="../../assets/imgs/edit_icon.svg"/>
            </div>
            
            <span class="name __ellipsis" @click="startRename" v-show="!isShowNameInput">{{ account.name }}</span>
            <input ref="nameInput" v-show="isShowNameInput" type="text"
                   v-model="editName" :placeholder="account.name"
                   @blur="rename"/>
        </div>

        <div class="addr-wrapper">
            <div class="head-title">
                <span>{{ $t('accDetail.address') }}</span>
                <img src="../../assets/imgs/qrcode_default.svg" @click="copy" class="title_icon __pointer"/>
                <img src="../../assets/imgs/copy_default.svg" @click="copy" class="title_icon copy __pointer"/>
                <span class="copy-success" :class="{'show': copySuccess}">{{ $t('accDetail.hint.copy') }}</span>
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
                <img src="../../assets/imgs/right.svg" class="icon" />
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import copy from 'utils/copy';

export default {
    data() {
        return {
            account: {},
            isShowNameInput: false,
            editName: '',
            copySuccess: false,
        };
    },
    mounted() {
        this.account = this.getSimpleAcc();
    },
    methods: {
        copy() {
            copy(this.account.addr);

            this.copySuccess = true;
            setTimeout(()=>{
                this.copySuccess = false;
            }, 500);
        },

        goDetail() {
            let locale = this.$i18n.locale === 'zh' ? 'zh/' : '';
            window.open(`https://testnet.vite.net/${locale}account/${this.account.addr}`);
        },

        getTestToken() {
            viteWallet.TestToken.get(this.account.addr).then(()=>{
                window.alert(this.$t('accDetail.hint.token'));
            }).catch((err) => {
                console.warn(err);
                window.alert(this.$t('accDetail.hint.tErr'));
            });
        },
        getSimpleAcc() {
            let acc = viteWallet.Wallet.getAccInstance(this.$route.params);
            return {
                name: acc.getName(),
                addr: acc.getDefaultAddr(),
                entropy: acc.entropy || ''
            };
        },

        clearEditName() {
            this.isShowNameInput = false;
            this.editName = '';
            window.document.onkeydown = null;
        },
        startRename() {
            if (this.isShowNameInput) {
                return;
            }
            this.isShowNameInput = true;
            Vue.nextTick(()=>{
                window.document.onkeydown = (e) => {
                    e = e || window.event;
                    let code = e.keyCode || e.which;
                    if (!code || code !== 13) {
                        return;
                    }
                    this.rename();
                };
                this.$refs.nameInput.focus();
            });
        },
        rename() {
            if (!this.editName) {
                this.clearEditName();
                return;
            }

            if ( !/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/g.test(this.editName) ) {
                window.alert(this.$t('create.hint.name'));
                this.clearEditName();
                return;
            }

            if (this.editName.length > 32) {
                window.alert(this.$t('create.hint.nameLong'));
                this.clearEditName();
                return;
            }

            
            let res = viteWallet.Wallet.rename(this.account, this.editName);
            if (!res) {
                window.alert('fail');
                return;
            }
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
    margin: 0 40px;
    background: #FFFFFF;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
    padding: 30px;
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
            &.copy {
                margin-right: 10px;
            }
        }
    }
    .addr-wrapper {
        display: inline-block;
        min-width: 510px;
        text-align: left;
        .addr-content {
            font-size: 14px;
            width: 100%;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
            background: #F3F6F9;
            border: 1px solid #D4DEE7;
            border-radius: 2px;
            padding: 0 8px;
            color: #283D4A;
        }
        .copy-success {
            transition: all 0.3s ease-in-out;
            position: absolute;
            bottom: 6px;
            left: 50%;
            margin-left: -62px; 
            background: #5B638D;
            box-sizing: border-box;
            border: 1px solid #979797;
            border-radius: 6px;
            font-size: 12px;
            line-height: 12px;
            color: #FFFFFF;
            padding: 6px;
            opacity: 0;
            font-family: $font-normal;
            &.show {
                opacity: 1;
            }
            &:after {
                content: ' ';
                display: inline-block;
                border: 6px solid transparent;
                border-top: 6px solid #5B638D;
                position: absolute;
                bottom: -12px;
                left: 50%;
                margin-left: -6px;
            }
        }
    }
    .custom-name {
        position: absolute;
        font-size: 24px;
        color: #1D2024;
        text-align: left;
        font-family: $font-bold;
        .name {
            display: inline-block;
            line-height: 32px;
        }
        input {
            height: 32px;
            line-height: 32px;
            font-size: 20px;
            width: 400px;
            text-indent: 10px;
        }
    }
    .btn-group {
        position: absolute;
        top: 30px;
        right: 30px;
        font-family: $font-normal-b;
        margin-right: 8px;        
        .btn__small {
            width: 210px;
            height: 33px;
            line-height: 33px;
            text-align: center;
            font-size: 14px;
            border-radius: 2px;
        }
        .__btn-test {
            background: #007AFF;
            color: #FFFFFF;
            height: 35px;
            line-height: 35px;
        }
        .__btn-detail {
            border: 1px solid #007AFF;
            color: #007AFF;
            margin-top: 12px;
        }
        .icon {
            margin-bottom: -7px;
        }
    }
}
</style>
