<template>
    <div class="login-wrapper">
        <div class="__title">登录账户</div>

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

        <div class="bottom __btn __pointer __btn_all_in" @click="login">{{ $t('btn.login') }}</div>

        <div class="bottom btn-list">
            <router-link class="__btn_link" :to="{ 
                name: 'importAccount',
                params: { from: 'login' }
            }">{{ $t('btn.imported') }}</router-link>
            <span class="line"></span>
            <router-link class="__btn_link" :to="{ name: 'restore' }">助记词恢复账户</router-link>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import accountList from './accountList.vue';
import ellipsisAddr from 'utils/ellipsisAddr.js';

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

            accountList: [],
            isShowAccountList: false,
            inputItem: ''
        };
    },
    methods: {
        getLoginAcc() {
            let entropy = this.$route.params.entropy;
            if (entropy) {
                let acc = viteWallet.Wallet.getAccFromEntropy(entropy);
                if (acc) {
                    return acc;
                }
            }

            let addr = this.$route.params.addr;
            if (addr) {
                let acc = viteWallet.Wallet.getAccFromAddr(addr);
                if (acc) {
                    acc.showAddr = ellipsisAddr(acc.addr);
                    return acc;
                }
            }

            let account = viteWallet.Wallet.getLast();
            if (account) {
                let addr = !account.isWalletAcc ? account.getDefaultAddr() : '';
                let showAddr = addr ? ellipsisAddr(addr) : '';
                return {
                    name: account.getName() || '',
                    addr,
                    showAddr,
                    entropy: account.entropy || ''
                };
            }
            
            let list = viteWallet.Wallet.getList();
            if(!list || !list.length) {
                this.$router.push({
                    name: 'index'
                });
                return;
            }

            return list[0];
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
                window.alert(this.$t('create.input'));
                this.focusPass();
                return;
            }

            let loginSuccess = () => {
                viteWallet.Wallet.setLast(this.activeAccount);
                this.password = '';
                this.$router.push({
                    name: 'account',
                    params: {
                        addr: this.activeAccount.addr || '',
                        entropy: this.activeAccount.entropy || ''
                    }
                });
            };

            // unlock addr pass
            loginSuccess();
        }
    }
};
</script>

<style lang="scss" scoped>
.login-wrapper {
    .__btn {
        position: relative;
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
            display: inline-block;
            margin: 0 33px; 
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
