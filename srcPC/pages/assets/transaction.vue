<template>
    <div class="__trans-wrapper">
        <confirm
            v-show="isShowTrans"
            class="trans-confirm"
            :showMask="true"
            :title="$t('wallet.transfer')"
            :btnUnuse="unTrans"
            :closeIcon="true"
            :close="closeTrans"
            :singleBtn="true"
            :leftBtnClick="validTrans"
            :leftBtnTxt="$t('wallet.transfer')"
        >
            <div class="__row">
                <div class="__row_t">{{ $t("balance") }}</div>
                <div class="__input_row __unuse_input __bold">
                    <img
                        :src="token.icon || getIcon(token.tokenId)"
                        class="__icon"
                    />
                    {{ token.tokenSymbol }}
                    <span class="__right">{{ showAccBalance }}</span>
                </div>
            </div>

            <div class="__row">
                <div class="__row_t">
                    {{ $t("wallet.inAddress") }}
                    <span v-show="!isValidAddress" class="__err">{{
                        $t("hint.addrFormat")
                    }}</span>
                </div>
                <vite-input
                    v-model="inAddress"
                    :valid="validAddr"
                    :placeholder="$t('wallet.placeholder.addr')"
                ></vite-input>
            </div>

            <div class="__row">
                <div class="__row_t">
                    {{ $t("wallet.sum") }}
                    <span v-show="amountErr" class="__err">{{
                        amountErr
                    }}</span>
                </div>
                <vite-input
                    v-model="amount"
                    :valid="testAmount"
                    type="number"
                    :placeholder="$t('wallet.placeholder.amount')"
                ></vite-input>
            </div>

            <div class="__row">
                <div class="__row_t">
                    {{ $t("wallet.remarks") }}
                    <span class="__row_hint" :class="{ __err: messageErr }">
                        {{ $t("wallet.remarksLong", { len: msgBalance }) }}
                    </span>
                </div>
                <vite-input
                    v-model="message"
                    :placeholder="$t('wallet.placeholder.remarks')"
                ></vite-input>
            </div>
        </confirm>
    </div>
</template>

<script>
import Vue from 'vue';
import { utils, wallet, accountBlock as accountBlockUtils } from '@vite/vitejs';

import { initPwd } from 'pcComponents/password/index.js';
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import sendTx from 'pcUtils/sendTx';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { getTokenIcon } from 'utils/tokenParser';
import { verifyAmount } from 'pcUtils/validations';
import { execWithValid } from 'pcUtils/execWithValid';

const { getBytesSize } = utils;

export default {
    components: { confirm, viteInput },
    props: {
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
        Vue.nextTick(() => {
            this.$refs.inAddr && this.$refs.inAddr.focus();
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
            return !!(
                !this.amount
                || !this.inAddress
                || this.loading
                || this.amountErr
                || !this.isValidAddress
                || this.messageErr
            );
        },
        accBalance() {
            return this.token.totalAmount;
        },
        showAccBalance() {
            return bigNumber.toBasic(this.accBalance, this.token.decimals);
        },
        tokenBalList() {
            return this.$store.state.account.balance.balanceInfos;
        },
        msgBalance() {
            const message = this.$trim(this.message);
            const length = getBytesSize(message);
            return 120 - length;
        },
        messageErr() {
            return this.msgBalance < 0;
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        activeAddr() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        getIcon(id) {
            return getTokenIcon(id);
        },
        validAddr() {
            this.isValidAddress
                = this.inAddress && wallet.isValidAddress(this.inAddress);
        },

        testAmount() {
            this.amountErr = verifyAmount({
                formatDecimals: 8,
                decimals: this.token.decimals,
                balance: this.accBalance || 0
            })(this.amount);
            return !this.amountErr;
        },

        validTrans() {
            if (this.loading) {
                return;
            }

            statistics.event(this.$route.name, 'wallet-transfer-submit', this.activeAddr || '');

            if (!this.inAddress) {
                this.isValidAddress = false;
            }

            if (
                this.amountErr
                || this.messageErr
                || !this.isValidAddress
                || !this.testAmount()
            ) {
                return;
            }

            const isHold = initPwd({
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

        transfer: execWithValid(function () {
            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            this.loading = true;
            const amount = bigNumber.toMin(this.amount, this.token.decimals);

            const transError = (msg, err) => {
                this.loading = false;
                this.isShowTrans = true;

                const code
                    = err && err.error
                        ? err.error.code || -1
                        : err
                            ? err.code
                            : -1;

                if (+code === -35001) {
                    this.$toast(this.$t('hint.insufficientBalance'));
                    this.amountErr = this.$t('hint.insufficientBalance');
                    return;
                }

                if (+code === 11021) {
                    this.loading = false;
                    this.closeTrans();
                    return;
                }

                this.$toast(msg, err);
            };

            sendTx({
                methodName: 'send',
                data: {
                    toAddress: this.inAddress,
                    tokenId: this.token.tokenId,
                    amount,
                    data: this.message ? accountBlockUtils.utils.messageToData(this.message) : null
                },
                config: {
                    pow: true,
                    powConfig: {
                        isShowCancel: true,
                        cancel: () => {
                            this.closeTrans();
                        }
                    }
                }
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('hint.transSucc'));
                this.closeTrans();
            }).catch(err => {
                console.warn(err);
                transError(null, err);
            });
        })
    }
};
</script>
