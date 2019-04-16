<template>
    <div class="quota-wrapper __wrapper">
        <quota-head></quota-head>

        <loading v-if="loadingToken" class="loading"></loading>

        <div v-if="showConfirmType" class="gray-wrapper">
            <confirm v-if="showConfirmType === 'cancel'"
                     :title="$t(`walletQuota.withdrawalStaking`)" :closeIcon="false"
                     :leftBtnTxt="$t(`walletQuota.confirm.cancel.leftBtn`)" :leftBtnClick="closeConfirm"
                     :rightBtnTxt="$t(`walletQuota.confirm.cancel.rightBtn`)"
                     :rightBtnClick="submit" :btnUnuse="!!cancelUnuse">
                {{ $t(`walletQuota.confirm.cancel.describe`, { amount: activeAmountLimit }) }}
                <div class="cancel-amount" v-show="amountErr">{{ amountErr }}</div>
                <vite-input class="cancel-input" v-model="cancelAmount" :valid="testAmount"
                            :placeholder="$t('walletQuota.inputWithdrawAmount')"></vite-input>
            </confirm>
        </div>

        <div v-show="!loadingToken">
            <div class="content">
                <my-quota class="my-quota _content_border"></my-quota>
                <pledge-tx class="pledge-tx _content_border"
                           :sendPledgeTx="sendPledgeTx" :tokenInfo="tokenInfo"></pledge-tx>
            </div>

            <list ref="txList" :sendPledgeTx="sendPledgeTx"
                  :tokenInfo="tokenInfo"
                  :showConfirm="showConfirm"></list>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import quotaHead from './quotaHead';
import myQuota from './myQuota';
import pledgeTx from './pledgeTx';
import list from './list';
import confirm from 'components/confirm';
import loading from 'components/loading';
import viteInput from 'components/viteInput';
import sendTx from 'utils/sendTx';
import BigNumber from 'utils/bigNumber';

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
        const activeAccount = this.$wallet.getActiveAccount();

        return {
            activeAccount,
            tokenInfo: {},
            loadingToken: false,
            showConfirmType: '',

            activeAmountLimit: '',
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
        }
    },
    methods: {
        testAmount() {
            if (this.stopWatch) {
                return;
            }

            const result = this.$validAmount(this.cancelAmount, this.tokenInfo.decimals) === 0;
            if (!result) {
                this.amountErr = this.$t('hint.amtFormat');

                return false;
            }

            const isEqualBalance = BigNumber.compared(this.cancelAmount, this.activeAmountLimit);

            if (BigNumber.isEqual(this.cancelAmount, 0) || isEqualBalance > 0) {
                this.amountErr = this.$t('walletQuota.maxAmt', { amount: this.activeAmountLimit });

                return false;
            }

            const limitAmt = 1000;
            const cancelBalance = BigNumber.minus(this.activeAmountLimit, this.cancelAmount);
            if (BigNumber.compared(cancelBalance, limitAmt) < 0
                 && !BigNumber.isEqual(cancelBalance, 0)) {
                this.amountErr = this.$t('walletQuota.cancelLimitAmt', { num: limitAmt });

                return false;
            }

            this.amountErr = '';

            return true;
        },

        showConfirm(type, activeAmountLimit) {
            this.showConfirmType = type;
            if (!activeAmountLimit) {
                return;
            }
            this.activeAmountLimit = activeAmountLimit;
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
        submit() {
            this.testAmount();
            if (this.amountErr) {
                return;
            }

            const amount = this.cancelAmount;
            this.closeConfirm();

            this.activeAccount.initPwd({
                submit: () => {
                    const txListEle = this.$refs.txList;
                    if (!txListEle) {
                        return;
                    }
                    txListEle._sendCancelPledgeTx(amount);
                }
            });
        },

        sendPledgeTx({ toAddress, amount }, type, cb) {
            if (!this.netStatus) {
                this.$toast(this.$t('hint.noNet'));
                cb && cb(false);
                return;
            }

            this.activeAccount = this.$wallet.getActiveAccount();

            amount = BigNumber.toMin(amount || 0, this.tokenInfo.decimals);

            sendTx(this.activeAccount[type], {
                tokenId: this.tokenInfo.tokenId,
                toAddress,
                amount
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
                    console.warn(err);
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
    overflow: auto;
    height: 100%;

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
    margin-bottom: 40px;

    ._content_border {
        background: #fff;
        border: 1px solid #f6f5f5;
        box-shadow: 0 2px 48px 1px rgba(176, 192, 237, 0.42);
        border-radius: 2px;
    }

    .my-quota {
        box-sizing: border-box;
        min-width: 170px;
        margin-right: 40px;
        padding: 30px;
    }

    .pledge-tx {
        flex: 1;
        max-width: 100%;
        box-sizing: border-box;
        padding: 0 30px 30px 30px;
    }
}

.gray-wrapper {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
}

@media only screen and (max-width: 550px) {
    .content ._content_border {
        padding: 15px;
    }

    .content {
        margin-bottom: 20px;
    }

    .quota-wrapper {
        padding: 15px;
    }
}

@media only screen and (max-width: 950px) {
    .content .my-quota {
        margin-right: 0;
        width: 100%;
    }
}
</style>
