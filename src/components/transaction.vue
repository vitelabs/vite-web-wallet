<template>
    <div class="transaction-wrapper">
        <div class="title">{{ $t('accDetail.transfer') }}</div>

        <div class="content-wrapper">
            <div class="row">
                <div class="row-t">{{ $t('accDetail.balance') }}</div>
                <div class="__balance" v-show="!balanceInfos.length">0</div>
                <div v-show="balanceInfos.length" v-for="(balanceInfo, i) in balanceInfos" :key="i">
                    <span class="__balance">{{ balanceInfo.balance }}</span>
                    <span class="__symbol">{{ balanceInfo.tokenSymbol }}</span>
                </div>
            </div>
            <div class="row">
                <div class="row-t">{{ $t('accDetail.outAddress') }}</div>
                <div class="__btn_text __ellipsis out-address">{{ outAddress }}</div>
            </div>
            
            <div class="row">
                <div class="row-t">{{ $t('accDetail.inAddress') }}</div>
                <div class="row-content">
                    <span class="__btn_text __ellipsis __input" :class="{
                        'active': inputItem === 'inAddr' || !!inAddress
                    }">
                        <input ref="inAddr" v-model="inAddress"
                               @focus="inputFocus('inAddr')"
                               @blur="inputBlur('inAddr')"/>
                    </span>
                    <span v-show="!isValidAddress" class="err">
                        <img class="icon" src="../assets/imgs/error_icon.svg"/> {{ $t('transList.valid.addr')}}
                    </span>
                </div>
            </div>

            <div class="row">
                <div class="row-t">{{ $t('accDetail.sum') }}</div>
                <div class="row-content">
                    <span class="__btn_text __ellipsis __input" :class="{ 
                        'active': inputItem === 'amount' || !!amount
                    }">
                        <input @focus="inputFocus('amount')" v-model="amount"
                               @blur="inputBlur('amount')" class="amount"  />VITE
                    </span>
                    <span v-show="amountErr" class="err">
                        <img class="icon" src="../assets/imgs/error_icon.svg"/>{{ amountErr }}
                    </span>
                </div>
            </div>

            <div class="row">
                <div class="row-t">{{ $t('accDetail.password') }}</div>
                <div class="row-content">
                    <span class="__btn_text __ellipsis __input" :class="{ 
                        'active': inputItem === 'pass' || !!password
                    }">
                        <input @focus="inputFocus('pass')" v-model="password"
                               @blur="inputBlur('pass')"  type="password" />
                    </span>
                    <span v-show="passwordErr" class="err">
                        <img class="icon" src="../assets/imgs/error_icon.svg"/>{{ passwordErr }}
                    </span>
                </div>
            </div>

            <div class="btn __pointer" :class="{
                'unuse': loading || amountErr || !isValidAddress || passwordErr
            }" @click="transfer">{{ $t('accDetail.transfer') }}</div>
        </div>
    </div>
</template>

<script>
import bigNumber from 'utils/bigNumber.js';
import Vue from 'vue';

const TOKEN_ID = 'tti_000000000000000000004cfd';    // vite id

let inAddrTimeout = null;
let amountTimeout = null;

