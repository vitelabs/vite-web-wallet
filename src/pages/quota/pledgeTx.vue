<template>
    <div class="pledge-tx-wrapper">
        <div class="row">
            <div class="item">
                <div class="title">{{ $t('quota.fromAddr') }}</div>
                <div class="input-item all unuse __ellipsis">{{ addr }}</div>
            </div>
            <div class="item">
                <div class="title">
                    {{ $t('quota.amount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <div class="input-item all __ellipsis">
                    <input v-model="amount" class="amount" type="text" 
                           :placeholder="$t('quota.amountPlaceholder')" />
                    <span class="unit">VITE</span>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">
                    {{ $t('quota.beneficialAddr') }}
                    <span v-show="!isValidAddress" class="err">{{ $t('transList.valid.addr') }}</span>
                </div>
                <div class="input-item all __ellipsis">
                    <input v-model="toAddr" type="text" 
                           :placeholder="$t('quota.addrPlaceholder')" />
                </div>
            </div>
            <div class="item">
                <div class="title">{{ $t('quota.time') }}</div>
                <span class="input-item unuse about">{{ $t('quota.aboutDays') }}</span>
                <span class="btn __pointer" :class="{
                    'unuse': btnUnuse
                }" @click="validTx">{{ $t('quota.btn') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';

let amountTimeout = null;
let toAddrTimeout = null;

export default {
    props: {
        tokenInfo: {
            type: Object,
            default: ()=>{
                return {};
            }
        },
        sendPledgeTx: {
            type: Function,
            default: () => {}
        }
    },
    destroyed() {
        this.clearAll();
    },
    data() {
        let activeAccount = this.$wallet.getActiveAccount();

        return {
            activeAccount,
            addr: activeAccount.getDefaultAddr(),
            amount: '',
            toAddr: '',
            isValidAddress: true,
            amountErr: '',
            loading: false,
            stopWatch: false
        };
    },
    computed: {
        btnUnuse() {
            return this.loading || !this.isValidAddress || this.amountErr || !this.amount || !this.toAddr;
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        }
    },
    watch: {
        toAddr: function() {
            clearTimeout(toAddrTimeout);
            toAddrTimeout = null;

            if (this.stopWatch) {
                return;
            }

            toAddrTimeout = setTimeout(()=> {
                toAddrTimeout = null;
                this.testAddr();
            }, 500);
        },
        amount: function() {
            clearTimeout(amountTimeout);
            amountTimeout = null;

            if (this.stopWatch) {
                return;
            }

            amountTimeout = setTimeout(()=> {
                amountTimeout = null;
                this.testAmount();
            }, 500);
        },
    },
    methods: {
        testAmount() {
            let result = this.$validAmount(this.amount);
            if (!result) {
                this.amountErr = this.$t('transList.valid.amt');
                return false;
            }

            if (viteWallet.BigNumber.compared(this.amount, 10) < 0) {
                this.amountErr = this.$t('quota.limitAmt');
                return false;
            }

            let balance = this.tokenBalList && this.tokenBalList[this.tokenInfo.tokenId] ? 
                this.tokenBalList[this.tokenInfo.tokenId].totalAmount : 0;

            if (this.tokenInfo && this.tokenInfo.tokenId) {
                let amount = viteWallet.BigNumber.toMin(this.amount, this.tokenInfo.decimals);
                if (viteWallet.BigNumber.compared(balance, amount) < 0) {
                    this.amountErr = this.$t('transList.valid.bal');
                    return false;
                }
            }

            this.amountErr = '';
            return true;
        },
        testAddr() {
            if (!this.toAddr) {
                this.isValidAddress = false;
                return;
            }

            try {
                this.isValidAddress = viteWallet.Types.isValidHexAddr(this.toAddr);
            } catch(err) {
                console.warn(err);
                this.isValidAddress = false;
            }
        },

        clearAll() {
            this.stopWatch = true;
            clearTimeout(amountTimeout);
            clearTimeout(toAddrTimeout);
            this.toAddr = '';
            this.amount = '';
            this.amountErr = '';
            this.isValidAddress = true;
        },

        validTx() {
            if (this.btnUnuse) {
                return;
            }

            this.$statistics.event('Vite_web_wallet', 'quota', 'SubmitQuota');

            this.testAmount();
            this.testAddr();
            if (this.amountErr || !this.isValidAddress) {
                return;
            }

            this.activeAccount.initPwd({
                title: this.$t('quota.confirm.submit.title'),
                submitTxt: this.$t('quota.confirm.submit.rightBtn'),
                cancelTxt: this.$t('quota.confirm.submit.leftBtn'),
                content: this.$t('quota.confirm.submit.describe', {
                    amount: this.amount
                }),
                submit: () => {
                    this._sendPledgeTx();
                }
            }, true);
        },
        _sendPledgeTx() {
            this.$statistics.event('Vite_web_wallet', 'quota', 'ConfirmQuota');
            this.loading = true;
            
            this.sendPledgeTx({
                toAddr: this.toAddr,
                amount: this.amount
            }, 'pledgeBlock', (result) => {
                this.loading = false;
                if (!result) {
                    this.$toast(this.$t('quota.pledgeFail'));
                    return;
                }

                this.$toast(this.$t('hint.request', {
                    name: this.$t('quota.btn') 
                }));
                this.clearAll();
                Vue.nextTick(() => {
                    this.stopWatch = false;
                });
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.pledge-tx-wrapper {
    position: relative;
    margin-top: 40px;
    .row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            display: inline-block;
            width: 49%;
            min-width: 470px;
            margin-top: 30px;
        }
        .title {
            font-family: $font-bold, arial, sans-serif;
            font-size: 14px;
            color: #1D2024;
            letter-spacing: 0.35px;
            line-height: 16px;
            margin-bottom: 16px;
            .err {
                float: right;
                font-size: 12px;
                color: #FF2929;
                line-height: 16px;
            }
        }
        .about, .btn {
            display: inline-block;
            width: 48%;
        }
        .btn {
            border-radius: 2px;
            background: #007AFF;
            color: #fff;
            line-height: 40px;
            text-align: center;
            float: right;
            &.unuse {
                background: #efefef;
                color: #666;
                cursor: not-allowed;
            }
        }
    }

    .input-item {
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        background: #FFFFFF;
        border: 1px solid #D4DEE7;
        border-radius: 2px;
        font-size: 14px;
        color: #5E6875;
        padding: 0 15px;
        &.all {
            width: 100%;
        }
        &.unuse {
            background: #F3F6F9;
        }
        .unit {
            float: right;
        }
        input {
            width: 100%;
            background: transparent;
            font-size: 14px;
            &.amount {
                width: 80%;
                min-width: 397px;
            }
        }
    }
}

@media only screen and (max-width: 1419px) {
    .pledge-tx-wrapper .row .item {
        margin-top: 20px;
    }
}

@media only screen and (max-width: 750px) {
    .pledge-tx-wrapper {
        margin-top: 20px;
    }
    .pledge-tx-wrapper .row .item {
        width: 100%;
        min-width: 0;
        &:first-child {
            margin-right: 0px;
        }
    }
    .pledge-tx-wrapper .input-item input.amount {
        min-width: 0;
    }
}
</style>
