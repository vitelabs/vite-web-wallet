<template>
    <div class="login-wrapper">
        <div class="__title">{{ $t('login') }}</div>

        <div @click="toggleShowExisting" class="switch-btn" :class="{'radius': isShowExisting}">
            <div class="btn-item __pointer" :class="{'active': isShowExisting}">
                {{ $t('existingAcc') }}</div>
            <div class="btn-item __pointer" :class="{'active': !isShowExisting}">
                {{ $t('restore') }}</div>
        </div>

        <div v-show="isShowExisting" class="existing-acc">
            <div class="bottom __btn __pointer">
                <div v-click-outside="hideAccountList" @click="toggleAccountList">
                    <div v-show="activeAccount && !activeAccount.addr" class="__btn __btn_input">
                        <div class="name __ellipsis">{{ activeAccount.name }}</div>
                    </div>

                    <div v-show="activeAccount && activeAccount.addr" class="__btn __btn_input_active">
                        <div class="name __ellipsis">{{ activeAccount.name }}</div>
                        <div class="address __ellipsis">{{ activeAccount.showAddr }}</div>
                    </div>

                    <span :class="{
                        'slide': true,
                        'down': !isShowAccountList,
                        'up': isShowAccountList
                    }"></span>
                </div>

                <account-list ref="accList" v-show="isShowAccountList"
                              :clickAccount="chooseAccount"></account-list>
            </div>

            <div class="bottom __btn __btn_input"
                 :class="{ 'active': !!password || inputItem === 'pass' }">
                <input ref="passInput" autofocus :placeholder="$t('startCreate.input')"
                       v-model="password" :type="'password'"
                       @focus="inputFocus('pass')" @blur="inputBlur('pass')" />
            </div>

            <div class="__btn_list">
                <span class="__btn __btn_border __pointer" @click="addAcc" >
                    {{ $t('addAccount') }}
                </span>
                <div class="__btn __btn_all_in __pointer" @click="login">
                    <span v-show="!isLoading">
                        {{ isShowExisting ? $t('btn.login') : $t('startCreate.finish') }}
                    </span>
                    <loading v-show="isLoading" loadingType="dot"></loading>
                </div>
            </div>
        </div>

        <restore ref="restoreDom" v-if="!isShowExisting"
                 :leftClick="addAcc" leftTxt="createAcc"
                 :finishCb="showExisting"></restore>
    </div>
</template>

<script>
import Vue from 'vue';
import restore from './restore.vue';
import accountList from './accountList.vue';
import loading from 'components/loading.vue';
import ellipsisAddr from 'utils/ellipsisAddr.js';

