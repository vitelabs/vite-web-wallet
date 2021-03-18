<template lang="pug">
extends /components/dialog/base.pug
block head
    .head(v-if="multiNetwork && multiNetwork.length")
        div
            select-network(v-model="selectedNetwork" :list="multiNetwork" @change="onChangeNetwork")
block content
    div.ex-center-loading(v-show="loading")
        loading(loadingType="dot")
    div(v-show="!loading")
        .__row
            tips(v-if="info.noticeMsg" class="tips") {{info.noticeMsg}}
        .__row
            .__row_t {{$t("tokenCard.withdraw.labels.balance")}}
            .__input_row.__unuse_input.__bold
                img.__icon(:src="token.icon||getIcon(token.tokenId)")
                span.__right {{token.balance||'0'}}
        .__row
            .__row_t {{$t("tokenCard.withdraw.labels.address")}}
                .__err {{isAddrCorrect?'':$t("tokenCard.withdraw.addressErr")}}
            vite-input(v-model="withdrawAddr" :placeholder="$t('tokenCard.withdraw.addressPlaceholder', {token: tokenSymbol})")
        .__row(v-if="showLabel")
            .__row_t {{info.labelName}}
            vite-input(v-model="labelValue" :placeholder="$t('tokenCard.withdraw.labelPlaceholder',{labelName:info.labelName})")
        .__row
            .__row_t {{$t("tokenCard.withdraw.labels.amount")}}
                .__err {{ammountErr}}
            vite-input(v-model="withdrawAmount" :placeholder="$t('tokenCard.withdraw.amountPlaceholder',{min})")
                span.__all_wrapper.__pointer(slot="after" @click="withdrawAll")
                    span.__all {{$t("tokenCard.withdraw.labels.all")}}
        .__row
            .__row_t {{$t("tokenCard.withdraw.labels.fee")}}
                i(class="tipsicon hoveraction" @click.self.stop="toggleTips")
                    tooltips(v-show="isFeeTipsShow" v-click-outside="hideTips" :content="$t('tokenCard.withdraw.feeTips')" class="fee-tips")
            .__input_row.__unuse_input.__bold  {{ $t("tokenCard.withdraw.labels.fee") }}
                .__right {{( fee||'--') }} <span class="light">{{token.tokenSymbol}}</span>
        .__hint.__err(v-if="failTips")
            span {{ failTips }}
</template>

<script>
import { verifyAddr, getWithdrawInfo, getWithdrawFee, withdraw, getMetaInfo } from 'pcServices/gate';
import tips from 'pcComponents/tips';
import debounce from 'lodash/debounce';
import { getValidBalance } from 'pcUtils/validations';
import bigNumber from 'utils/bigNumber';
import tooltips from 'components/tooltips';
import { getTokenIcon } from 'utils/tokenParser';
import { execWithValid } from 'pcUtils/execWithValid';
import viteInput from 'components/viteInput';
import selectNetwork from './selectNetwork';
import loading from 'components/loading';

