<template>
    <confirm :title="title || $t('pwdConfirm.title')" 
             :content="content" :showMask="showMask"
             :leftBtnTxt="cancelTxt || $t('btn.cancel')" :rightBtnTxt="submitTxt || $t('btn.submit')"
             :leftBtnClick="_cancle"  :rightBtnClick="_submit">
        <div class="pass-input">
            <input v-model="password" :placeholder="$t('pwdConfirm.placeholder')" type="text"/>
        </div>
        <div class="hold-pwd" @click="toggleHold">
            <span v-show="isPwdHold">hold</span>
            {{ $t('pwdConfirm.conf') }}
        </div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm.vue';

const holdTime = 10000;

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
        }
    },
    data() {
        return {
            password: '',
            isPwdHold: false
        };
    },
    methods: {
        clear() {
            this.password = '';
            this.isPwdHold = false;
        },
        toggleHold() {
            this.isPwdHold = !this.isPwdHold;
        },
        _cancle() {
            this.clear();
            this.cancel && this.cancel();
        },
        _submit() {
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
.pass-input {
    width: 100%;
    input {
        width: 100%;
    }
}
</style>
