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
                    <img  :src="token.icon||getIcon(token.tokenId)" class="__icon" />
                    {{ token.tokenSymbol }} <span class="__right">{{ showAccBalance }}</span>
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
                <vite-input v-model="amount" :valid="testAmount" type="number"
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
    </div>
</template>

<script>
import Vue from 'vue';
import { utils, hdAddr } from '@vite/vitejs';

import { initPwd } from 'components/password/index.js';
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import bigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';
import { getTokenIcon } from 'utils/tokenParser';
import { verifyAmount } from 'utils/validations';

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
        }
    },
    methods: {
        getIcon(id) {
            return getTokenIcon(id);
        },
        validAddr() {
            this.isValidAddress = this.inAddress && hdAddr.isValidHexAddr(this.inAddress);
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

            if (!this.inAddress) {
                this.isValidAddress = false;
            }

            if (this.amountErr || this.messageErr || !this.isValidAddress || !this.testAmount()) {
                return;
            }

            const isHold = initPwd({
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
            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            this.loading = true;
            const amount = bigNumber.toMin(this.amount, this.token.decimals);

            const transError = (msg, err) => {
                this.loading = false;
                this.isShowTrans = true;

                const code = err && err.error ? err.error.code || -1
                    : err ? err.code : -1;
                if (code === -35001) {
                    this.$toast(this.$t('hint.insufficientBalance'));
                    this.amountErr = this.$t('hint.insufficientBalance');
                    return;
                }

                this.$toast(msg, err);
            };

            sendTx('asyncSendTx', {
                toAddress: this.inAddress,
                tokenId: this.token.tokenId,
                amount,
                message: this.message
            }, {
                pow: true,
                powConfig: {
                    isShowCancel: true,
                    cancel: () => {
                        this.closeTrans();
                    }
                }
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('hint.transSucc'));
                this.closeTrans();
            }).powStarted(() => {
                this.isShowTrans = false;
            })
                .powFailed((err, type) => {
                    if (!err && !type) {
                        return;
                    }
                    console.warn(type, err);

                    if (type === 0) {
                        transError(this.$t('wallet.trans.powErr'), err);
                        return;
                    }

                    const code = err && err.error ? err.error.code || -1
                        : err ? err.code : -1;
                    if (code === -35002) {
                        transError(this.$t('wallet.trans.powTransErr'));
                        return;
                    }

                    transError(null, err);
                })
                .catch(err => {
                    console.warn(err);
                    transError(null, err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";

.__icon{
    height: 20px;
    width: 20px;
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
