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
import { constant } from '@vite/vitejs';
import viteInput from 'components/viteInput';
import confirm from 'h5Components/confirm/confirm.vue';
import bigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'h5Utils/sendTx';
import { verifyAmount, verifyWithdrawAmount } from 'h5Utils/validations';

const Vite_Token_Info = constant.Vite_Token_Info;
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
        viteTokenInfo() {
            return this.$store.state.env.tokenMap[Vite_Token_Info.tokenId];
        },
        canOrder() {
            return this.amount && !this.amountErr;
        },
        rawBalance() {
            const list = this.$store.getters.exBalanceList;
            return list[Vite_Token_Info.tokenId];
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
            return bigNumber.toBasic(this.stakingObj.amount, Vite_Token_Info.decimals);
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
            if (this.isAdd) {
                this.amountErr = verifyAmount({
                    decimals: Vite_Token_Info.decimals,
                    formatDecimals: 8,
                    minAmount: bigNumber.toMin(minLimit, Vite_Token_Info.decimals),
                    balance: this.rawBalance ? this.rawBalance.availableExAmount || 0 : 0,
                    errorMap: {
                        less0: this.$t('wallet.hint.amount'),
                        lessMin: this.$t('walletQuota.cancelLimitAmt', { num: minLimit })
                    }
                })(this.amount);
            } else {
                this.amountErr = verifyWithdrawAmount({
                    stakingAmount: this.stakingObj ? this.stakingObj.amount || 0 : 0,
                    decimals: Vite_Token_Info.decimals
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
            statistics.event(this.$route.name, this.actionType === 1 ? 'addQuota-submit' : 'withdrawQuota-submit', this.accountAddr || '');

            const amount = bigNumber.toMin(this.amount, Vite_Token_Info.decimals);

            sendTx({
                methodName: 'dexFundPledgeForVx',
                data: {
                    amount,
                    actionType: this.actionType
                }
            }).then(() => {
                // if (this.isAdd) {
                //     this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }));
                // } else {
                //     this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
                // }
                this._close();
            }).catch(err => {
                alert(JSON.stringify(err));
                console.warn(err);
                // if (this.isAdd) {
                //     this.$toast(this.$t('walletQuota.pledgeFail'), err);
                // } else {
                //     this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
                // }
            });
        }
    }
};
</script>
