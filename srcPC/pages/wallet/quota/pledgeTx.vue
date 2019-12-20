<template>
    <div class="pledge-tx-wrapper __form_border">
        <div class="row">
            <div class="item">
                <div class="__form_input_title">{{ $t('walletQuota.fromAddr') }}</div>
                <div class="__form_input all unuse __ellipsis">{{ addr }}</div>
            </div>
            <div class="item">
                <div class="__form_input_title">
                    {{ $t('stakingAmount') }}
                    <span v-show="amountErr" class="err">{{ amountErr }}</span>
                </div>
                <vite-input class="pledge-input-wrapper" type="number"
                            v-model="amount" :valid="testAmount"
                            :placeholder="$t('walletQuota.amountPlaceholder', { num: minNum })">
                    <span slot="after" class="unit">VITE</span>
                </vite-input>
            </div>
        </div>

        <div class="row">
            <div class="item">
                <div class="__form_input_title">
                    {{ $t('walletQuota.beneficialAddr') }}
                    <span v-show="!isValidAddress" class="err">{{ $t('hint.addrFormat') }}</span>
                </div>
                <vite-input class="pledge-input-wrapper" v-model="toAddr" :valid="testAddr"
                            :placeholder="$t('walletQuota.addrPlaceholder')">
                    <div slot="after" @click="toggleAddrList" v-click-outside="closeAddrList" class="add-unit __pointer">
                        <span class="add-icon"></span>
                        <ul v-show="isShowAddrList" class="list">
                            <li @click="addToAddrWithMine" class="toaddr __pointer">{{ $t('walletQuota.myAddr') }}</li>
                        </ul>
                    </div>
                </vite-input>
            </div>
            <div class="item">
                <div class="__form_input_title">{{ $t('walletQuota.time') }}</div>
                <span class="__form_input unuse about">{{ $t('walletQuota.aboutDays', { day: '3' }) }}</span>
                <span v-show="!btnUnuse" class="__form_btn __pointer" @click="validTx">{{ $t('submitStaking') }}</span>
                <span v-show="btnUnuse"  class="__form_btn __pointer unuse">{{ $t('submitStaking') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { wallet, constant } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import { initPwd } from 'pcComponents/password/index.js';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'pcUtils/sendTx';
import { verifyAmount } from 'pcUtils/validations';
import { execWithValid } from 'pcUtils/execWithValid';

const Vite_Token_Info = constant.Vite_Token_Info;
const amountTimeout = null;
const minNum = 134;

export default {
    components: { viteInput },
    destroyed() {
        this.clearAll();
    },
    data() {
        return {
            minNum,
            amount: '',
            toAddr: '',
            isValidAddress: true,
            amountErr: '',
            loading: false,
            isShowAddrList: false
        };
    },
    computed: {
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        addr() {
            return this.$store.getters.activeAddr;
        },
        btnUnuse() {
            return this.loading || !this.isValidAddress || this.amountErr || !this.amount || !this.toAddr;
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        }
    },
    methods: {
        testAmount() {
            const balance = this.tokenBalList && this.tokenBalList[Vite_Token_Info.tokenId]
                ? this.tokenBalList[Vite_Token_Info.tokenId].totalAmount : 0;

            this.amountErr = verifyAmount({
                formatDecimals: 8,
                decimals: Vite_Token_Info.decimals,
                balance,
                minAmount: BigNumber.toMin(minNum, Vite_Token_Info.decimals),
                errorMap: { lessMin: this.$t('walletQuota.limitAmt', { num: minNum }) }
            })(this.amount);

            return !this.amountErr;
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
                this.isValidAddress = wallet.isValidAddress(this.toAddr);
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
        addToAddrWithMine() {
            this.toAddr = this.addr;
        },
        validTx() {
            this._validTx();
        },
        _validTx: execWithValid(function () {
            if (this.btnUnuse) {
                return;
            }

            statistics.event(this.$route.name, 'SubmitQuota', this.addr || '');

            this.testAmount();
            this.testAddr();
            if (this.amountErr || !this.isValidAddress) {
                return;
            }

            initPwd({
                title: this.$t('submitStaking'),
                submitTxt: this.$t('walletQuota.confirm.submit.rightBtn'),
                cancelTxt: this.$t('walletQuota.confirm.submit.leftBtn'),
                content: this.$t('walletQuota.confirm.submit.describe', { amount: this.amount }),
                submit: () => {
                    this.sendPledgeTx();
                }
            }, true);
        }),

        sendPledgeTx() {
            statistics.event(this.$route.name, 'ConfirmQuota', this.addr || '');

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            this.loading = true;
            const amount = BigNumber.toMin(this.amount || 0, Vite_Token_Info.decimals);

            sendTx({
                methodName: 'stakeForQuota',
                data: {
                    beneficiaryAddress: this.toAddr,
                    amount
                },
                config: {
                    pow: true,
                    powConfig: {
                        cancel: () => {
                            this.loading = false;
                        }
                    }
                }
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }));
                this.clearAll();
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                err && this.$toast(this.$t('walletQuota.pledgeFail'), err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "../form.scss";

.pledge-tx-wrapper {
    position: relative;
    .row {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .item {
            display: inline-block;
            width: 49%;
            min-width: 510px;
            margin-top: 14px;
        }
        .about, .__form_btn {
            display: inline-block;
            width: 48%;
        }
    }

    .__form_input.all {
        width: 100%;
    }

    .unit {
        @include common_font_color();
        padding: 0 15px;
    }

    .add-unit {
        padding: 0 10px;
        position: relative;
        .add-icon {
            display: inline-block;
            margin-top: 7px;
            width: 18px;
            height: 18px;
            background: url('~assets/imgs/add-quota-icon.svg');
            background-size: 18px 18px;
        }

        .list {
            position: absolute;
            right: -4px;
            padding: 10px;
            font-size: 12px;
            @include font-family-normal();
            font-weight: 400;
            color: rgba(94, 104, 117, 1);
            line-height: 18px;
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
                left: 15px;
            }
        }
    }
}
</style>
