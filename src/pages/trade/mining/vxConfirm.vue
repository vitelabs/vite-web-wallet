<template>
    <confirm :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="_close"
             :leftBtnClick="staking" :leftBtnTxt="btnText"
             :singleBtn="true" :btnUnuse="!canOrder">
        <div v-if="isAdd" class="__row">
            <div class="__row-t">{{ $t('tokenCard.heads.availableExAmount') }}</div>
            <div class="__unuse-row">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ exViteBalance }}</span>
            </div>
        </div>

        <div v-if="!isAdd" class="__row">
            <div class="__row-t">{{ $t('tradeMining.stakingBalance') }}</div>
            <div class="__unuse-row">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ stakingAmount }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row-t">
                {{ $t('wallet.sum') }}
                <span v-show="amountErr" class="__err __hint">{{ amountErr }}</span>
            </div>
            <vite-input v-model="amount" :valid="testAmount" :placeholder="placeholder"></vite-input>
        </div>

        <div class="hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm.vue';
import viteInput from 'components/viteInput';
import bigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';

const minLimit = 134;

export default {
    components: { confirm, viteInput },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        stakingObj: {
            type: Object,
            default: null
        },
        actionType: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            amount: '',
            amountErr: ''
        };
    },
    computed: {
        canOrder() {
            return this.amount && !this.amountErr;
        },
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        rawBalance() {
            if (!this.viteTokenInfo) {
                return null;
            }
            const list = this.$store.getters.exBalanceList;
            return list[this.viteTokenInfo.tokenId];
        },
        exViteBalance() {
            return this.rawBalance ? this.rawBalance.available : 0;
        },
        accountAddr() {
            return this.$store.getters.activeAddr;
        },
        stakingAmount() {
            if (this.isAdd || !this.stakingObj) {
                return 0;
            }
            return bigNumber.toBasic(this.stakingObj.amount, this.viteTokenInfo.decimals);
        },

        isAdd() {
            return +this.actionType === 1;
        },
        confirmTitle() {
            return this.isAdd ? this.$t('tradeMining.addTitle') : this.$t('tradeMining.withdrawTitle');
        },
        placeholder() {
            return this.isAdd ? this.$t('tradeMining.addPlaceHolder') : this.$t('tradeMining.withdrawPlaceHolder');
        },
        hint() {
            return this.isAdd ? this.$t('tradeMining.addHint') : this.$t('tradeMining.withdrawHint');
        },
        btnText() {
            return this.isAdd ? this.$t('tradeMining.addBtn') : this.$t('tradeMining.withdrawBtn');
        }
    },
    methods: {
        testAmount() {
            if (!this.amount) {
                this.amountErr = '';
                return true;
            }

            if (!this.viteTokenInfo) {
                this.amountErr = this.$t('hint.amtFormat');
                return false;
            }

            const result = this.$validAmount(this.amount, this.viteTokenInfo.decimals) === 0;

            if (!result) {
                this.amountErr = this.$t('hint.amtFormat');
                return false;
            }

            if (bigNumber.isEqual(this.amount, 0)) {
                this.amountErr = this.$t('wallet.hint.amount');
                return false;
            }

            if (bigNumber.compared(minLimit, this.amount) > 0) {
                this.amountErr = this.isAdd ? this.$t('walletQuota.cancelLimitAmt', { num: minLimit }) : this.$t('walletQuota.minAmt', { num: minLimit });
                return false;
            }

            if (this.isAdd && !this.rawBalance) {
                this.amountErr = this.$t('hint.insufficientBalance');
                return false;
            }

            if (!this.isAdd) {
                return this.testStakingAmount();
            }

            const amount = bigNumber.toMin(this.amount, this.viteTokenInfo.decimals);
            if (bigNumber.compared(this.rawBalance.availableExAmount, amount) < 0) {
                this.amountErr = this.$t('hint.insufficientBalance');
                return false;
            }

            this.amountErr = '';
            return true;
        },
        testStakingAmount() {
            const minAmount = minLimit;
            const stakingAmount = this.stakingObj.amount;
            const amount = bigNumber.toMin(this.amount, this.viteTokenInfo.decimals);

            const compareStakingAndMin = bigNumber.compared(stakingAmount, minAmount);
            if (compareStakingAndMin < 0) {
                this.amountErr = `${ this.$t('walletQuota.minAmt', { num: minAmount }) }, ${ this.$t('walletQuota.gotoStake') }`;
                return false;
            }

            const compareMin = bigNumber.compared(amount, minAmount);
            if (compareMin < 0) {
                this.amountErr = this.$t('walletQuota.minAmt', { num: minAmount });
                return false;
            }

            const compareStaking = bigNumber.compared(stakingAmount, amount);
            if (compareStaking < 0) {
                this.amountErr = this.$t('walletQuota.maxAmt', {
                    minAmount,
                    maxAmount: bigNumber.toBasic(stakingAmount, this.viteTokenInfo.decimals)
                });
                return false;
            }

            const maxAmount = bigNumber.minus(stakingAmount, minAmount, 8, 'nofix');
            const cancelBalance = bigNumber.minus(stakingAmount, amount);

            if (bigNumber.compared(amount, maxAmount) > 0 && !bigNumber.isEqual(cancelBalance, 0)) {
                this.amountErr = this.$t('walletQuota.cancelLimitAmt', { num: minAmount });
                return false;
            }

            this.amountErr = '';
            return true;
        },

        _close() {
            this.amount = '';
            this.amountErr = '';
            this.close && this.close();
        },
        staking() {
            const amount = bigNumber.toMin(this.amount, this.viteTokenInfo.decimals);

            sendTx({methodName:'dexFundPledgeForVx', data:{
                amount,
                actionType: this.actionType
            }}).then(() => {
                if (this.isAdd) {
                    this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }));
                } else {
                    this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
                }
                this._close();
            }).catch(err => {
                console.warn(err);
                if (this.isAdd) {
                    this.$toast(this.$t('walletQuota.pledgeFail'), err);
                } else {
                    this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/confirmInput.scss";

.__icon{
    margin-right: 10px;
}
</style>