export default {
    components: { tooltips, viteInput, selectNetwork, loading, tips },
    props: {
        token: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            info: {
                'minimumWithdrawAmount': '',
                'maximumWithdrawAmount': '',
                'gatewayAddress': '',
                'noticeMsg': ''
            },
            type: -1,
            labelValue: '',
            withdrawAddr: '',
            withdrawAmountMin: '',
            withdrawAmount: '',
            feeMin: '',
            isAddrCorrect: true,
            dTitle: this.$t('tokenCard.withdraw.title'),
            dSTxt: this.$t('tokenCard.withdraw.btn'),
            failTips: '',
            isFeeTipsShow: false,
            fetchingFee: true,
            verifingAddr: false,
            loading: true,
            selectedNetwork: 0
        };
    },
    beforeMount() {
        this.getWithdrawInfo();
    },
    computed: {
        showLabel() {
            return this.type === 1 && this.info.labelName;
        },
        fee() {
            return bigNumber.toBasic(this.feeMin, this.token.decimals);
        },
        ammountErr() {
            if (!this.withdrawAmount) {
                return;
            }
            return this.validateAmount(this.withdrawAmount);
        },
        dBtnUnuse() {
            return this.loading || this.ammountErr || !this.isAddrCorrect || !this.withdrawAmount || !this.withdrawAddr || this.verifingAddr || this.fetchingFee;
        },
        min() {
            return this.info.minimumWithdrawAmount ? `${ bigNumber.toBasic(this.info.minimumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` : '--';
        },
        defaultAddr() {
            return this.$store.getters.activeAddr;
        },
        multiNetwork() {
            return this.token.gateInfo.multiNetwork;
        },
        gateInfo() {
            if (this.multiNetwork && this.multiNetwork.length) {
                return this.multiNetwork[this.selectedNetwork];
            }
            return this.token.gateInfo;
        },
        tokenSymbol() {
            if (this.multiNetwork && this.multiNetwork.length) {
                return `${ this.token.tokenSymbol } (${ this.gateInfo.standard }) `;
            }
            return this.token.tokenSymbol;
        }
    },
    watch: {
        withdrawAddr: debounce(function (val) {
            if (!val) {
                this.isAddrCorrect = true;
                return;
            }
            this.verifingAddr = true;
            verifyAddr({
                tokenId: this.token.tokenId,
                withdrawAddress: val,
                label: this.showLabel ? this.labelValue : undefined
            },
            this.gateInfo.url)
                .then(d => {
                    this.isAddrCorrect = d.isValidAddress;
                    this.verifingAddr = false;
                });
        }, 500),
        labelValue: debounce(function (val) {
            if (!val) {
                this.isAddrCorrect = true;
                return;
            }
            this.verifingAddr = true;
            verifyAddr({
                tokenId: this.token.tokenId,
                withdrawAddress: this.withdrawAddr,
                label: this.showLabel ? val : undefined
            },
            this.gateInfo.url).then(d => {
                this.isAddrCorrect = d.isValidAddress;
                this.verifingAddr = false;
            });
        }, 500),
        withdrawAmount: debounce(function (val) {
            this.withdrawAmountMin = '';// 重置从全部提现过来的数据。
            this.fetchingFee = true;
            getWithdrawFee({
                tokenId: this.token.tokenId,
                walletAddress: this.defaultAddr,
                amount: bigNumber.toMin(val, this.token.decimals)
            },
            this.gateInfo.url).then(d => {
                this.feeMin = d.fee;
                this.fetchingFee = false;
            });
        }, 500)
    },
    methods: {
        getIcon(id) {
            return getTokenIcon(id);
        },
        toggleTips() {
            this.isFeeTipsShow = !this.isFeeTipsShow;
        },
        hideTips() {
            this.isFeeTipsShow = false;
        },
        validateAmount(val) {
            const errorMap = {
                notEnough: this.$t('tokenCard.withdraw.balanceErrMap.notEnough'),
                overMax: this.$t('tokenCard.withdraw.balanceErrMap.overMax', { max: `${ bigNumber.toBasic(this.info.maximumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` }),
                lessMin: this.$t('tokenCard.withdraw.balanceErrMap.lessMin', { min: `${ bigNumber.toBasic(this.info.minimumWithdrawAmount, this.token.decimals) } ${ this.token.tokenSymbol }` })
            };
            return getValidBalance({
                balance: bigNumber.minus(this.token.totalAmount || 0, this.feeMin),
                decimals: this.token.decimals,
                minNum: this.info.minimumWithdrawAmount,
                maxNum: this.info.maximumWithdrawAmount,
                errorMap
            })(val);
        },
        withdrawAll() {
            if (this.token.totalAmount && bigNumber.compared(this.token.totalAmount, '0') > 0) {
                this.fetchingFee = true;
                getWithdrawFee({
                    tokenId: this.token.tokenId,
                    walletAddress: this.defaultAddr,
                    amount: this.token.totalAmount,
                    containsFee: true
                },
                this.gateInfo.url).then(d => {
                    this.feeMin = d.fee;
                    this.fetchingFee = false;
                    this.withdrawAmountMin = bigNumber.minus(this.token.totalAmount, this.feeMin);
                    this.withdrawAmount = bigNumber.toBasic(this.withdrawAmountMin, this.token.decimals);
                });
            }
        },
        inspector: execWithValid(function () {
            return new Promise((res, rej) => {
                withdraw({
                    fee: this.feeMin,
                    amount: bigNumber.plus(this.withdrawAmountMin || bigNumber.toMin(this.withdrawAmount, this.token.decimals),
                        this.feeMin, 0),
                    withdrawAddress: this.withdrawAddr,
                    gateAddr: this.info.gatewayAddress,
                    tokenId: this.token.tokenId,
                    labelValue: this.labelValue,
                    type: this.type,
                    labelName: this.info.labelName
                },
                this.gateInfo.url)
                    .then(d => {
                        this.$toast(this.$t('tokenCard.withdraw.successTips'));
                        res(d);
                    })
                    .catch(e => {
                        this.failTips = this.$t('tokenCard.withdraw.failTips');
                        rej(e);
                    });
            });
        }),
        getWithdrawInfo() {
            this.loading = true;
            this.clearData();
            Promise.all([
                getMetaInfo({ tokenId: this.token.tokenId }, this.gateInfo.url).then(res => {
                    this.type = res.type;
                }),
                getWithdrawInfo({ walletAddress: this.defaultAddr, tokenId: this.token.tokenId },
                    this.gateInfo.url)
                    .then(data => (this.info = data)) ])
                .then(() => (this.loading = false));
        },
        onChangeNetwork() {
            this.getWithdrawInfo();
        },
        clearData() {
            this.info = {
                'minimumWithdrawAmount': '',
                'maximumWithdrawAmount': '',
                'gatewayAddress': '',
                'noticeMsg': ''
            };
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
@import "pcComponents/confirm/confirmRow.scss";

.__row {
    overflow: visible;
    .__row_t {
        overflow: visible;
    }
}

.hoveraction {
    &.tipsicon {
        margin-left: 4px;
        background-repeat: no-repeat;
        position: relative;
        display: inline-block;
        background: url(~assets/imgs/hover_help.svg);
        overflow: visible;
        width: 16px;
        height: 16px;
        vertical-align: sub;
        cursor: pointer;
        .fee-tips{
            color: #5E6875;
            min-width: 170px;
            @include font-family-normal();
            left: 30px;
        }
    }
}

.ex-center-loading {
    text-align: center;
}

.head {
    padding: 0 30px 20px 30px;
    box-sizing: border-box;
    [data-theme="0"] & {
        border-bottom: 1px solid rgba(212, 222, 231, 1);
        background: rgba(0, 122, 255, 0.05);
    }
    [data-theme="1"] & {
        background: $black-color-3;
    }
}
</style>
