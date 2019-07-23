<template>
    <div class="quota-wrapper">
        <quota-head></quota-head>

        <loading v-if="loadingToken" class="loading"></loading>

        <confirm v-if="showConfirmType && showConfirmType === 'cancel'" class="small"
                 :title="$t(`walletQuota.withdrawalStaking`)" :closeIcon="false" :showMask="true"
                 :leftBtnTxt="$t(`walletQuota.confirm.cancel.leftBtn`)" :leftBtnClick="closeConfirm"
                 :rightBtnTxt="$t(`walletQuota.confirm.cancel.rightBtn`)"
                 :rightBtnClick="submit" :btnUnuse="!!cancelUnuse">
            {{ $t(`walletQuota.confirm.cancel.describe`, { amount: showStakingAmount }) }}
            <div class="cancel-amount" v-show="amountErr">{{ amountErr }}</div>
            <vite-input class="cancel-input" v-model="cancelAmount" :valid="testAmount"
                        :placeholder="$t('walletQuota.inputWithdrawAmount')"></vite-input>
        </confirm>

        <div v-show="!loadingToken" class="content">
            <my-quota class="my-quota _content_border"></my-quota>
            <pledge-tx class="pledge-tx"
                       :sendPledgeTx="sendPledgeTx" :tokenInfo="tokenInfo"></pledge-tx>
        </div>

        <list v-show="!loadingToken" ref="txList" :sendPledgeTx="sendPledgeTx"
              :tokenInfo="tokenInfo"
              :showConfirm="showConfirm"></list>
    </div>
</template>

<script>
import Vue from 'vue';
import quotaHead from './quotaHead';
import myQuota from './myQuota';
import pledgeTx from './pledgeTx';
import list from './list';
import confirm from 'components/confirm/confirm.vue';
import loading from 'components/loading';
import viteInput from 'components/viteInput';
import { initPwd } from 'components/password/index.js';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';
import { verifyWithdrawAmount } from 'utils/validations';
import { execWithValid } from 'utils/execWithValid';

export default {
    components: { quotaHead, myQuota, pledgeTx, confirm, list, loading, viteInput },
    created() {
        this.tokenInfo = this.$store.getters.viteTokenInfo;

        if (!this.tokenInfo) {
            this.loadingToken = true;
            this.$store.dispatch('fetchTokenInfo').then(tokenInfo => {
                this.loadingToken = false;
                this.tokenInfo = tokenInfo;
            })
                .catch(err => {
                    console.warn(err);
                });
        }
    },
    data() {
        return {
            tokenInfo: {},
            loadingToken: false,
            showConfirmType: '',

            stakingAmount: '',
            cancelAmount: '',
            amountErr: '',
            stopWatch: false
        };
    },
    computed: {
        cancelUnuse() {
            return this.showConfirmType === 'cancel' && (!this.cancelAmount || this.amountErr);
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        },
        showStakingAmount() {
            if (!this.stakingAmount) {
                return '';
            }
            return BigNumber.toBasic(this.stakingAmount || 0, this.tokenInfo.decimals);
        }
    },
    methods: {
        testAmount() {
            if (this.stopWatch) {
                return;
            }

            this.amountErr = verifyWithdrawAmount({
                stakingAmount: this.stakingAmount,
                decimals: this.tokenInfo.decimals
            }, this.cancelAmount);

            return !this.amountErr;
        },

        showConfirm(type, amount) {
            this.showConfirmType = type;
            if (!amount) {
                return;
            }
            this.stakingAmount = amount;
        },
        closeConfirm() {
            this.stopWatch = true;
            this.cancelAmount = '';
            this.amountErr = '';
            Vue.nextTick(() => {
                this.stopWatch = false;
            });
            this.showConfirmType = '';
        },
        submit: execWithValid(function () {
            this.testAmount();
            if (this.amountErr) {
                return;
            }

            const amount = this.cancelAmount;
            this.closeConfirm();

            initPwd({
                submit: () => {
                    const txListEle = this.$refs.txList;
                    if (!txListEle) {
                        return;
                    }
                    txListEle._sendCancelPledgeTx(amount);
                }
            });
        }),

        sendPledgeTx({ toAddress, amount }, type, cb) {
            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                cb && cb(false);
                return;
            }

            amount = BigNumber.toMin(amount || 0, this.tokenInfo.decimals);

            sendTx({
                methodName: type,
                data: {
                    tokenId: this.tokenInfo.tokenId,
                    toAddress,
                    amount
                },
                config: {
                    pow: true,
                    powConfig: {
                        cancel: () => {
                            cb && cb(false);
                        }
                    }
                }
            }).then(() => {
                cb && cb(true);
            }).catch(err => {
                console.warn(err);
                cb && cb(false, err);
            })
                .powSuccessed(() => {
                    this.closeConfirm();
                    cb && cb(true);
                })
                .powFailed(err => {
                    this.closeConfirm();
                    cb && cb(false, err);
                });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.quota-wrapper {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;

    .loading {
        width: 60px;
        height: 60px;
        margin-top: -30px;
        margin-left: -30px;
    }

    .cancel-amount {
        position: absolute;
        right: 30px;
        left: 30px;
        font-size: 12px;
        color: #ff2929;
        line-height: 22px;
        word-break: break-word;
    }

    .cancel-input {
        margin-top: 27px;
    }
}

.content {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 14px;

    ._content_border {
        background: #fff;
        box-shadow: 0px 2px 10px 1px rgba(176,192,237,0.42);
        border-radius: 2px;
    }

    .my-quota {
        box-sizing: border-box;
        min-width: 170px;
        margin-right: 10px;
        padding: 22px 30px;
    }

    .pledge-tx {
        flex: 1;
        max-width: 100%;
        box-sizing: border-box;
        padding: 6px 30px 20px 30px;
    }
}
</style>
