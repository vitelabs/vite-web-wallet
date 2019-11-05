<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper(v-if="!isSVip")
        .block__title {{ $t('tokenCard.heads.availableExAmount') }}
        .block__content.edit.space
            .token__title
                img(:src="viteTokenInfo.icon")
                .symbol VITE
            .right.blue {{exViteBalance}}
        .block__title {{ $t('trade.svipConfirm.openStakingAmount') }}
            .err(v-if="dBtnUnuse") {{$t('trade.vipConfirm.noBalance')}}
        .block__content.edit {{vipStakingAmount}} VITE
        .charge-tips {{tip}}
            .dot
    .content-wrapper(v-else)
        .block__title {{ $t('trade.svipConfirm.cancelStakingAmount') }}
            .err(v-if="dBtnUnuse") {{$t('walletQuota.list.unexpired')}}
        .block__content.edit {{vipStakingAmount}} VITE
        .charge-tips {{tip}}
            .dot

</template>

<script>
import debounce from 'lodash/debounce';
import BigNumber from 'utils/bigNumber';
import { execWithValid } from 'pcUtils/execWithValid';
import { pledgeForSuperVIp } from 'pcServices/tradeOperation';
import { constant } from '@vite/vitejs';
import date from 'utils/date';
import { viteClient } from 'services/apiServer';

const Vite_Token_Info = constant.Vite_Token_Info;
const vipStakingAmount = 1000000;

export default {
    data() {
        return {
            stakeAmount: '',
            stakingObj: {},
            isAddrCorrect: true,
            loading: true,
            vipStakingAmount
        };
    },
    beforeMount() {
        this.$store.dispatch('startLoopHeight');
        this.fetchStakingObj();
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        },
        tip() {
            return this.isSVip ? this.$t('trade.svipConfirm.cancelHint', { time: this.stakingObj.withdrawTime ? date(this.stakingObj.withdrawTime * 1000, ' Pzh') : '' }) : this.$t('trade.svipConfirm.openHint');
        },
        dTitle() {
            return this.isSVip ? this.$t('trade.svipConfirm.cancelVip') : this.$t('trade.svipConfirm.openVip');
        },
        dSTxt() {
            return this.isSVip ? this.$t('trade.svipConfirm.cancelVip') : this.$t('trade.svipConfirm.openVip');
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        ammountErr() {
            if (!this.withdrawAmount) {
                return;
            }
            return this.validateAmount(this.withdrawAmount);
        },
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        dBtnUnuse() {
            if (this.isSVip) {
                return !(this.stakingObj && this.stakingObj.withdrawHeight <= this.height);
            }

            if (!this.rawBalance || !+this.rawBalance.availableExAmount) {
                return true;
            }

            const minAmount = BigNumber.toMin(vipStakingAmount, Vite_Token_Info.decimals);
            return BigNumber.compared(minAmount, this.rawBalance.availableExAmount) > 0;
        },
        address() {
            return this.$store.getters.activeAddr;
        },
        rawBalance() {
            const list = this.$store.getters.exBalanceList;
            return list[Vite_Token_Info.tokenId];
        },
        exViteBalance() {
            return this.rawBalance ? this.rawBalance.available : 0;
        }
    },
    watch: {
        withdrawAmount: debounce(function () {
            this.withdrawAmountMin = '';// 重置从全部提现过来的数据。
            this.fetchingFee = true;
        }, 500)
    },
    methods: {
        fetchStakingObj() {
            if (!this.isSVip) {
                return;
            }

            viteClient.request('pledge_getAgentPledgeInfo', {
                pledgeAddr: this.address,
                agentAddr: constant.DexFund_Addr,
                beneficialAddr: constant.DexFund_Addr,
                bid: 3
            }).then(data => {
                this.stakingObj = data;
            }).catch(err => {
                console.warn(err);
            });
        },
        inspector: execWithValid(function () {
            return new Promise((res, rej) => {
                const actionType = this.isSVip ? 2 : 1;
                this.isLoading = true;
                pledgeForSuperVIp({ actionType }).then(() => {
                    this.isLoading = false;
                    this.$toast(this.isSVip ? this.$t('trade.svipConfirm.cancelSuccess') : this.$t('trade.svipConfirm.openSuccess'));
                    res();
                }).catch(err => {
                    console.warn(err);
                    this.isLoading = false;
                    this.$toast(this.isSVip ? this.$t('trade.svipConfirm.cancelFail') : this.$t('trade.svipConfirm.openFail'));
                    rej();
                });
            });
        })
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";
.block__title {
    height: 16px;
    font-size: 12px;
    @include font-family-bold();
    color: rgba(29, 32, 36, 1);
    line-height: 16px;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .err {
        color: #ff2929;
        font-size: 12px;
    }
    &:first-child {
        margin-top: 0;
    }
}

.block__content {
    position: relative;
    border-radius: 2px;
    border: 1px solid rgba(212, 222, 231, 1);
    font-size: 12px;
    word-break: break-word;
    width: 100%;
    box-sizing: border-box;
    margin-top: 16px;
    padding: 7px 15px;
    align-items: center;
    display: flex;
    width: 100%;
    justify-content: space-between;
    .token__title {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 20px;
            height: 20px;
            margin-right: 20px;
        }
    }
    input {
        width: 100%;
    }
    .light {
        color: #5e6875;
    }
    .blue {
        color: #007aff;
    }
    &.edit {
        text-align: left;
        background: rgba(243, 246, 249, 1);
        @include font-family-bold();
    }
}
.charge-tips {
    @include font-family-normal();
    line-height: 16px;
    font-size: 12px;
    color: rgba(94, 104, 117, 1);
    padding-left: 13px;
    margin-top: 10px;
    position: relative;
    width: 100%;
    margin-top: 20px;
    &:first-child {
        margin-top: 0px;
    }
    .strong {
        color: #007aff;
        @include font-family-bold();
    }
    .dot {
        width: 4px;
        height: 4px;
        background: rgba(0, 122, 255, 1);
        border-radius: 100%;
        position: absolute;
        left: 0;
        top: 4px;
    }
}
</style>

