<template>
    <div class="__trans-wrapper">
        <confirm v-show="isShowTrans" class="trans-confirm"
                 :title="$t('wallet.transfer')"
                 :btnUnuse="unTrans"
                 :closeIcon="true" :close="closeTrans" :singleBtn="true" 
                 :leftBtnClick="validTrans" :leftBtnTxt="$t('wallet.transfer')" >

            <div class="__row">
                <div class="__row-t">{{ $t('balance') }}</div>
                <div class="__unuse-row">
                    <img v-if="token.icon" :src="token.icon" class="__icon" />
                    {{ token.symbol }} <span class="__right">{{ showAccBalance }}</span>
                </div>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('wallet.inAddress') }}
                    <span v-show="!isValidAddress" class="__err __hint">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="inAddress" :valid="validAddr"
                            :placeholder="$t('wallet.placeholder.addr')"></vite-input>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('wallet.sum') }}
                    <span v-show="amountErr" class="__err __hint">{{ amountErr }}</span>
                </div>
                <vite-input v-model="amount" :valid="testAmount"
                            :placeholder="$t('wallet.placeholder.amount')"></vite-input>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('wallet.remarks')}}
                    <span class="__hint" :class="{ err: messageErr }">
                        {{ $t('wallet.remarksLong', { len: msgBalance}) }}
                    </span>
                </div>
                <vite-input v-model="message" :placeholder="$t('wallet.placeholder.remarks')"></vite-input>
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

const SendDifficulty = '157108864';

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
        
        this.$onKeyDown(13, () => {
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
                title: this.$t('quotaConfirmPoW.title'),
                closeBtn: {
                    show: true,
                    click: () => {
                        this.isShowTrans = true;
                    }
                },
                leftBtn: {
                    text: this.$t('quotaConfirmPoW.leftBtn.text'),
                    click: () => {
                        this.$router.push({
                            name: 'walletQuota'
                        });
                    }
                },
                rightBtn: {
                    text: this.$t('quotaConfirmPoW.rightBtn.text'),
                    click: () => {
                        this.startPow(accountBlock, startTime);
                    }
                },
                content: this.$t('quotaConfirmPoW.content')
            });
        },

        testAmount() {
            let result = this.$validAmount(this.amount, this.token.decimals);
            
            if (!result) {
                this.amountErr = this.$t('hint.amtFormat');
                return false;
            }

            if (BigNumber.isEqual(this.amount, 0)) {
                this.amountErr = this.$t('wallet.hint.amount');
                return false;
            }

            let amount = BigNumber.toMin(this.amount, this.token.decimals);
            if (BigNumber.compared(this.accBalance, amount) < 0) {
                this.amountErr = this.$t('hint.insufficientBalance');
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
                this.$toast(this.$t('hint.noNet'));
                return;
            }
            
            this.loading = true;
            let amount =  BigNumber.toMin(this.amount, this.token.decimals);

            let successText = this.$t('hint.transSucc');
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
                    this.$toast(this.$t('hint.insufficientBalance'));
                    this.amountErr = this.$t('hint.insufficientBalance');
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
            this.$refs.powProcess && this.$refs.powProcess.startPowTx(accountBlock, startTime, SendDifficulty).then(() => {
                this.transSuccess();
            }).catch((err, type) => {
                console.warn(type, err);

                if (type === 0) {
                    transError( this.$t('wallet.trans.powErr') );
                    return;
                }

                let code  = err && err.error ? err.error.code || -1 : 
                    err ? err.code : -1;
                if (code === -35002) {
                    transError(this.$t('wallet.trans.powTransErr'));
                    return;
                }
                transError(err);
            });
        },

        transSuccess() {
            this.loading = false;
            this.$toast(this.$t('hint.transSucc'));
            this.closeTrans();
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";
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
