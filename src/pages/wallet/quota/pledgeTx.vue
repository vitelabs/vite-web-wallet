<template>
    <div class="pledge-tx-wrapper">
        <div class="row">
            <div class="item">
                <div class="title">{{ $t('walletQuota.fromAddr') }}</div>
                <div class="input-item all unuse __ellipsis">{{ addr }}</div>
            </div>
            <div class="item">
                <div class="title">
                    {{ $t('stakingAmount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <vite-input v-model="amount" :valid="testAmount"
                            :placeholder="$t('walletQuota.amountPlaceholder', { num: minNum })">
                    <span slot="after" class="unit">VITE</span>
                </vite-input>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="title">
                    {{ $t('walletQuota.beneficialAddr') }}
                    <span v-show="!isValidAddress" class="err">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input v-model="toAddr" :valid="testAddr"
                            :placeholder="$t('walletQuota.addrPlaceholder')">
                    <div slot="after" @click="toggleAddrList" v-click-outside="closeAddrList" class="add-unit __pointer">
                        <span class="add-icon"></span>
                        <ul v-show="isShowAddrList" class="list">
                            <li @click="addToAddr('mine')" class="toaddr __pointer">{{ $t('walletQuota.myAddr') }}</li>
                            <li @click="addToAddr('dex')" class="toaddr __pointer">{{ $t('walletQuota.VX') }}</li>
                        </ul>
                    </div>
                </vite-input>
            </div>
            <div class="item">
                <div class="title">{{ $t('walletQuota.time') }}</div>
                <span class="input-item unuse about">{{ $t('walletQuota.aboutDays', { day: '3' }) }}</span>
                <span v-show="!btnUnuse" class="btn __pointer" :class="{
                    'unuse': btnUnuse
                }" v-unlock-account="validTx">{{ $t('submitStaking') }}</span>
                <span v-show="btnUnuse"  class="btn __pointer" :class="{
                    'unuse': btnUnuse
                }">{{ $t('submitStaking') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { hdAddr, constant } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';

const amountTimeout = null;
const minNum = 1000;

export default {
    components: { viteInput },
    props: {
        tokenInfo: {
            type: Object,
            default: () => {
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
        const activeAccount = this.$wallet.getActiveAccount();

        return {
            minNum,
            activeAccount,
            addr: activeAccount.getDefaultAddr(),
            amount: '',
            toAddr: '',
            isValidAddress: true,
            amountErr: '',
            loading: false,
            isShowAddrList: false
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
    methods: {
        testAmount() {
            if (!this.amount) {
                return true;
            }

            if (!this.amount) {
                this.amountErr = '';

                return true;
            }

            const result = this.$validAmount(this.amount, this.tokenInfo.decimals) === 0;
            if (!result) {
                this.amountErr = this.$t('hint.amtFormat');

                return false;
            }

            if (BigNumber.compared(this.amount, minNum) < 0) {
                this.amountErr = this.$t('walletQuota.limitAmt', { num: minNum });

                return false;
            }

            const balance = this.tokenBalList && this.tokenBalList[this.tokenInfo.tokenId]
                ? this.tokenBalList[this.tokenInfo.tokenId].totalAmount : 0;

            if (this.tokenInfo && this.tokenInfo.tokenId) {
                const amount = BigNumber.toMin(this.amount, this.tokenInfo.decimals);
                if (BigNumber.compared(balance, amount) < 0) {
                    this.amountErr = this.$t('hint.insufficientBalance');

                    return false;
                }
            }

            this.amountErr = '';

            return true;
        },
        testAddr() {
            if (!this.toAddr) {
                return true;
            }

            if (!this.toAddr) {
                this.isValidAddress = true;

                return;
            }

            try {
                this.isValidAddress = hdAddr.isValidHexAddr(this.toAddr);
            } catch (err) {
                console.warn(err);
                this.isValidAddress = false;
            }
        },

        clearAll() {
            clearTimeout(amountTimeout);
            this.toAddr = '';
            this.amount = '';
            this.amountErr = '';
        },

        closeAddrList() {
            this.isShowAddrList = false;
        },
        toggleAddrList() {
            this.isShowAddrList = !this.isShowAddrList;
        },
        addToAddr(type) {
            this.toAddr = type === 'mine' ? this.activeAccount.getDefaultAddr() : constant.DexFund_Addr;
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
                title: this.$t('submitStaking'),
                submitTxt: this.$t('walletQuota.confirm.submit.rightBtn'),
                cancelTxt: this.$t('walletQuota.confirm.submit.leftBtn'),
                content: this.$t('walletQuota.confirm.submit.describe', { amount: this.amount }),
                submit: () => {
                    this._sendPledgeTx();
                }
            }, true);
        },
        _sendPledgeTx() {
            this.$statistics.event('Vite_web_wallet', 'quota', 'ConfirmQuota');
            this.loading = true;

            this.sendPledgeTx({
                toAddress: this.toAddr,
                amount: this.amount
            }, 'getQuota', (result, err) => {
                this.loading = false;
                if (!result) {
                    err && this.$toast(this.$t('walletQuota.pledgeFail'), err);

                    return;
                }

                this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }), err);
                this.clearAll();
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
            min-width: 510px;
            margin-top: 30px;
        }

        .title {
            font-family: $font-bold, arial, sans-serif;
            font-size: 14px;
            color: #1d2024;
            letter-spacing: 0.35px;
            line-height: 16px;
            margin-bottom: 16px;

            .err {
                float: right;
                font-size: 12px;
                color: #ff2929;
                line-height: 16px;
            }
        }

        .about, .btn {
            display: inline-block;
            width: 48%;
        }

        .btn {
            border-radius: 2px;
            background: #007aff;
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

    .unit {
        padding: 0 15px;
    }

    .add-unit {
        padding: 0 10px;
        position: relative;

        .add-icon {
            display: inline-block;
            margin-top: 11px;
            width: 18px;
            height: 18px;
            background: url('~assets/imgs/add-quota-icon.svg');
            background-size: 18px 18px;
        }

        .list {
            position: absolute;
            right: -4px;
            padding: 10px;
            font-size: 14px;
            font-family: $font-normal, arial, sans-serif;
            font-weight: 400;
            color: rgba(94, 104, 117, 1);
            line-height: 24px;
            white-space: nowrap;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.1);

            &::after {
                content: ' ';
                display: inline-block;
                border: 6px solid transparent;
                border-bottom: 6px solid #fff;
                position: absolute;
                top: -12px;
                left: 65%;
            }
        }
    }

    .input-item {
        box-sizing: border-box;
        height: 40px;
        line-height: 40px;
        background: #fff;
        border: 1px solid #d4dee7;
        border-radius: 2px;
        font-size: 14px;
        color: #5e6875;
        padding: 0 15px;

        &.all {
            width: 100%;
        }

        &.unuse {
            background: #f3f6f9;
        }
    }
}

@media only screen and (max-width: 1450px) {
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
            margin-right: 0;
        }
    }
}
</style>
