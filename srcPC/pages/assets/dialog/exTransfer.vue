<template>
    <confirm v-if="isShowConfirm" class="middle no-padding-confirm"
             :closeIcon="true"  :close="hide"
             :btnUnuse="unTrans" :isLoading="isLoading"
             :title="$t('tokenCard.actionType.EXTRANSFER')"
             :leftBtnTxt="$t('btn.cancel')" :leftBtnClick="hide"
             :rightBtnTxt="$t('btn.submit')" :rightBtnClick="submit">
        <div class="transfer-head">
            <div class="point"><div class="line"></div></div>
            <div class="describe">
                <div class="line"><span>{{ $t('tokenCard.transferConfirm.from') }}</span>{{ from }}</div>
                <div class="line"><span>{{ $t('tokenCard.transferConfirm.to') }}</span>{{ to }}</div>
            </div>
            <div class="switch __pointer" @click="switchTransfer"></div>
        </div>

        <div class="__row">
            <div class="__row_t">{{ $t("tokenCard.transferConfirm.avaliableAmount") }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="tokenInfo.icon" class="__icon"/>
                {{ tokenInfo.tokenSymbol }}
                <span class="__right">{{ basicAvailableAmount }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t("wallet.sum") }}
                <span v-show="amountErr" class="__err">{{ amountErr }}</span>
            </div>
            <vite-input v-model="amount" :valid="validAmount" @input="noAll"
                        :placeholder="$t('wallet.placeholder.amount')">
                <span slot="after" @click="all" class="__all_wrapper __pointer">
                    <span class="__all">{{ $t('tradeAssets.all') }}</span>
                </span>
            </vite-input>
        </div>
    </confirm>
</template>

<script>
import confirm from 'pcComponents/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import bigNumber from 'utils/bigNumber';
import { verifyAmount } from 'pcUtils/validations';
import sendTx from 'pcUtils/sendTx';

export default {
    components: { confirm, viteInput },
    props: {
        tokenInfo: {
            /**
             * icon
             * tokenId
             * totalAmount
             * availableExAmount
             * decimals
             * tokenSymbol
             */
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            isShowConfirm: false,
            isFromWallet: true,
            amount: '',
            amountErr: '',
            isAll: false,
            isLoading: false
        };
    },
    computed: {
        unTrans() {
            return this.isLoading || !+this.availableAmount || !+this.amount || this.amountErr;
        },
        availableAmount() {
            if (!this.tokenInfo) {
                return '0';
            }

            return this.isFromWallet
                ? this.tokenInfo.totalAmount || '0'
                : this.tokenInfo.availableExAmount || '0';
        },
        basicAvailableAmount() {
            if (+!this.availableAmount) {
                return '0';
            }
            return bigNumber.toBasic(this.availableAmount, this.tokenDecimals);
        },
        tokenDecimals() {
            return this.tokenInfo.decimals;
        },
        from() {
            return this.isFromWallet
                ? this.$t('tokenCard.transferConfirm.wallet')
                : this.$t('tokenCard.transferConfirm.dex');
        },
        to() {
            return this.isFromWallet
                ? this.$t('tokenCard.transferConfirm.dex')
                : this.$t('tokenCard.transferConfirm.wallet');
        }
    },
    watch: {
        availableAmount() {
            this.validAmount();
            this.isAll = false;
        }
    },
    methods: {
        show() {
            this.isShowConfirm = true;
        },
        hide() {
            this.isShowConfirm = false;
            this.amount = '';
            this.isLoading = false;
            this.isAll = false;
            this.isFromWallet = true;
        },
        noAll() {
            this.isAll = false;
        },
        switchTransfer() {
            this.isFromWallet = !this.isFromWallet;
            this.isAll = false;
            this.validAmount();
        },
        validAmount() {
            this.amountErr = verifyAmount({
                formatDecimals: 8,
                decimals: this.tokenDecimals,
                balance: this.availableAmount
            })(this.amount);
            return !this.amountErr;
        },
        all() {
            if (!+this.availableAmount) {
                return;
            }

            this.isAll = true;
            this.amount = bigNumber.toBasic(this.availableAmount, this.tokenDecimals);
        },
        submit() {
            this.validAmount();
            if (this.unTrans) {
                return;
            }

            const methodName = this.isFromWallet ? 'dexDeposit' : 'dexWithdraw';
            const successMsg = this.isFromWallet
                ? this.$t('tradeAssets.confirmrecharge.successToast')
                : this.$t('tradeAssets.confirmwithdraw.successToast');
            const failMsg = this.isFromWallet
                ? this.$t('tradeAssets.confirmrecharge.failToast')
                : this.$t('tradeAssets.confirmwithdraw.failToast');

            const amount = this.isAll
                ? this.availableAmount
                : bigNumber.toMin(this.amount, this.tokenDecimals);
            this.isLoading = true;

            this.sendTx(methodName, amount).then(() => {
                this.isLoading = false;
                this.$toast(successMsg);
                this.hide();
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast(failMsg, err);
            });
        },
        sendTx(methodName, amount) {
            return sendTx({
                methodName,
                data: {
                    tokenId: this.tokenInfo.tokenId,
                    amount
                },
                config: {
                    pow: true,
                    powConfig: {
                        cancel: () => {
                            this.isLoading = false;
                        }
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcComponents/confirm/confirmRow.scss";

.transfer-head {
    display: flex;
    flex-direction: row;
    padding: 0 30px;
    background: rgba(0,122,255,0.05);
    align-items: center;
    [data-theme="0"] & {
        border: 1px solid rgba(212,222,231,1);
    }
    .point {
        margin-right: 11px;
        .line {
            width: 4px;
            height: 40px;
            margin: 5px 1px;
            background: url('~assets/imgs/transfer-points.svg');
            background-size: 4px 40px;
        }
        &::before, &::after {
            display: block;
            content: ' ';
            width: 6px;
            height: 6px;
            border-radius: 6px;
        }
        &::before {
            background: rgba(0,215,100,1);
        }
        &::after {
            background: #E5494D;
        }
    }
    .describe {
        flex: 1;
        font-size: 12px;
        @include font-family-bold();
        @include common_font_color();
        line-height: 16px;
        .line {
            padding: 20px 5px;
            span {
                margin-right: 15px;
            }
            &:first-child {
                [data-theme="0"] & {
                    border-bottom: 1px solid rgba(211,223,239,1);
                }
                [data-theme="1"] & {
                    border-bottom: 1px solid $black-color-2;
                }
            }
        }
    }
    .switch {
        width: 40px;
        height: 40px;
        background: url('~assets/imgs/switch.svg');
        background-size: 40px 40px;
        margin-left: 72px;
    }
}

.__row {
    padding: 0px 30px;
    &:last-child {
        padding-bottom: 30px;
    }
}
</style>
