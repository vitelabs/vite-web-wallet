<template>
    <div class="transaction-wrapper">
        <div class="title">
            {{ $t('accDetail.transfer') }}
            <img class="close __pointer" @click="_closeTrans" src="../../assets/imgs/close.svg"/>
        </div>

        <div class="content-wrapper">
            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.inAddress') }}
                    <span v-show="!isValidAddress" class="err">{{ $t('transList.valid.addr') }}</span>
                </div>
                <div class="row-content">
                    <input ref="inAddr" v-model="inAddress" :placeholder="$t('accDetail.placeholder.addr')" />
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.sum') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <div class="row-content __btn_text __input">
                    <input v-model="amount" :placeholder="$t('accDetail.placeholder.amount')"  />
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.remarks')}}
                    <span v-show="messageErr" class="err">{{ $t('accDetail.valid.remarksFormat') }}</span>
                </div>
                <div class="row-content">
                    <input v-model="message" :placeholder="$t('accDetail.placeholder.remarks')"  />
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.password') }}
                    <span v-show="passwordErr" class="err">{{ passwordErr }}</span>
                </div>
                <div class="row-content">
                    <input v-model="password" type="password" :placeholder="$t('create.input')"  />
                </div>
            </div>

            <div class="btn __pointer" :class="{
                'unuse': loading || amountErr || !isValidAddress || passwordErr
            }" @click="validTrans">{{ $t('accDetail.transfer') }}</div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import toast from 'utils/toast/index.js';

let inAddrTimeout = null;
let amountTimeout = null;

export default {
    props: {
        token: {
            type: Object,
            default: () => {
                return {};
            }
        },
        closeTrans: {
            type: Function,
            default: ()=>{}
        }
    },
    mounted() {
        Vue.nextTick(()=>{
            this.$refs.inAddr && this.$refs.inAddr.focus();
        });
    },
    data() {
        return {
            inAddress: '',
            amount: '',
            password: '',
            message: '',

            isValidAddress: true,
            amountErr: '',
            passwordErr: '',
            messageErr: '',

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
                    this.isValidAddress = viteWallet.Types.isValidHexAddr(this.inAddress);
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
                if (!result || viteWallet.BigNumber.isEqual(this.amount, 0)) {
                    this.amountErr = this.$t('transList.valid.amt');
                    return;
                }

                this.amountErr = '';
            }, 500);
        }
    },
    methods: {
        testAmount() {
            return /(^(\d+)$)|(^(\d+[.]\d{1,8})$)/g.test(this.amount);
        },

        validTrans() {
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

            this.transfer();
        },

        transfer() {
            let activeAccount = viteWallet.Wallet.getActiveAccount();
            if (!activeAccount) {
                toast(this.$t('transList.valid.err'));
            }

            this.loading = true;
            let amount =  viteWallet.BigNumber.toMin(this.amount, this.token.decimals);

            activeAccount.sendTx({
                toAddr: this.inAddress,
                pass: this.password,
                tokenId: this.token.id,
                amount
            }).then(() => {
                this.loading = false;
                toast(this.$t('transList.valid.succ'));
                this._closeTrans();
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

                toast(err && err.message? err.message : this.$t('transList.valid.err'));
            });
        },
        _closeTrans() {
            this.amount = '';
            this.inAddress = '';
            this.password = '';
            this.message = '';
            this.isValidAddress = true;
            this.amountErr = '';
            this.passwordErr = '';
            this.messageErr = '';
            this.closeTrans();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.transaction-wrapper {
    width: 515px;
    background: #fff;
    box-shadow: 0 2px 48px 1px rgba(176,192,237,0.42);
    border-radius: 2px;
}

.title {
    line-height: 32px;
    font-family: $font-bold;
    background: #268EFF;
    font-size: 16px;
    color: #FFFFFF;
    height: 60px;
    line-height: 60px;
    text-indent: 30px;
    margin-bottom: 5px;
    .close {
        float: right;
        padding: 20px 30px;
    }
}

.content-wrapper {
    padding: 0px 30px 30px;
    .row {
        margin-top: 20px;
        .row-t {
            font-family: $font-bold;
            font-size: 14px;
            color: #1D2024;
            letter-spacing: 0.35px;
            line-height: 16px;
            padding-bottom: 15px;
        }
        .row-content {
            padding: 10px 15px;
            border: 1px solid #D4DEE7;
            border-radius: 2px;
            font-size: 14px;
            input {
                width: 100%;
            }
        }
        .err {
            float: right;
            font-size: 12px;
            color: #FF2929;
            line-height: 16px;
        }
    }

    .btn {
        height: 44px;
        line-height: 44px;
        background: #007AFF;
        border-radius: 2px;
        text-align: center;
        color: #FFFFFF;
        margin-top: 30px;
        font-family: $font-bold;
        font-size: 16px;
        &.unuse {
            background: #efefef;
            color: #666;
        }
    }
}
</style>
