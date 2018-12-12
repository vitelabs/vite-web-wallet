<template>
    <div class="trans-wrapper">
        <confirm v-show="isShowTrans" class="trans-confirm"
                 :title="$t('account.transfer')"
                 :btnUnuse="unTrans"
                 :closeIcon="true" :close="closeTrans" :singleBtn="true" 
                 :leftBtnClick="validTrans" :leftBtnTxt="$t('account.transfer')" >

            <div class="row">
                <div class="row-t">{{ $t('account.balance') }}</div>
                <div class="balance">
                    <img v-if="token.icon" :src="token.icon" class="icon" />
                    {{ token.symbol }} <span>{{ showAccBalance }}</span>
                </div>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('account.inAddress') }}
                    <span v-show="!isValidAddress" class="err hint">{{ $t('transList.valid.addr') }}</span>
                </div>
                <vite-input v-model="inAddress" :valid="validAddr"
                            :placeholder="$t('account.placeholder.addr')"></vite-input>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('account.sum') }}
                    <span v-show="amountErr" class="err hint">{{ amountErr }}</span>
                </div>
                <vite-input v-model="amount" :valid="testAmount"
                            :placeholder="$t('account.placeholder.amount')"></vite-input>
            </div>

            <div class="row">
                <div class="row-t">
                    {{ $t('account.remarks')}}
                    <span class="hint" :class="{ err: messageErr }">
                        {{ $t('account.valid.remarksLong', { len: msgBalance}) }}
                    </span>
                </div>
                <vite-input v-model="message" :placeholder="$t('account.placeholder.remarks')"></vite-input>
            </div>
        </confirm>

        <pow-process ref="powProcess" :isShowCancel="true" :cancel="closeTrans"></pow-process>
    </div>
</template>

<script>
import Vue from 'vue';
import confirm from 'components/confirm';
import powProcess from 'components/powProcess';
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';
import { encoder, address } from 'utils/tools';

export default {
    components: {
        powProcess, confirm, viteInput
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
            return BigNumber.toBasic(this.accBalance, this.token.decimals);
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        msgBalance() {
            let message = this.$trim(this.message);
            let length = encoder.getBytesSize(message);
            return 120 - length;
        },
        messageErr() {
            return this.msgBalance < 0;
        }
    },
    methods: {
        validAddr() {
            this.isValidAddress = this.inAddress && address.isValidHexAddr(this.inAddress);
        },
        showQuota(accountBlock, startTime) {
            this.isShowTrans = false;
            this.$confirm({
                showMask: false,
                title: this.$t('account.quota.title'),
                closeBtn: {
                    show: true,
                    click: () => {
                        this.isShowTrans = true;
                    }
                },
                leftBtn: {
                    text: this.$t('account.quota.left'),
                    click: () => {
                        this.$router.push({
                            name: 'quota'
                        });
                    }
                },
                rightBtn: {
                    text: this.$t('account.quota.right'),
                    click: () => {
                        this.startPow(accountBlock, startTime);
                    }
                },
                content: this.$t('account.quota.describe')
            });
        },

        testAmount() {
            let result = this.$validAmount(this.amount);
            
            if (!result) {
                this.amountErr = this.$t('transList.valid.amt');
                return false;
            }

            if (BigNumber.isEqual(this.amount, 0)) {
                this.amountErr = this.$t('account.hint.amount');
                return false;
            }

            let amount = BigNumber.toMin(this.amount, this.token.decimals);
            if (BigNumber.compared(this.accBalance, amount) < 0) {
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
            let amount =  BigNumber.toMin(this.amount, this.token.decimals);

            let successText = this.$t('transList.valid.succ');
            let failText = this.$t('hint.err');
            
            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast(this.$t('hint.err'));
                return;
            }
            
            activeAccount.sendTx({
                toAddress: this.inAddress,
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

                if (code === -35001) {
                    this.$toast(this.$t('transList.valid.bal'));
                    this.amountErr = this.$t('transList.valid.bal');
                    return;
                } else if (code === -35002) {
                    this.showQuota(err.accountBlock, new Date().getTime());
                    return;
                }

                this.$toast(null, err);
            });
        },
        startPow(accountBlock, startTime) {
            let activeAccount = this.$wallet.getActiveAccount();
            if (!activeAccount) {
                this.$toast(this.$t('hint.err'));
                return;
            }

            let transError = (err) => {
                this.loading = false;
                this.isShowTrans = true;
                this.$toast(null, err);
            };

            this.loading = true;
            this.$refs.powProcess && this.$refs.powProcess.startPowTx(accountBlock, startTime).then(() => {
                this.transSuccess();
            }).catch((err, type) => {
                console.warn(type, err);

                if (type === 0) {
                    transError( this.$t('account.trans.powErr') );
                    return;
                }

                let code  = err && err.error ? err.error.code || -1 : 
                    err ? err.code : -1;
                if (code === -35002) {
                    transError(this.$t('account.trans.powTransErr'));
                    return;
                }
                transError(err);
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
        padding: 9px 15px;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
        line-height: normal;
        background: rgba(243,246,249,1);
        span {
            float: right;
            color: rgba(0,122,255,1);
        }
        .icon {
            margin-bottom: -4px;
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
