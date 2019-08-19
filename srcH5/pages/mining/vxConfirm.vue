<template>
    <confirm :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="_close"
             :leftBtnClick="staking" :leftBtnTxt="btnText"
             :singleBtn="true" :btnUnuse="!canOrder">
        <div v-if="isAdd" class="__row">
            <div class="__row_t">{{ $t('tokenCard.heads.availableExAmount') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ exViteBalance }}</span>
            </div>
        </div>

        <div v-if="!isAdd" class="__row">
            <div class="__row_t">{{ $t('tradeMining.stakingBalance') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ stakingAmount }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t('wallet.sum') }}
                <span v-show="amountErr" class="__err">{{ amountErr }}</span>
            </div>
            <vite-input v-model="amount" :valid="testAmount" :placeholder="placeholder"></vite-input>
        </div>

        <div class="__hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import sendTx from 'utils/sendTx';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import { verifyAmount, verifyWithdrawAmount } from 'utils/validations';
import router from 'router';

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
            if (!this.viteTokenInfo) {
                this.amountErr = this.$t('hint.amtFormat');
                return false;
            }

            if (this.isAdd) {
                this.amountErr = verifyAmount({
                    decimals: this.viteTokenInfo.decimals,
                    formatDecimals: 8,
                    minAmount: bigNumber.toMin(minLimit, this.viteTokenInfo.decimals),
                    balance: this.rawBalance ? this.rawBalance.availableExAmount || 0 : 0,
                    errorMap: {
                        less0: this.$t('wallet.hint.amount'),
                        lessMin: this.$t('walletQuota.cancelLimitAmt', { num: minLimit })
                    }
                })(this.amount);
            } else {
                this.amountErr = verifyWithdrawAmount({
                    stakingAmount: this.stakingObj ? this.stakingObj.amount || 0 : 0,
                    decimals: this.viteTokenInfo.decimals
                }, this.amount);
            }

            return !this.amountErr;
        },


        _close() {
            this.amount = '';
            this.amountErr = '';
            this.close && this.close();
        },
        staking() {
            statistics.event(router.currentRoute.name, this.actionType === 1 ? 'addQuota-submit' : 'withdrawQuota-submit', this.accountAddr || '');

            const amount = bigNumber.toMin(this.amount, this.viteTokenInfo.decimals);

            sendTx({
                methodName: 'dexFundPledgeForVx',
                data: {
                    amount,
                    actionType: this.actionType
                }
            }).then(() => {
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