export default {
    components: { accountList, loading, restore },
    mounted() {
        this.init();
    },
    destroyed() {
        this.clearAll();
    },
    data() {
        return {
            activeAccount: {},
            password: '',
            isLoading: false,
            isShowAccountList: false,
            inputItem: '',
            isShowExisting: true
        };
    },
    watch: {
        isShowExisting: function () {
            if (!this.isShowExisting) {
                this.clearAll();
                return;
            }
            this.init();
            this.$refs.accList && this.$refs.accList.initAccountList();
        }
    },
    methods: {
        init() {
            this.$onKeyDown(13, () => {
                this.login();
            });
            this.activeAccount = this.getLoginAcc();
        },
        clearAll() {
            this.password = '';
            this.isLoading = false;
            this.$offKeyDown();
        },
        showExisting() {
            this.isShowExisting = true;
        },
        toggleShowExisting() {
            this.isShowExisting = !this.isShowExisting;
        },
        getLoginAcc() {
            let account = this.$wallet.getLast();
            if (account) {
                const addr = account.addr || '';
                const showAddr = account.addr ? ellipsisAddr(account.addr) : '';

                return {
                    name: account.name || '',
                    addr,
                    showAddr,
                    id: account.id || ''
                };
            }

            const list = this.$wallet.getList();
            if (!list || !list.length) {
                this.$router.push({ name: 'start' });

                return;
            }

            account = list[0];
            account.showAddr = account.addr ? ellipsisAddr(account.addr) : '';

            return account;
        },

        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = '');
        },
        focusPass() {
            Vue.nextTick(() => {
                this.$refs.passInput && this.$refs.passInput.focus();
            });
        },

        chooseAccount(account) {
            this.activeAccount = account;
            this.isShowAccountList = false;
            this.password = '';
        },
        toggleAccountList() {
            this.isShowAccountList = !this.isShowAccountList;
        },
        hideAccountList() {
            this.isShowAccountList = false;
        },

        addAcc() {
            this.$wallet.clearActiveAccount();
            this.$router.push({ name: 'startCreate' });
        },
        login() {
            if (!this.isShowExisting) {
                this.$refs.restoreDom && this.$refs.restoreDom.valid();

                return;
            }

            if (!this.activeAccount || this.isLoading) {
                return;
            }

            if (!this.password) {
                this.$toast(this.$t('startCreate.input'), 'error');
                this.focusPass();

                return;
            }

            const loginSuccess = () => {
                if (!this.isLoading) {
                    return;
                }

                this.isLoading = false;
                const activeAccount = this.$wallet.getActiveAccount();
                activeAccount.unlock();

                this.$router.push({ name: this.$wallet.lastPage || 'trade' });
                this.$wallet.clearLastPage();
            };

            this.isLoading = true;
            this.$wallet.login(this.activeAccount, this.password).then(result => {
                result && loginSuccess();
                !result && this.$toast(this.$t('hint.pwErr'));
            })
                .catch(err => {
                    console.warn(err);
                    if (!this.isLoading) {
                        return;
                    }
                    this.isLoading = false;
                    this.$toast(this.$t('hint.pwErr'));
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.login-wrapper {
    .__btn {
        position: relative;

        &.__btn_input {
            .name {
                width: 89%;
            }
        }
    }

    .bottom {
        margin-bottom: 20px;
    }

    .slide {
        display: inline-block;
        position: absolute;
        top: 50%;
        right: 20px;
        width: 16px;
        height: 16px;
        margin-top: -6px;

        &.down {
            background: url('~assets/imgs/down_icon.svg');
            background-size: 16px 16px;
        }

        &.up {
            background: url('~assets/imgs/up_icon.svg');
            background-size: 16px 16px;
        }
    }

    .btn-list {
        width: 100%;
        text-align: center;

        &.zh {
            height: 20px;
            line-height: 20px;
        }

        .line {
            margin: 0 33px;
            display: inline-block;
            width: 1px;
            height: 100%;
            background: #e5edf3;
            opacity: 0.3;
            margin-bottom: -4px;
        }

        .__btn_link.en:first-child {
            display: block;
            margin-bottom: 10px;
        }
    }

    .switch-btn {
        display: inline-block;
        margin-bottom: 20px;
        border-radius: 16px;
        background: #007aff;
        box-shadow: 0 0 4px 0 rgba(0, 105, 219, 1);
        padding-left: 12px;

        &.radius {
            padding-left: 0;
            padding-right: 12px;
        }

        .btn-item {
            display: inline-block;
            color: #fff;
            font-size: 14px;
            font-family: $font-bold, arial, sans-serif;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
            line-height: 18px;

            &.active {
                background: rgba(51, 187, 255, 1);
                border-radius: 16px;
                padding: 6px 12px;
                box-shadow: 0 0 4px 0 rgba(0, 105, 219, 1);
            }
        }
    }
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";

.__btn_input_active {
    border: 1px solid #d4dee7;
    padding: 8px 40px 8px 20px;
    text-align: left;

    .name {
        font-family: $font-bold, arial, sans-serif;
        font-size: 14px;
        color: #333;
        line-height: 20px;
    }

    .address {
        font-family: $font-normal-b, arial, sans-serif;
        font-size: 12px;
        line-height: 20px;
        color: #333;
    }

    background: #fff;
}
</style>
