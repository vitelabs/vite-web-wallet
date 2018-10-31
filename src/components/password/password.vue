<template>
    <confirm :title="title" :content="content"
             :leftBtnTxt="$t('btn.cancel')" :rightBtnTxt="$t('btn.submit')"
             :leftBtnClick="cancel"  :rightBtnClick="_submit">
        <div class="pass-input">
            <input v-model="password" type="text"/>
        </div>
        <div @click="toggleHold">
            <span v-show="isPwdHold">hold</span>
            {{ $t('pwdConfirm.conf') }}
        </div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm.vue';
import localStorage from 'utils/localStorage';

export default {
    components: {
        confirm
    },
    props: {
        title: {
            type: String,
            default: () => {
                return this.$t('pwdConfirm.title');
            }
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
        }
    },
    mounted() {

    },
    data() {
        return {
            password: '',
            isPwdHold: false
        };
    },
    methods: {
        toggleHold() {
            this.isPwdHold = !this.isPwdHold;
        },
        _submit() {
            let password = this.$trim(this.password);
            if (!password) {
                this.$toast('hint.pwEmpty');
                return false;
            }

            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast( this.$t('hint.err') );
                return false;
            }

            let result = activeAccount.verify(password);
            if (!result) {
                this.$toast( this.$t('hint.err') );
                return false;
            }

            this.isPwdHold && this.$wallet.holdPWD(password);
            this.submit && this.submit();
        }
    }
};
</script>

<style lang="scss" scoped>

</style>
