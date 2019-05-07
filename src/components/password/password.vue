<template>
    <confirm :title="pwdTitle"
             :content="content" :showMask="showMask"
             :btnUnuse="isLoading" :isShowLoading="true"
             :leftBtnTxt="cancelTxt || $t('btn.cancel')" :rightBtnTxt="submitTxt || $t('btn.submit')"
             :leftBtnClick="exchange ? _submit : _cancle"  :rightBtnClick="exchange ? _cancle : _submit">

        <form autocomplete="off" v-show="isShowPWD" class="pass-input" :class="{ 'distance': !!content }">
            <input ref="passInput" v-model="password" :placeholder="$t('pwdConfirm.placeholder')" type="password"/>
        </form>

        <hold-pwd-view v-show="isShowPWD && isShowHold"></hold-pwd-view>
    </confirm>
</template>

<script>
import localStorage from 'utils/localStorage';
import confirm from 'components/confirm.vue';
import holdPwdView from './holdPwd.vue';

let lastE = null;
const HoldPwdKey = 'isHoldPWD';
const ShowHoldNumKey = 'showHoldPWDNum';

export default {
    components: { confirm, holdPwdView },
    props: {
        type: {
            type: String,
            default: 'normal'
        },
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
        },
        exchange: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        lastE = this.$onKeyDown(13, () => {
            this._submit();
        });
    },
    destroyed() {
        this.$onKeyDown(13, lastE);
    },
    data() {
        const isHoldPWD = !!localStorage.getItem(HoldPwdKey);
        const showHoldNum = +localStorage.getItem(ShowHoldNumKey) || 0;
        const isShowHold = showHoldNum < 3 && !isHoldPWD;

        localStorage.setItem(ShowHoldNumKey, isShowHold ? showHoldNum + 1 : 4);

        return {
            password: '',
            isLoading: false,
            isShowHold
        };
    },
    computed: {
        pwdTitle() {
            if (this.type === 'normal') {
                return this.title || this.$t('pwdConfirm.title');
            }

            const activeAccount = this.$wallet.getActiveAccount();
            const name = activeAccount ? activeAccount.getName() : '';

            return this.$t('pwdConfirm.unlockAcc', { name });
        }
    },
    methods: {
        clear() {
            this.password = '';
        },

        _cancle() {
            this.clear();
            this.cancel && this.cancel();
        },
        _submit() {
            if (this.isLoading) {
                return;
            }

            if (!this.isShowPWD) {
                this.clear();
                this.submit && this.submit();
                return;
            }

            const password = this.$trim(this.password);
            if (!password) {
                this.$toast(this.$t('hint.pwEmpty'));
                return false;
            }

            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast(this.$t('hint.err'));
                return false;
            }

            const deal = result => {
                if (!result) {
                    this.$toast(this.$t('hint.pwErr'));
                    return false;
                }

                if (this.type !== 'normal') {
                    this.$toast(this.$t('unlockSuccess'));
                }

                this.clear();
                this.submit && this.submit();
            };

            if (this.$wallet.isLogin) {
                activeAccount.verify(password).then(result => {
                    deal(result);
                }).catch(() => {
                    deal(false);
                });
                return;
            }

            this.isLoading = true;
            this.$wallet.login({
                id: activeAccount.getId(),
                entropy: activeAccount.getEntropy(),
                addr: activeAccount.getDefaultAddr()
            }, password).then(() => {
                this.isLoading = false;
                if (!this.password) {
                    return;
                }
                activeAccount = this.$wallet.getActiveAccount();
                activeAccount.unlock();
                this.$store.commit('setDefaultAddress', activeAccount.getDefaultAddr());

                deal(true);
            }).catch(err => {
                this.isLoading = false;
                if (!this.password) {
                    return;
                }
                console.warn(err);
                deal(false);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.pass-input {
    width: 100%;
    background: #fff;
    border: 1px solid #d4dee7;
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
</style>
