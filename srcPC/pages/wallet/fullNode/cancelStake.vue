<template>
    <confirm v-if="isShowCancelConfirm" class="small"
             :title="$t(`walletQuota.withdrawalStaking`)" :closeIcon="false" :showMask="true"
             :leftBtnTxt="$t(`walletQuota.confirm.cancel.leftBtn`)" :leftBtnClick="close"
             :rightBtnTxt="$t(`walletQuota.confirm.cancel.rightBtn`)"
             :rightBtnClick="submit">
        <div class="__row">
            <div class="__row_t">
                {{ $t(`walletQuota.confirm.cancel.describe`, { amount: activeItem.showAmount }) }}
            </div>
            <div class="__input_row __unuse_input">{{ activeItem.showAmount }} VITE</div>
        </div>
    </confirm>
</template>

<script>
import sendTx from '@pc/utils/sendTx';
import confirm from '@pc/components/confirm/confirm.vue';
import { initPwd } from '@pc/components/password/index.js';
import { customContracts } from '@services/apiServer';
import { getAccountBlockByHash } from '@services/viteServer';

export default {
    components: { confirm },
    data() {
        return {
            activeItem: null,
            isShowCancelConfirm: false
        };
    },
    computed: {
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

            const sendHash = this.activeItem.rawData.sendHash;
            let contractAddress = customContracts.FullNodeCancelStake.contractAddress;
            getAccountBlockByHash(sendHash).then(data => {
                if (data.toAddress && data.toAddress !== contractAddress) {
                    contractAddress = data.toAddress;
                }
                sendTx({
                    methodName: 'callContract',
                    data: {
                        toAddress: contractAddress,
                        abi: customContracts.FullNodeCancelStake.abi,
                        params: [this.activeItem.rawData.sendHash]
                    }
                }).then(() => {
                    this.close();
                    this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
                }).catch(err => {
                    console.warn(err);
                    this.close();
                    this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
                });
            });
        }
    }
};
</script>
