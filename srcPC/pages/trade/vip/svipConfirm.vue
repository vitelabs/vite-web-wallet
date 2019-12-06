<template lang="pug">
extends /components/dialog/base.pug
block content
    .content-wrapper
        .block__title {{ $t('tokenCard.heads.availableExAmount') }}
        .block__content.space
            .token__title
                img(:src="viteTokenInfo ? viteTokenInfo.icon : ''")
                .symbol VITE
            .right.blue {{exViteBalance}}
        .block__title {{ $t('tradeVip.svipConfirm.openStakingAmount') }}
            .err(v-if="isNoBalance") {{ $t('tradeVip.vipConfirm.noBalance') }}
        .block__content.edit 1,000,000 VITE
        .block__title {{ $t('tradeVip.svipConfirm.address') }}
            .err(v-if="!isAddress") {{ $t('hint.addrFormat') }}
        vite-input.block_input(v-model="inputAddress" :placeholder="$t('tradeVip.svipConfirm.addressPlaceholder')")
            span.all-wrapper(slot="after" @click="fillMyAddr")
                span.all {{ $t('walletQuota.myAddr') }}
        .charge-tips {{ $t('tradeVip.svipConfirm.openHint') }}
            .dot
</template>

<script>
import { constant, wallet } from '@vite/vitejs';
import BigNumber from 'utils/bigNumber';
import { stakeForSuperVIP, stakeForPrincipalSVIP } from 'pcServices/tradeOperation';
import viteInput from 'components/viteInput';
import { initPwd } from 'pcComponents/password/index.js';

const Vite_Token_Info = constant.Vite_Token_Info;
const vipStakingAmount = 1000000;

export default {
    components: { viteInput },
    data() {
        return {
            stakeAmount: '',
            isAddrCorrect: true,
            loading: true,
            vipStakingAmount,
            inputAddress: ''
        };
    },
    computed: {
        dTitle() {
            return this.$t('tradeVip.svipConfirm.openVip');
        },
        dSTxt() {
            return this.$t('tradeVip.svipConfirm.openVip');
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        isNoBalance() {
            if (!this.rawBalance || !+this.rawBalance.availableExAmount) {
                return true;
            }
            const minAmount = BigNumber.toMin(vipStakingAmount, Vite_Token_Info.decimals);
            return BigNumber.compared(minAmount, this.rawBalance.availableExAmount) > 0;
        },
        isAddress() {
            if (!this.inputAddress) {
                return true;
            }
            return wallet.isValidAddress(this.inputAddress);
        },
        dBtnUnuse() {
            return !this.inputAddress || !this.isAddress || this.isNoBalance;
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
    methods: {
        fillMyAddr() {
            this.inputAddress = this.address;
        },
        inspector() {
            return new Promise((res, rej) => {
                initPwd({
                    submit: () => {
                        this.isLoading = true;

                        const func = this.inputAddress === this.address
                            ? stakeForSuperVIP({ actionType: 1 })
                            : stakeForPrincipalSVIP({
                                actionType: 1,
                                principal: this.inputAddress
                            });
                        func.then(() => {
                            this.isLoading = false;
                            this.$toast(this.$t('tradeVip.svipConfirm.openSuccess'));
                            res();
                        }).catch(err => {
                            console.warn(err);
                            this.isLoading = false;
                            this.$toast(this.$t('tradeVip.svipConfirm.openFail'));
                            rej();
                        });
                    },
                    cancel: () => {
                        rej();
                    }
                });
            });
        }
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
        @include font-family-bold();
        img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
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
        color: #5e6875;
        @include font-family-normal();
    }
}
.block_input {
    margin-top: 12px;
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

.all-wrapper {
    color: #007AFF;
    font-size: 12px;
    margin: 0 15px;
    cursor: pointer;
    .all {
        border-bottom: 1px dashed #007AFF;
    }
}
</style>
