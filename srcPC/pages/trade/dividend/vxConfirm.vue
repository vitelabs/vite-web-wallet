<template>
    <confirm v-if="isShow" :showMask="true"
             :title="confirmText.title"
             :closeIcon="true" :close="close"
             :leftBtnClick="submit" :leftBtnTxt="confirmText.submit"
             :singleBtn="true" :btnUnuse="!canSubmit">

        <div class="__row">
            <div class="__row_t">{{ confirmText.available }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="vxTokenInfo.icon" class="__icon" />VX
                <span class="__right">{{ basicAvailableAmount }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ confirmText.amountText }}
                <span v-show="amountErr" class="__err">{{ amountErr }}</span>
            </div>
            <vite-input v-model="amount" :valid="validAmount" @input="noAll"
                        :placeholder="confirmText.amountPlaceholder">
                <span slot="after" @click="all" class="all-wrapper">
                    <span class="all">{{ $t('tradeAssets.all') }}</span>
                </span>
            </vite-input>
        </div>

        <div v-if="isLockVX">
            <div class="__hint distance"><span>{{ $t('tradeDividend.addHint1') }}</span></div>
            <div class="__hint"><span>{{ $t('tradeDividend.addHint2') }}</span></div>
            <div class="__hint"><span>{{ $t('tradeDividend.addHint3') }}</span></div>
        </div>
        <div v-else>
            <div class="__hint distance"><span>{{ $t('tradeDividend.unlockVXConfirm.hint') }}</span></div>
        </div>
    </confirm>
</template>

<script>
import bigNumber from '@utils/bigNumber';
import viteInput from '@components/viteInput.vue';
import confirm from '@pc/components/confirm/confirm.vue';
import { verifyAmount } from '@pc/utils/validations';
import { initPwd } from '@pc/components/password/index.js';
import { lockVxForDividend } from '@pc/services/tradeOperation';

export default {
    components: { confirm, viteInput },
    data() {
        return {
            isLockVX: true,
            isShow: false,
            amount: '',
            amountErr: '',
            isAll: false
        };
    },
    computed: {
        vxTokenInfo() {
            return this.$store.getters.vxTokenInfo || {};
        },
        vxTokenDecimals() {
            return this.vxTokenInfo.decimals;
        },
        confirmText() {
            if (this.isLockVX) {
                return {
                    title: this.$t('tradeDividend.lockVXConfirm.title'),
                    submit: this.$t('tradeDividend.lockVXConfirm.submit'),
                    available: this.$t('tradeDividend.lockVXConfirm.available'),
                    notEnough: this.$t('tradeDividend.lockVXConfirm.notEnough'),
                    amountPlaceholder: this.$t('tradeDividend.lockVXConfirm.amountPlaceholder'),
                    amountText: this.$t('tradeDividend.lockVXConfirm.amountText')
                };
            }
            return {
                title: this.$t('tradeDividend.unlockVXConfirm.title'),
                submit: this.$t('tradeDividend.unlockVXConfirm.submit'),
                available: this.$t('tradeDividend.unlockVXConfirm.available'),
                notEnough: this.$t('tradeDividend.unlockVXConfirm.notEnough'),
                amountPlaceholder: this.$t('tradeDividend.unlockVXConfirm.amountPlaceholder'),
                amountText: this.$t('tradeDividend.unlockVXConfirm.amountText')
            };
        },
        vxBalanceInfo() {
            return this.$store.getters.exVXBalanceInfo || {};
        },
        availableAmount() {
            return this.isLockVX
                ? this.vxBalanceInfo.available || 0
                : this.vxBalanceInfo.vxLocked || 0;
        },
        basicAvailableAmount() {
            return bigNumber.toBasic(this.availableAmount, this.vxTokenDecimals);
        },
        canSubmit() {
            return +this.amount && !this.amountErr;
        }
    },
    methods: {
        validAmount() {
            this.amountErr = verifyAmount({
                minAmount: bigNumber.toMin(1, this.vxTokenDecimals),
                formatDecimals: 8,
                decimals: this.vxTokenDecimals,
                balance: this.availableAmount,
                errorMap: {
                    notEnough: this.confirmText.notEnough,
                    lessMin: this.$t('tradeDividend.lessMin')
                }
            })(this.amount);
            return !this.amountErr;
        },
        noAll() {
            this.isAll = false;
        },
        all() {
            if (!+this.availableAmount) {
                return;
            }
            this.isAll = true;
            this.amount = bigNumber.toBasic(this.availableAmount, this.vxTokenDecimals);
        },
        show(isLockVX) {
            this.isLockVX = isLockVX;
            this.isShow = true;
        },
        close() {
            this.isShow = false;
            this.amount = '';
            this.isAll = false;
        },
        submit() {
            const actionType = this.isLockVX ? 1 : 2;
            const amount = this.isAll ? this.availableAmount : bigNumber.toMin(this.amount, this.vxTokenDecimals);

            initPwd({
                submit: () => {
                    lockVxForDividend({ actionType, amount }).then(() => {
                        this.$toast(this.$t('hint.operateSuccess'));
                        this.close();
                    }).catch(err => {
                        this.$toast(this.$t('hint.operateFail'), err);
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@use "@assets/scss/theme.scss" as *;
.__hint {
    &.distance {
        margin-top: 20px;
    }
    margin-top: 6px;
}
.all-wrapper {
    // color: #00BEFF;
    @include primary_color();
    font-size: 12px;
    margin: 0 15px;
    cursor: pointer;
    .all {
        border-bottom: 1px dashed #00BEFF;
        @include primary_border_color();
    }
}
</style>
