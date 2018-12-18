<template>
    <div class="__trans-wrapper">
        <confirm class="trans-confirm"
                 :title="transType === 'transfer' ? $t('account.transfer') : $t('exchangeVite.exchange.vite')"
                 :leftBtnTxt="transType === 'transfer' ? $t('account.transfer') : $t('exchangeVite.exchange.btn')"
                 :closeIcon="true" :btnUnuse="!canTransfer" :close="closeTrans" 
                 :singleBtn="true" :leftBtnClick="transfer">

            <div class="__row">
                <div class="__row-t">{{ $t('account.balance') }}</div>
                <div class="__unuse-row">
                    <img :src="icon" class="__icon" />
                    {{ token.symbol }} <span class="__right">{{ balance }}</span>
                </div>
            </div>

            <div v-show="transType === 'transfer'" class="__row">
                <div class="__row-t">
                    {{ $t('account.inAddress') }}
                    <span v-show="!isValidAddress" class="__err __hint">{{ $t('transList.valid.addr') }}</span>
                </div>
                <vite-input v-model="toAddress" :valid="validAddr"
                            :placeholder="$t('account.placeholder.addr')"></vite-input>
            </div>

            <div v-show="transType === 'transfer'" class="__row">
                <div class="__row-t">
                    {{ $t('account.sum') }}
                    <span v-show="amountErr" class="__err __hint">{{ amountErr }}</span>
                </div>
                <vite-input v-model="amount" :valid="testAmount"
                            :placeholder="$t('account.placeholder.amount')"></vite-input>
            </div>

            <div v-show="transType === 'exchange'" class="__row">
                <div class="__row-t">{{ $t('exchangeVite.exchange.viteAddr') }}</div>
                <div class="__unuse-row __light">{{ viteAddr }}</div>
            </div>

            <div v-show="transType === 'exchange'" class="__row">
                <div class="__row-t">{{ $t('exchangeVite.exchange.viteAmount') }}</div>
                <div class="__unuse-row __light">{{ balance }}</div>
            </div>

            <div class="__row">
                <div class="__row-t">
                    {{ $t('exchangeVite.gas') }}
                    <span class="__hint __right">{{ size + 'Gwei' }}</span>
                </div>
                <process :min="minGwei" :max="maxGwei" :default="size" :setSize="setSize"></process>
            </div>
        </confirm>
    </div>
</template>

<script>
import icon from 'assets/imgs/eth_logo.svg';
import BigNumber from 'utils/bigNumber';
import confirm from 'components/confirm';
import viteInput from 'components/viteInput';
import process from './process';

const minGwei = 3;
const maxGwei = 99;
const defaultGwei = 41;
// 0x5e7f57510dd06225a18f58c724996bf91592cdad

export default {
    components: {
        confirm, viteInput, process
    },
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
            default: ()=>{}
        }
    },
    created() {
    },
    mounted() {
        this.$onEnterKey(() => {
            this.transfer();
        });
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();
        let viteAddr = activeAccount.getDefaultAddr();

        return {
            icon,
            viteAddr,
            loading: false,
            minGwei,
            maxGwei,
            size: defaultGwei,

            toAddress: '',
            amount: '',
            isValidAddress: true,
            amountErr: ''
        };
    },
    computed: {
        balance() {
            let decimals = this.token.decimals;
            let balance = this.token.balance;
            return +balance ? BigNumber.toBasic(balance, decimals) : 0;
        },
        canTransfer() {
            return !this.loading && (
                this.transType === 'exchange' ||
                (this.toAddress && this.amount && this.isValidAddress && !this.amountErr)
            );
        }
    },
    methods: {
        validAddr() {
            this.isValidAddress = this.toAddress && this.ethWallet.isAddress(this.toAddress);
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
            if (BigNumber.compared(this.token.balance, amount) < 0) {
                this.amountErr = this.$t('transList.valid.bal');
                return false;
            }

            this.amountErr = '';
            return true;
        },

        setSize(size) {
            this.size = parseInt( (this.maxGwei - this.minGwei) * size/100 + this.minGwei );
        },

        transfer() {
            this.validAddr();
            this.testAmount();
            if (!this.canTransfer) {
                return;
            }

            if (!viteWallet.Net.getNetStatus()) {
                this.$toast(this.$t('nav.noNet'));
                return;
            }

            if (this.transType === 'exchange') {
                this.exchangeVite();
                return;
            }

            let type = this.token.name === 'eth' ? 'sendTx' : 'sendContractTx';
            this.sendTx(type);

            // this.closeTrans();
            // let activeAccount = this.$wallet.getActiveAccount();
            // activeAccount.initPwd({
            //     submit: () => {
            //         if (this.transType === 'exchange') {
            //             this.exchangeVite();
            //             return;
            //         }

            //         let type = this.token.name === 'eth' ? 'sendTx' : 'sendContractTx';
            //         this.sendTx(type);
            //     },
            //     cancel: () => {
            //     }
            // });
        },
        exchangeVite() {
            this.loading = true;

            this.ethWallet.exchangeVite({
                viteAddr: this.viteAddr,
                value: this.token.balance,
                gwei: this.size
            }).then(() => {
                this.loading = false;
                this.$toast( this.$t('exchangeVite.exchange.success') );
                this.closeTrans();
            }).catch((err) => {
                console.warn(err);
                this.loading = false;
                this.$toast( this.$t('hint.err') );
            });
        },
        sendTx(type) {
            let value = BigNumber.toMin(this.amount, this.token.decimals);
            this.loading = true;

            this.ethWallet[type]({
                toAddress: this.toAddress,
                value, 
                gwei: this.size
            }).then(() => {
                this.loading = false;
                this.$toast( this.$t('transList.valid.succ') );
                this.closeTrans();
            }).catch((err) => {
                console.warn(err);
                this.loading = false;
                this.$toast( this.$t('hint.err') );
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/trans.scss";
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
