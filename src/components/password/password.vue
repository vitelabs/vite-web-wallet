<template>
    <confirm :title="title || $t('pwdConfirm.title')" 
             :content="content" :showMask="showMask"
             :leftBtnTxt="cancelTxt || $t('btn.cancel')" :rightBtnTxt="submitTxt || $t('btn.submit')"
             :leftBtnClick="_cancle"  :rightBtnClick="_submit">
        <div v-show="isShowPWD" class="pass-input" :class="{
            'distance': !!content
        }">
            <input v-model="password" :placeholder="$t('pwdConfirm.placeholder')" type="password"/>
        </div>
        <div v-show="isShowPWD && isShowPWDHold" class="hold-pwd __pointer" @click="toggleHold">
            <span :class="{ 'active': isPwdHold }"></span>
            {{ $t('pwdConfirm.conf') }}
        </div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm.vue';

const holdTime = 5 * 60 * 1000;

export default {
    components: {
        confirm
    },
    props: {
        showMask: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: ''
        },
        cancel: {
            type: Function,
            default: () => {}
        },
        submit: {
            type: Function,
            default: () => {}
        },
        content: {
            type: String,
            default: ''
        },
        submitTxt: {
            type: String,
            default: ''
        },
        cancelTxt: {
            type: String,
            default: ''
        },
        isShowPWD: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isShowPWDHold: !window.isShowPWD,
            password: '',
            isPwdHold: false
        };
    },
    methods: {
        clear() {
            this.password = '';
        },
        toggleHold() {
            if (!this.isShowPWD) {
                return;
            }
            this.isPwdHold = !this.isPwdHold;
        },

        _cancle() {
            this.clear();
            this.cancel && this.cancel();
        },
        _submit() {
            if (!this.isShowPWD) {
                this.clear();
                this.submit && this.submit();
                return;
            }

            let password = this.$trim(this.password);
            if (!password) {
                this.$toast( this.$t('hint.pwEmpty') );
                return false;
            }

            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast( this.$t('hint.err') );
                return false;
            }

            let result = activeAccount.verify(password);
            if (!result) {
                this.$toast( this.$t('hint.pwErr') );
                return false;
            }

            this.isPwdHold && activeAccount.holdPWD(password, holdTime);
            this.clear();
            this.submit && this.submit();
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.pass-input {
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #D4DEE7;
    border-radius: 2px;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 15px;
    &.distance {
        margin-top: 30px;
    }
    input {
        width: 100%;
        font-size: 14px;
    }
}
.hold-pwd {
    font-family: $font-normal;
    font-size: 14px;
    color: #1D2024;
    margin-top: 12px;
    span {
        display: inline-block;
        margin-bottom: -3px;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 16px;
        &.active {
            background: url('../../assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}
</style>
