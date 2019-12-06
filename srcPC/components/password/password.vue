<template>
    <confirm class="small" :title="pwdTitle"
             :content="content" :showMask="showMask" :isLoading="isLoading"
             :leftBtnTxt="cancelTxt || $t('btn.cancel')" :rightBtnTxt="submitTxt || $t('btn.submit')"
             :leftBtnClick="exchange ? _submit : _cancle"  :rightBtnClick="exchange ? _cancle : _submit">
        <slot></slot>

        <img v-show="isShowPWD" :class="{ 'distance': !!content }" class="unlock-user" src="~assets/imgs/unlock-user.svg"/>
        <form autocomplete="off" v-show="isShowPWD" class="__input __input_row">
            <input ref="passInput" v-model="password" :placeholder="$t('pwdConfirm.placeholder')" type="password"/>
        </form>

        <hold-pwd-view v-show="isShowPWD && isShowHold"></hold-pwd-view>
    </confirm>
</template>

<script>
import { StatusMap } from 'wallet';
import { constant } from 'pcUtils/store';
import confirm from 'pcComponents/confirm/confirm.vue';
import holdPwdView from './holdPwd.vue';

let lastE = null;

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

        const accInfo = this.currHDAcc.getAccInfo();
        const showHoldNum = accInfo.showHoldPWDNum || 0;

        this.isHoldPWD = !!accInfo[constant.HoldPwdKey];
        this.isShowHold = showHoldNum < 3 && !this.isHoldPWD;
        this.currHDAcc.saveOnAcc(constant.ShowHoldPWDNumKey, this.isShowHold ? showHoldNum + 1 : 4);
    },
    destroyed() {
        this.$onKeyDown(13, lastE);
    },
    data() {
        return {
            password: '',
            isLoading: false,
            isHoldPWD: false,
            isShowHold: false
        };
    },
    computed: {
        pwdTitle() {
            if (this.type === 'normal') {
                return this.title || this.$t('pwdConfirm.title');
            }

            const name = this.$store.state.wallet.name;
            return this.$t('pwdConfirm.unlockAcc', { name });
        },
        currHDAcc() {
            return this.$store.state.wallet.currHDAcc;
        },
        isLogin() {
            return this.$store.state.wallet.status === StatusMap.UNLOCK;
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

            if (!this.currHDAcc) {
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

            if (this.isLogin) {
                this.currHDAcc.verify(password).then(() => {
                    deal(true);
                }).catch(() => {
                    deal(false);
                });
                return;
            }

            this.isLoading = true;
            this.$store.dispatch('login', password).then(() => {
                this.isLoading = false;
                if (!this.password) {
                    return;
                }
                this.currHDAcc.activate();
                deal(true);
            }).catch(err => {
                console.warn(err);
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

input {
    width: 100%;
    @include bg_color_1();
    [data-theme="0"] & {
        color: rgba(94,104,117,0.3);
    }
    [data-theme="1"] & {
        color: $gray-color-2;
    }
}

.unlock-user.distance {
    margin-top: 30px;
}
.unlock-user {
    width: 100px;
    height: 100px;
    position: relative;
    left: 50%;
    margin-left: -50px;
    margin-bottom: 30px;
}
</style>
