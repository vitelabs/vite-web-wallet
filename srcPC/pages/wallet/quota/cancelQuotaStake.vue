<template>
    <confirm v-if="isShowCancelConfirm" class="small"
             :title="$t(`walletQuota.withdrawalStaking`)" :closeIcon="false" :showMask="true"
             :leftBtnTxt="$t(`walletQuota.confirm.cancel.leftBtn`)" :leftBtnClick="close"
             :rightBtnTxt="$t(`walletQuota.confirm.cancel.rightBtn`)"
             :rightBtnClick="submit">
        <div class="__row">
            <div class="__row_t">
                {{ $t(`walletQuota.confirm.cancel.describe`, { amount: showStakingAmount }) }}
            </div>
            <div class="__input_row __unuse_input">{{ showStakingAmount }} VITE</div>
        </div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import { initPwd } from 'pcComponents/password/index.js';
import sendTx from 'pcUtils/sendTx';
import BigNumber from 'utils/bigNumber';
import confirm from 'pcComponents/confirm/confirm.vue';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { confirm },
    data() {
        return {
            activeItem: null,
            isShowCancelConfirm: false
        };
    },
    computed: {
        showStakingAmount() {
            if (!this.activeItem || !this.activeItem.amount) {
                return '';
            }
            return BigNumber.toBasic(this.activeItem.amount || 0, Vite_Token_Info.decimals);
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        address() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        show(cancelItem) {
            this.activeItem = cancelItem;
            this.isShowCancelConfirm = true;
        },
        close() {
            this.activeItem = null;
            this.isShowCancelConfirm = false;
        },
        submit() {
            initPwd({ submit: this._sendCancelPledgeTx.bind(this) });
        },
        _sendCancelPledgeTx() {
            this.isShowCancelConfirm = false;

            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                return;
            }

            if (!this.activeItem.rawData.id) {
                this.cancelQuotaStakeV2();
            }
            this.cancelQuotaStake();
        },
        cancelQuotaStakeV2() {
            sendTx({
                methodName: 'cancelQuotaStake_V2',
                data: {
                    beneficiaryAddress: this.address,
                    amount: this.activeItem.amount
                }
            }).then(() => {
                this.handleFinish(true);
            }).catch(err => {
                this.handleFinish(false, err);
            });
        },
        cancelQuotaStake() {
            sendTx({
                methodName: 'cancelQuotaStake',
                data: { id: this.activeItem.rawData.id }
            }).then(() => {
                this.handleFinish(true);
            }).catch(err => {
                this.handleFinish(false, err);
            });
        },
        handleFinish(result, err) {
            this.close();

            if (result) {
                this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
                return;
            }

            console.warn(err);
            this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
        }
    }
};
</script>
