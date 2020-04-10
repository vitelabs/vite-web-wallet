<template lang="pug">
extends /components/dialog/base.pug
block content
    .__row
        .__row_t {{ $t('trade.openapi.stakingForQuota.agentAddress') }}
        .__input_row {{agentAddress}}
    .__row
        .__row_t {{ $t('trade.openapi.stakingForQuota.stakingAmount') }}
        .__input_row
            input(v-model="amount" type="number")
</template>

<script>
import viteInput from 'components/viteInput';
import { execWithValid } from 'pcUtils/execWithValid';
import { initPwd } from 'pcComponents/password/index.js';
import BigNumber from 'utils/bigNumber';
import { wallet, constant } from '@vite/vitejs';
import sendTx from 'pcUtils/sendTx';


const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { viteInput },
    props: { agentAddress: { type: String, default: null } },
    data() {
        return {
            dWidth: 'wide',
            dSTxt: this.$t('trade.openapi.stakingForQuota.ok'),
            amount: null,
            loading: false
        };
    },
    computed: {
        dTitle() {
            return this.$t('trade.openapi.stakingForQuota.title');
        },
        dBtnUnuse() {
            return this.loading || !this.amount;
        }
    },
    methods: {
        inspector() {
            return new Promise((resolve, reject) => {
                this._sendPledgeTx(resolve, reject);
            });
        },

        _sendPledgeTx: execWithValid(function (resolve, reject) {
            if (this.btnUnuse) {
                return;
            }

            initPwd({
                title: this.$t('submitStaking'),
                submitTxt: this.$t('walletQuota.confirm.submit.rightBtn'),
                cancelTxt: this.$t('walletQuota.confirm.submit.leftBtn'),
                content: this.$t('walletQuota.confirm.submit.describe', { amount: this.amount }),
                submit: () => {
                    this.sendPledgeTx(resolve, reject);
                }
            }, true);
        }),

        sendPledgeTx(resolve, reject) {
            this.loading = true;
            const amount = BigNumber.toMin(this.amount || 0, Vite_Token_Info.decimals);

            return sendTx({
                methodName: 'stakeForQuota',
                data: {
                    beneficiaryAddress: this.agentAddress,
                    amount
                },
                config: {
                    pow: true,
                    powConfig: {
                        cancel: () => {
                            this.loading = false;
                            reject();
                        }
                    }
                }
            }).then(() => {
                this.loading = false;
                this.$toast(this.$t('hint.request', { name: this.$t('submitStaking') }));
                resolve();
            }).catch(err => {
                console.warn(err);
                this.loading = false;
                err && this.$toast(this.$t('walletQuota.pledgeFail'), err);
                reject();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "pcComponents/confirm/confirmRow.scss";
@import "../../trust/dialog/confirm.scss";

.__row {
    .__input_row {
        @include gray_font_color_1();
    }
}

.key-confirm-tips {
    font-size: 13px;
    @include gray_font_color_1();
    ul {
        li {
            padding: 5px 0;
            list-style: disc inside;
        }
    }
}
</style>

