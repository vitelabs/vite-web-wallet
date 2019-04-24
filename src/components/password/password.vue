<template>
    <confirm :title="pwdTitle"
             :content="content" :showMask="showMask"
             :btnUnuse="isLoading" :isShowLoading="true"
             :leftBtnTxt="cancelTxt || $t('btn.cancel')" :rightBtnTxt="submitTxt || $t('btn.submit')"
             :leftBtnClick="exchange ? _submit : _cancle"  :rightBtnClick="exchange ? _cancle : _submit">
        <form autocomplete="off" v-show="isShowPWD" class="pass-input" :class="{
            'distance': !!content
        }">
            <!-- Safari autocomplete -->
            <!-- <input fake_pass type="password" style="display:none"/> -->
            <input ref="passInput" v-model="password" :placeholder="$t('pwdConfirm.placeholder')" type="password"/>
        </form>
        <div v-show="isShowPWD && isShowPWDHold" class="hold-pwd __pointer" @click="toggleHold">
            <span :class="{ 'active': isPwdHold }"></span>
            {{ $t('pwdConfirm.conf', {
                time: $t(`setting.timeList.${holdTime}`)
            }) }}
        </div>
    </confirm>
</template>

<script>
import localStorage from 'utils/localStorage';
import confirm from 'components/confirm.vue';

let lastE = null;

export default {
    components: { confirm },
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
            this.$refs.passInput.blur();
            this._submit();
        });
    },
    destroyed() {
        this.$onKeyDown(13, lastE);
    },
    data() {
        return {
            holdTime: localStorage.getItem('noPass') || 5,
            isShowPWDHold: !window.isShowPWD,
            password: '',
            isPwdHold: !!window.isPwdHold,
            isLoading: false
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
        toggleHold() {
            if (!this.isShowPWD) {
                return;
            }
            this.isPwdHold = !this.isPwdHold;
            window.isPwdHold = this.isPwdHold;
        },

        _cancle() {
            // if (this.isLoading) {
            //     return;
            // }
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
                this.isPwdHold && activeAccount.holdPWD(password, this.holdTime * 60 * 1000);
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
                activeAccount = this.$wallet.getActiveAccount();
                activeAccount.unlock();
                deal(true);
            }).catch(err => {
                this.isLoading = false;
                console.warn(err);
                deal(false);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~assets/scss/vars.scss';

.dex .hold-pwd {
    font-size: 12px;
    span {
        margin-bottom: -3px;
        width: 14px;
        height: 14px;
    }
}

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

.hold-pwd {
    font-family: $font-normal, arial, sans-serif;
    font-size: 14px;
    color: #1d2024;
    margin-top: 12px;

    span {
        display: inline-block;
        margin-bottom: -3px;
        width: 16px;
        height: 16px;
        box-sizing: border-box;
        background: #fff;
        border: 1px solid #d4dee7;
        border-radius: 16px;

        &.active {
            background: url('../../assets/imgs/presnet.svg') no-repeat center;
            background-size: 16px 16px;
        }
    }
}
</style>
