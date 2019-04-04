<template>
    <div class="__trans-wrapper">
        <confirm class="trans-confirm" v-show="isShowTrans"
                 :title="transType === 'transfer' ? $t('wallet.transfer') : $t('walletConversion.exchange.vite')"
                 :leftBtnTxt="transType === 'transfer' ? $t('wallet.transfer') : $t('walletConversion.exchange.btn')"
                 :closeIcon="true" :btnUnuse="!canTransfer" :close="closeTrans"
                 :singleBtn="true" :leftBtnClick="transfer">

            <div class="__row">
                <div class="__row-t">{{ $t('balance') }}</div>
                <div class="__unuse-row">
                    <img :src="icon" class="__icon" />
                    {{ token.symbol }} <span class="__right">{{ balance }}</span>
                </div>
            </div>

            <div v-show="transType === 'transfer'" class="__row">
                <div class="__row-t">
                    {{ $t('wallet.inAddress') }}
                    <span v-show="!isValidAddress" class="__err __hint">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="toAddress" :valid="validAddr"
                            :placeholder="$t('wallet.placeholder.addr')"></vite-input>
            </div>

            <div v-show="transType === 'transfer'" class="__row">
                <div class="__row-t">
                    {{ $t('wallet.sum') }}
                    <span v-show="amountErr" class="__err __hint">{{ amountErr }}</span>
                </div>
                <vite-input v-model="amount" :valid="testAmount"
                            :placeholder="$t('wallet.placeholder.amount')"></vite-input>
            </div>

            <div v-show="transType === 'exchange'" class="__row">
                <div class="__row-t">{{ $t('walletConversion.exchange.viteAddr') }}</div>
                <div class="__unuse-row __light">{{ viteAddr }}</div>
            </div>

            <div v-show="transType === 'exchange'" class="__row">
                <div class="__row-t">{{ $t('walletConversion.exchange.viteAmount') }}</div>
                <div class="__unuse-row __light">{{ balance }}</div>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('walletConversion.gas') }}
                    <span class="__hint __right">
                        {{ $t('walletConversion.aboutPrice', { amount: gasTotalPrice }) }}
                    </span>
                </div>
                <process :min="minGwei" :max="maxGwei" :default="size" v-on:drag="setSize">
                    <div class="speed">
                        <span class="left">slow</span>
                        <span class="right">fast</span>
                    </div>
                </process>
            </div>
        </confirm>
    </div>
</template>

<script>
import icon from 'assets/imgs/eth_logo.svg';
import BigNumber from 'utils/bigNumber';
import confirm from 'components/confirm';
import viteInput from 'components/viteInput';
import process from 'components/slider';

const minGwei = 3;
const maxGwei = 99;
const defaultGwei = 41;
let estimateTimeout;

