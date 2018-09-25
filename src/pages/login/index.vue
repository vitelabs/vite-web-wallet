<template>
    <div class="login-wrapper">
        <div class="__title">{{$t('nav.head.login')}}</div>

        <div class="bottom __btn __pointer">
            <div @click="toggleAccountList">
                <div v-show="!activeAccount" class="__btn_input">{{ $t('create.choose') }}</div>

                <div v-show="activeAccount && !activeAccount.addr" class="__btn __btn_input">
                    <div class="name __ellipsis">{{activeAccount.name}}</div>
                </div>

                <div v-show="activeAccount && activeAccount.addr" class="__btn __btn_input_active">
                    <div class="name __ellipsis">{{activeAccount.name}}</div>
                    <div class="address __ellipsis">{{activeAccount.showAddr}}</div>
                </div>

                <span :class="{ 
                    'slide': true,
                    'down': !isShowAccountList,
                    'up': isShowAccountList
                }"></span>
            </div>
            
            <account-list v-show="isShowAccountList" 
                          :accountList="accountList"
                          :clickAccount="chooseAccount"></account-list>
        </div>

        <div class="bottom __btn __btn_input" 
             :class="{ 'active': !!password || inputItem === 'pass' }">
            <input ref="passInput" autofocus :placeholder="$t('create.input')" 
                   v-model="password" :type="'password'"
                   @focus="inputFocus('pass')" @blur="inputBlur('pass')" />
        </div>

        <div class="bottom __btn __pointer __btn_all_in" :class="{
            'disable': isLoading
        }" @click="login">{{ $t('btn.login') + (isLoading ? ' ...' : '') }}</div>

        <div class="bottom btn-list">
            <router-link class="__btn_link" :to="{ 
                name: 'importAccount',
                params: { from: 'login' }
            }">{{ $t('btn.imported') }}</router-link>
            <span class="line" :class="{
                'zh': $t('lang') === '中文'
            }"></span>
            <router-link class="__btn_link" :to="{ name: 'restore' }">{{$t('mnemonic.restore')}}</router-link>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import accountList from './accountList.vue';
import ellipsisAddr from 'utils/ellipsisAddr.js';
import toast from 'utils/toast/index.js';

export default {
    components: {
        accountList
    },
    mounted() {
        this.activeAccount = this.getLoginAcc();
    },
    data() {
        return {
            activeAccount: {},
            password: '',
            isLoading: false,
            accountList: [],
            isShowAccountList: false,
            inputItem: ''
        };
    },
    methods: {
        getLoginAcc() {
            let account = viteWallet.Wallet.getLast();
            if (account) {
                let addr = account.addr || '';
                let showAddr = account.addr ? ellipsisAddr(account.addr) : '';
                return {
                    name: account.name || '',
                    addr,
                    showAddr,
                    entropy: account.entropy || ''
                };
            }
            
            let list = viteWallet.Wallet.getList();
            if (!list || !list.length) {
                this.$router.push({
                    name: 'index'
                });
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
            Vue.nextTick(()=>{
                this.$refs.passInput && this.$refs.passInput.focus();
            });
        },

        chooseAccount(account) {
            this.activeAccount = account;
            this.isShowAccountList = false;
        },
        toggleAccountList() {
            this.isShowAccountList = !this.isShowAccountList;
        },

        login() {
            if (!this.activeAccount) {
                return;
            }

            if (!this.password) {
                toast(this.$t('create.input'), 'error');
                this.focusPass();
                return;
            }

            let loginSuccess = () => {
                this.password = '';
                this.$router.push({
                    name: 'account',
                    params: {
                        addr: this.activeAccount.addr || '',
                        entropy: this.activeAccount.entropy || ''
                    }
                });
            };

            this.isLoading = true;
            setTimeout(()=>{
                let result = viteWallet.Wallet.login(this.activeAccount, this.password);
                this.isLoading = false;
                result && loginSuccess();
                !result && toast(this.$t('hint.pwErr'), 'error');
            }, 0);

        }
    }
};
</script>

<style lang="scss" scoped>
.login-wrapper {
    .__btn {
        position: relative;
        &.disable {
            background: #bfbfbf;
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
            background: url('../../assets/imgs/down_icon.svg');
            background-size: 16px 16px;
        }
        &.up {
            background: url('../../assets/imgs/up_icon.svg');
            background-size: 16px 16px;
        }
    }

    .btn-list {
        width: 100%;
        height: 20px;
        text-align: center;
        line-height: 20px;
        .line {
            &.zh {
                margin: 0 33px;
            }
            display: inline-block;
            width: 1px;
            height: 100%;
            background: #E5EDF3;
            opacity: 0.3;
            margin-bottom: -4px;
        }
    }
}
</style>

<style lang="scss">
@import "~assets/scss/vars.scss";
.__btn_input_active {
    border: 1px solid #D4DEE7;
    padding: 8px 40px 8px 20px;
    text-align: left;
    .name {
        font-family: $font-bold;
        font-size: 14px;
        color: #333333;
        line-height: 20px;
    }
    .address {
        font-family: $font-normal-b;
        font-size: 12px;
        line-height: 20px;
        color: #333333;
    }
    background: #fff;
}
</style>
