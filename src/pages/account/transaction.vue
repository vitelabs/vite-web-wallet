<template>
    <div class="trans-wrapper">
        <confirm v-show="isShowTrans" class="trans-confirm"
                 :title="$t('accDetail.transfer')"
                 :btnUnuse="unTrans"
                 :closeIcon="true" :close="closeTrans" :singleBtn="true" 
                 :leftBtnClick="validTrans" :leftBtnTxt="$t('accDetail.transfer')" >
            <div class="row">
                <div class="row-t">{{ $t('accDetail.balance') }}</div>
                <div class="row-content balance">
                    {{ token.symbol }} <span>{{ showAccBalance }}</span>
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.inAddress') }}
                    <span v-show="!isValidAddress" class="err hint">{{ $t('transList.valid.addr') }}</span>
                </div>
                <div class="row-content">
                    <input ref="inAddr" v-model="inAddress" :placeholder="$t('accDetail.placeholder.addr')" />
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.sum') }}
                    <span v-show="amountErr" class="err hint">{{ amountErr }}</span>
                </div>
                <div class="row-content __btn_text __input">
                    <input v-model="amount" :placeholder="$t('accDetail.placeholder.amount')"  />
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('accDetail.remarks')}}
                    <span class="hint" :class="{ err: messageErr }">
                        {{ $t('accDetail.valid.remarksLong', { len: msgBalance}) }}
                    </span>
                </div>
                <div class="row-content">
                    <input v-model="message" :placeholder="$t('accDetail.placeholder.remarks')" autocomplete="off" />
                </div>
            </div>
        </confirm>

        <pow-process ref="powProcess" :isShowCancel="true" :cancel="closeTrans"></pow-process>
    </div>
</template>

<script>
import Vue from 'vue';
import confirm from 'components/confirm';
import powProcess from 'components/powProcess';

let inAddrTimeout = null;
let amountTimeout = null;
let messageTimeout = null;

