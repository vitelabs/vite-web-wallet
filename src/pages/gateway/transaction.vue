<template>
    <div class="__trans-wrapper">
        <confirm class="trans-confirm"
                 :title="transType === 'transfer' ? $t('account.transfer') : $t('gateway.exchange.vite')"
                 :leftBtnTxt="transType === 'transfer' ? $t('account.transfer') : $t('gateway.exchange.btn')"
                 :closeIcon="true" :close="closeTrans" :singleBtn="true" :leftBtnClick="transfer">

            <div class="__row">
                <div class="__row-t">{{ $t('account.balance') }}</div>
                <div class="__unuse-row">
                    <img :src="icon" class="__icon" />
                    {{ token.symbol }} <span class="__right">{{ balance }}</span>
                </div>
            </div>

            <div v-show="transType === 'exchange'" class="__row">
                <div class="__row-t">{{ $t('gateway.exchange.viteAddr') }}</div>
                <div class="__unuse-row __light">{{ viteAddr }}</div>
            </div>

            <div v-show="transType === 'exchange'" class="__row">
                <div class="__row-t">{{ $t('gateway.exchange.viteAmount') }}</div>
                <div class="__unuse-row __light">{{ balance }}</div>
            </div>

            <div class="__row">
                
            </div>
        </confirm>
    </div>
</template>

<script>
import confirm from 'components/confirm';
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';
import icon from 'assets/imgs/eth_logo.svg';

const minGwei = 3;
const maxGwei = 99;
const defaultGwei = 41;

export default {
    components: {
        confirm, viteInput
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
        let activeAccount = this.$wallet.getActiveAccount();
        this.viteAddr = activeAccount.getDefaultAddr();
    },
    mounted() {
        this.$onEnterKey(() => {
            this.transfer();
        });
    },
    data() {
        return {
            icon,
            viteAddr: '',
            amount: '',
            loading: false
        };
    },
    computed: {
        balance() {
            let decimals = this.token.decimals;
            let balance = this.token.balance;
            return +balance ? BigNumber.toBasic(balance, decimals) : 0;
        }
    },
    methods: {
        transfer() {
            if (!viteWallet.Net.getNetStatus()) {
                this.$toast(this.$t('nav.noNet'));
                return;
            }

            if (this.transType !== 'exchange') {
                // this.ethWallet.sendTx();
                return;
            }

            this.ethWallet.exchangeVite({
                viteAddr: this.viteAddr,
                value: 2,
                gwei: minGwei
            }).then(() => {
                console.log('ok');
            }).catch((err) => {
                console.warn(err);
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