export default {
    components: { confirm, viteInput, process },
    props: {
        ethWallet: {
            type: Object,
            default: () => {}
        },
        transType: {
            type: String,
            default: ''
        },
        token: {
            type: Object,
            default: () => {
                return {};
            }
        },
        closeTrans: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.$onKeyDown(13, () => {
            this.transfer();
        });
    },
    data() {
        const activeAccount = this.$wallet.getActiveAccount();
        const viteAddr = activeAccount.getDefaultAddr();

        return {
            icon,
            viteAddr,
            loading: false,
            minGwei,
            maxGwei,
            size: defaultGwei,
            isShowTrans: true,

            gas: 21000,
            toAddress: '',
            amount: '',
            isValidAddress: true,
            amountErr: ''
        };
    },
    computed: {
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        canEstimate() {
            return this.toAddress && this.isValidAddress && this.amount && !this.amountErr && !this.loading;
        },
        transactionType() {
            if (this.transType === 'exchange') {
                return 'conversion';
            }

            return this.token.name === 'eth' ? 'sendTx' : 'sendContractTx';
        },
        balance() {
            const decimals = this.token.decimals;
            const balance = this.token.balance;

            return +balance ? BigNumber.toBasic(balance, decimals) : 0;
        },
        canTransfer() {
            return !this.loading && (
                this.transType === 'exchange'
                || (this.toAddress && this.amount && this.isValidAddress && !this.amountErr)
            );
        },
        gasTotalPrice() {
            const gwei = this.size * this.gas;
            const decimals = this.ethWallet.utils.unitMap.gwei.length - 1;

            return BigNumber.toBasic(gwei, decimals);
        }
    },
    watch: {
        'toAddress': function () {
            this.toEstimateGas();
        },
        'amount': function () {
            this.toEstimateGas();
        }
    },
    methods: {
        validAddr() {
            this.isValidAddress = this.toAddress && this.ethWallet.utils.isAddress(this.toAddress);
        },
        testAmount() {
            const result = this.$validAmount(this.amount, this.token.decimals) === 0;

            if (!result) {
                this.amountErr = this.$t('hint.amtFormat');
                return false;
            }

            if (BigNumber.isEqual(this.amount, 0)) {
                this.amountErr = this.$t('wallet.hint.amount');
                return false;
            }

            const amount = BigNumber.toMin(this.amount, this.token.decimals);
            if (BigNumber.compared(this.token.balance, amount) < 0) {
                this.amountErr = this.$t('hint.insufficientBalance');
                return false;
            }

            this.amountErr = '';
            return true;
        },

        setSize(size) {
            this.size = parseInt((this.maxGwei - this.minGwei) * size / 100 + this.minGwei);
        },
        toEstimateGas() {
            if (!this.canEstimate) {
                return;
            }

            estimateTimeout && clearTimeout(estimateTimeout);
            estimateTimeout = setTimeout(() => {
                this.estimateGas();
            }, 500);
        },
        estimateGas() {
            if (!this.canEstimate) {
                return;
            }

            const amount = this.amount;
            const toAddress = this.toAddress;
            const value = BigNumber.toMin(amount, this.token.decimals);

            this.ethWallet.estimateGas(toAddress, value, this.transactionType).then(gas => {
                if (!this || amount !== this.amount || toAddress !== this.toAddress) {
                    return;
                }
                this.gas = gas;
            }).catch(err => {
                console.warn(err);
            });
        },

        transfer() {
            this.validAddr();
            this.testAmount();
            if (!this.canTransfer) {
                return;
            }

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            this.isShowTrans = false;

            const activeAccount = this.$wallet.getActiveAccount();
            activeAccount.initPwd({
                submit: () => {
                    this.isShowTrans = true;

                    if (this.transType === 'exchange') {
                        this.conversion();
                        return;
                    }

                    this.sendTx();
                },
                cancel: () => {
                    this.closeTrans();
                }
            });
        },
        conversion() {
            this.loading = true;

            this.ethWallet.conversion({
                viteAddr: this.viteAddr,
                value: this.token.balance,
                gwei: this.size
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('walletConversion.exchange.success'));
                this.closeTrans();
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                this.$toast(err && err.message ? err.message : this.$t('hint.err'), 4000);
            });
        },
        sendTx() {
            const value = BigNumber.toMin(this.amount, this.token.decimals);
            this.loading = true;

            this.ethWallet[this.transactionType]({
                toAddress: this.toAddress,
                value,
                gwei: this.size
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('hint.transSucc'));
                this.closeTrans();
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                this.$toast(err && err.message ? err.message : this.$t('hint.err'), 4000);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";

.speed {
    width: 100%;
    font-size: 12px;
    font-family: $font-normal, arial, sans-serif;
    font-weight: 400;
    color: rgba(94, 104, 117, 1);
    line-height: 16px;
    padding-top: 16px;
    .left {
        float: left;
    }
    .right {
        float: right;
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
    .__btn {
        height: 40px;
        line-height: 40px;
    }
}
</style>
