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
                <span class="__right">{{ availableAmount }}</span>
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
    </confirm>
</template>

<script>
import bigNumber from 'utils/bigNumber';
import viteInput from 'components/viteInput';
import confirm from 'components/confirm/confirm.vue';
import { verifyAmount } from 'pcUtils/validations';

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
                amountText: this.$t('tradeDividend.lockVXConfirm.amountText')
            };
        },
        vxBalanceInfo() {
            return this.$store.state.exchangeBalance.vxBalanceInfo || {};
        },
        availableAmount() {
            return this.isLockVX
                ? this.vxBalanceInfo.available || 0
                : this.vxBalanceInfo.vxLocked || 0;
        },
        canSubmit() {
            return +this.amount && !this.amountErr;
        }
    },
    methods: {
        validAmount() {
            this.amountErr = verifyAmount({
                minAmount: 1,
                formatDecimals: 8,
                decimals: this.vxTokenDecimals,
                balance: this.availableAmount,
                errorMap: { notEnough: this.confirmText.notEnough }
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
            if (this.isLockVX) {
                this.lockVX();
                return;
            }
            this.unlockVx();
        },
        lockVX() {},
        unlockVx() {}
    }
};
</script>

<style lang="scss" scoped>

.all-wrapper {
    color: #007AFF;
    font-size: 12px;
    margin: 0 15px;
    cursor: pointer;
    .all {
        border-bottom: 1px dashed #007AFF;
    }
}
</style>
