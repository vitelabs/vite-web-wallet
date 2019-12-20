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
import { initPwd } from 'pcComponents/password/index.js';
import sendTx from 'pcUtils/sendTx';
import confirm from 'components/confirm/confirm.vue';

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
            return this.activeItem.amount || 0;
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

            sendTx({
                methodName: 'callContract',
                data: {
                    toAddress: 'vite_aef2d0c5965e680368064f61891bc89a051a88468624f03467',
                    abi: { 'inputs': [{ 'name': 'id', 'type': 'bytes32' }], 'name': 'cancelStake', 'payable': false, 'type': 'function' },
                    params: [this.activeItem.sendHash]
                }
            }).then(() => {
                this.close();
                this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
            }).catch(err => {
                console.warn(err);
                this.close();
                this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
            });
        }
    }
};
</script>