export default {
    mounted() {
        Vue.nextTick(()=>{
            this.$refs.inAddr && this.$refs.inAddr.focus();
        });
        window.document.onkeydown = (e) => {
            e = e || window.event;
            let code = e.keyCode || e.which;
            if (!code || code !== 13) {
                return;
            }
            this.transfer();
        };
        this.fetchAccount();
    },
    destroyed() {
        window.document.onkeydown = null;
    },
    data() {
        return {
            outAddress: this.$route.params.address,
            inAddress: '',
            amount: '',
            password: '',
            balanceInfos: [],

            isValidAddress: true,
            amountErr: '',
            passwordErr: '',

            inputItem: '',
            loading: false
        };
    },
    watch: {
        inAddress: function() {
            clearTimeout(inAddrTimeout);
            inAddrTimeout = null;

            inAddrTimeout = setTimeout(async ()=> {
                inAddrTimeout = null;
                
                if (!this.inAddress) {
                    this.isValidAddress = false;
                    return;
                }

                try {
                    this.isValidAddress = await viteWallet.Types.isValidAddress(this.inAddress);
                } catch(err) {
                    console.warn(err);
                    this.isValidAddress = false;
                }
            }, 500);
        },
        password: function() {
            this.password && (this.passwordErr = '');
            !this.password && (this.passwordErr = this.$t('transList.valid.pswd'));
        },
        amount: function() {
            clearTimeout(amountTimeout);
            amountTimeout = null;

            amountTimeout = setTimeout(async ()=> {
                amountTimeout = null;
                let result = this.testAmount();
                if (!result || bigNumber.isEqual(this.amount, 0)) {
                    this.amountErr = this.$t('transList.valid.amt');
                    return;
                }

                this.amountErr = '';
            }, 500);
        }
    },
    methods: {
        inputFocus(text) {
            this.inputItem = text;
        },
        inputBlur(text) {
            text === this.inputItem && (this.inputItem = '');
        },
        testAmount() {
            return /(^(\d+)$)|(^(\d+[.]\d{1,8})$)/g.test(this.amount);
        },

        fetchAccount() {
            viteWallet.Account.get(this.outAddress).then(({
                balanceInfos
            }) => {
                balanceInfos = balanceInfos || [];
                let list = [];

                balanceInfos.forEach(({ Balance, TokenSymbol })=>{
                    list.push({
                        balance: Balance ? bigNumber.amountToBasicString(Balance) || 0 : 0,
                        tokenSymbol: TokenSymbol
                    });
                });

                this.balanceInfos = list;
            }).catch((err) => {
                console.warn(err);
                window.alert( this.$t('transList.valid.err') );
            });
        },
        transfer() {
            if (this.loading) {
                return;
            }

            if (!this.inAddress) {
                this.isValidAddress = false;
            }
            if (!this.testAmount()) {
                this.amountErr = this.$t('transList.valid.amt');
            }
            if (!this.password) {
                this.passwordErr = this.$t('transList.valid.pswd');
            }
            if (this.amountErr || !this.isValidAddress || this.passwordErr) {
                return;
            }

            this.loading = true;
            let amount = bigNumber.amountToMinString(this.amount);
            viteWallet.Block.createTX({
                selfAddr: this.outAddress, 
                toAddr: this.inAddress,
                pass: this.password,
                tokenId: TOKEN_ID,    // fixed viteToken
                amount
            }).then(() => {
                this.loading = false;
                window.alert(this.$t('transList.valid.succ'));

                this.$router.push({
                    name: 'account',
                    params: {
                        address: this.outAddress
                    }
                });
            }).catch((err) => {
                console.warn(err);
                this.loading = false;

                if (err && err.code && err.code === 4001) {
                    this.passwordErr = this.$t('transList.valid.pswd');
                    return;
                } else if (err && err.code && err.code === 5001) {
                    this.amountErr = this.$t('transList.valid.bal');
                    return;
                }

                window.alert(err && err.message? err.message : this.$t('transList.valid.err'));
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.transaction-wrapper {
    position: relative;
    box-sizing: border-box;
    padding: 92px 30px 30px 30px;
    height: 100%;
    .content-wrapper {
        padding: 0px 30px;
        height: 100%;
        overflow: auto;
        background: #FFFFFF;
        box-shadow: 0 2px 48px 1px rgba(176,192,237,0.17);
        border-radius: 8px;
        .row {
            padding-top: 20px;
            .err {
                font-size: 12px;
                color: #FF2929;
                line-height: 16px;
                .icon {
                    width: 20px;
                    height: 20px;
                    margin: 0 5px -5px 10px;
                }
            }
        }
    }
    .row-t {
        font-size: 14px;
        color: #1D2024;
        line-height: 16px;
        padding-bottom: 12px;
        font-family: $font-bold;
    }
    .row-content {
        display: flex;
        align-items: center;
    }
    .__btn_text {
        max-width: 100%;
        display: inline-block;
        box-sizing: border-box;
        background: #F3F6F9;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        height: 36px;
        line-height: 36px;
        padding: 0 15px;
        opacity: 0.3;
        color: #5E6875;
    }
    &.out-address {
        min-width: 300px;
    }
    .__input {
        width: 300px;
        display: flex;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        input {
            flex: 1;
            background: #F3F6F9;
            height: 36px;
            line-height: 36px;
            opacity: 0.3;
            color: #5E6875;
            &.amount {
                margin-right: 10px;
            }
        }
        &.out-address {
            min-width: 300px;
        }
        &.active {
            opacity: 1;
            input {
                opacity: 1;
            }
        }
    }
    .btn {
        width: 300px;
        height: 36px;
        margin-bottom: 20px;
        line-height: 36px;
        background: #195BDD;
        border-radius: 4px;
        text-align: center;
        font-size: 14px;
        color: #FFFFFF;
        margin-top: 30px;
        font-family: $font-bold;
        &.unuse {
            background: #efefef;
            color: #666;
        }
    }
}

.__balance {
    font-size: 48px;
    color: #1D2024;
    line-height: 48px;
    font-family: $font-H;
}
.__symbol {
    position: relative;
    top: -20px;
    margin-left: 15px;
    font-size: 14px;
    color: #3A3C43;
    line-height: 16px;
    font-family: $font-H-bolder;
}

.title {
    position: absolute;
    top: 30px;
    left: 30px;
    font-size: 24px;
    color: #272727;
    line-height: 32px;
    font-family: $font-bold;
}
</style>
