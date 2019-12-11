<template lang="pug">
extends /components/dialog/base.pug
block content
    .__row
        .__row_t {{ $t('tokenCard.heads.availableExAmount') }}
        .__input_row.__unuse_input.__bold
            img.__icon(:src="viteTokenInfo ? viteTokenInfo.icon : ''")
            span {{ "VITE" }}
            span.__right.blue {{ exViteBalance }}
    .__row
        .__row_t {{ $t('tradeVip.svipConfirm.openStakingAmount') }}
            .__err(v-if="isNoBalance") {{ $t('tradeVip.vipConfirm.noBalance') }}
        .__input_row.__unuse_input 1,000,000 VITE
    .__row
        .__row_t {{ $t('tradeVip.svipConfirm.address') }}
            .__err(v-if="!isAddress") {{ $t('hint.addrFormat') }}
        vite-input.block_input(v-model="inputAddress" :placeholder="$t('tradeVip.svipConfirm.addressPlaceholder')")
            span.__all_wrapper.__pointer(slot="after" @click="fillMyAddr")
                span.__all {{ $t('walletQuota.myAddr') }}
    .__hint
        span {{ $t('tradeVip.svipConfirm.openHint') }}
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
            isLoading: false,
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
            return !this.inputAddress || !this.isAddress || this.isNoBalance || this.isLoading;
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
@import "pcComponents/confirm/confirmRow.scss";
</style>