export default {
    components: {
        powProcess, confirm
    },
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
        
        this.$onEnterKey(() => {
            this.validTrans();
        });
    },
    destroyed() {
        clearTimeout(amountTimeout);
        clearTimeout(inAddrTimeout);
        clearTimeout(messageTimeout);
    },
    data() {
        return {
            inAddress: '',
            amount: '',
            message: '',

            isValidAddress: true,
            amountErr: '',

            isShowTrans: true,
            loading: false
        };
    },
    computed: {
        unTrans() {
            return !!(!this.amount || !this.inAddress || this.loading || this.amountErr || !this.isValidAddress || this.messageErr);
        },
        accBalance() {
            if (!this.tokenBalList || !this.tokenBalList[this.token.id]) {
                return 0;
            }
            let balance = this.tokenBalList[this.token.id].totalAmount;
            return balance;
        },
        showAccBalance() {
            return viteWallet.BigNumber.toBasic(this.accBalance, this.token.decimals);
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        msgBalance() {
            let message = this.$trim(this.message);
            let length = viteWallet.utils.getBytesSize(message);
            return 120 - length;
        },
        messageErr() {
            return this.msgBalance < 0;
        }
    },
    watch: {
        inAddress: function() {
            clearTimeout(inAddrTimeout);
            inAddrTimeout = null;

            inAddrTimeout = setTimeout(()=> {
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
        amount: function() {
            clearTimeout(amountTimeout);
            amountTimeout = null;

            amountTimeout = setTimeout(()=> {
                amountTimeout = null;
                this.testAmount();
            }, 500);
        },
    },
    methods: {
        showQuota() {
            this.isShowTrans = false;
            this.$confirm({
                showMask: false,
                title: this.$t('accDetail.quota.title'),
                closeBtn: {
                    show: true,
                    click: () => {
                        this.isShowTrans = true;
                    }
                },
                leftBtn: {
                    text: this.$t('accDetail.quota.left'),
                    click: () => {
                        this.startPow();
                    }
                },
                rightBtn: {
                    text: this.$t('accDetail.quota.right'),
                    click: () => {
                        this.$router.push({
                            name: 'quota'
                        });
                    }
                },
                content: this.$t('accDetail.quota.describe')
            });
        },

        testAmount() {
            let result = this.$validAmount(this.amount);
            
            if (!result) {
                this.amountErr = this.$t('transList.valid.amt');
                return false;
            }

            if (viteWallet.BigNumber.isEqual(this.amount, 0)) {
                this.amountErr = this.$t('accDetail.hint.amount');
                return false;
            }

            let amount = viteWallet.BigNumber.toMin(this.amount, this.token.decimals);
            if (viteWallet.BigNumber.compared(this.accBalance, amount) < 0) {
                this.amountErr = this.$t('transList.valid.bal');
                return false;
            }

            this.amountErr = '';
            return true;
        },

        validTrans() {
            if (this.loading) {
                return;
            }

            if (!this.inAddress) {
                this.isValidAddress = false;
            }
            if (this.amountErr || this.messageErr || !this.isValidAddress || !this.testAmount()) {
                return;
            }

            let activeAccount = this.$wallet.getActiveAccount();
            let isHold = activeAccount.initPwd({
                showMask: false,
                submit: () => {
                    this.isShowTrans = true;
                    this.transfer();
                },
                cancel: () => {
                    this.isShowTrans = true;
                }
            }); 
            !isHold && (this.isShowTrans = false);
        },

        transfer() {
            if (!viteWallet.Net.getNetStatus()) {
                this.$toast(this.$t('nav.noNet'));
                return;
            }
            
            this.loading = true;
            let amount =  viteWallet.BigNumber.toMin(this.amount, this.token.decimals);

            let successText = this.$t('transList.valid.succ');
            let failText = this.$t('hint.err');
            
            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast(this.$t('hint.err'));
                return;
            }
            activeAccount.sendTx({
                toAddr: this.inAddress,
                tokenId: this.token.id,
                amount,
                message: this.message
            }).then(() => {
                if (!this) {
                    this.$toast(successText);
                    return;
                }
                this.transSuccess();
            }).catch((err) => {
                console.warn(err);

                if (!this) {
                    this.$toast(failText);
                    return;
                }
                
                this.loading = false;
                let code  = err && err.error ? err.error.code || -1 : 
                    err ? err.code : -1;
                let message  = err && err.message ? err.message : 
                    err.error ? err.error.message || '' : '';

                if (code === -35001) {
                    this.$toast(this.$t('transList.valid.bal'));
                    this.amountErr = this.$t('transList.valid.bal');
                    return;
                } else if (code === -35002) {
                    this.showQuota();
                    return;
                }

                this.$toast(message || this.$t('hint.err'));
            });
        },
        startPow() {
            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast(this.$t('hint.err'));
                return;
            }

            let transError = (errMsg) => {
                this.loading = false;
                this.isShowTrans = true;
                this.$toast(errMsg || this.$t('accDetail.trans.err'));
            };

            this.loading = true;
            let amount =  viteWallet.BigNumber.toMin(this.amount, this.token.decimals);

            this.$refs.powProcess && this.$refs.powProcess.startPowTx({
                toAddr: this.inAddress, 
                amount,
                tokenId: this.token.id,
                message: this.message
            }, 'sendBlock').then(() => {
                this.transSuccess();
            }).catch((err, type) => {
                console.warn(type, err);

                if (type === 0) {
                    transError( this.$t('accDetail.trans.powErr') );
                    return;
                }

                let code  = err && err.error ? err.error.code || -1 : 
                    err ? err.code : -1;
                if (code === -35002) {
                    transError(this.$t('accDetail.trans.powTransErr'));
                    return;
                }
                transError();
            });
        },

        transSuccess() {
            this.loading = false;
            this.$toast(this.$t('transList.valid.succ'));
            this.closeTrans();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.trans-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
}

.row {
    margin-top: 20px;
    &:first-child {
        margin-top: 0;
    }
    .row-t {
        position: relative;
        font-family: $font-bold;
        font-size: 14px;
        color: #1D2024;
        letter-spacing: 0.35px;
        line-height: 16px;
        padding-bottom: 15px;
    }
    .balance {
        background: rgba(243,246,249,1);
    }
    .row-content {
        padding: 9px 15px;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
        line-height: normal;
        &.balance span {
            float: right;
        }
        input {
            width: 100%;
        }
    }
    .hint {
        position: absolute;
        left: 90px;
        right: 0;
        font-size: 12px;
        line-height: 16px;
        text-align: right;
    }
    .err {
        color: #FF2929;
    }
}
</style>

<style lang="scss">
.confirm-container.trans-confirm .confirm-wrapper {
    width: 515px;
    max-width: 90%;
}
.confirm-container.trans-confirm .confirm-wrapper .bottom {
    min-height: 70px;
    .__btn{
        height: 40px;
        line-height: 40px;
    }
}
</style>
