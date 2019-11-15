<template>
    <confirm v-show="isShow" :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="close"
             :leftBtnClick="changeVip" :leftBtnTxt="confirmTitle"
             :singleBtn="true" :btnUnuse="!canOrder" :isLoading="isLoading">

        <div v-if="!isVip" class="__row">
            <div class="__row_t">{{ $t('tokenCard.heads.availableExAmount') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ exViteBalance }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">{{ stakingText }}
                <span v-show="!canOrder && !isVip" class="__err">{{ $t('tradeVip.vipConfirm.noBalance') }}</span>
                <span v-show="!canOrder && isVip" class="__err">{{ $t('walletQuota.list.unexpired') }}</span>
            </div>
            <div class="__input_row __unuse_input">10,000 VITE</div>
        </div>

        <div v-if="!isVip" class="__row">
            <div class="__row_t">{{ $t('tradeVip.vipConfirm.address') }}</div>
            <div class="__input_row __unuse_input">{{ accountAddr }}</div>
        </div>

        <div class="__hint" v-if="isVip && isSVip"><span>{{ $t('tradeVip.vipConfirm.adviseToCancel') }}</span></div>
        <div class="__hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import confirm from 'components/confirm/confirm.vue';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'pcUtils/sendTx';
import router from 'pcRouter';
import { initPwd } from 'pcComponents/password/index.js';

const Vite_Token_Info = constant.Vite_Token_Info;
const vipStakingAmount = 10000;
const StakeForVIPAbi = { 'type': 'function', 'name': 'StakeForVIP', 'inputs': [{ 'name': 'actionType', 'type': 'uint8' }] };

export default {
    components: { confirm },
    mounted() {
        this.$store.dispatch('startLoopHeight');
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return {
            isLoading: false,
            isShow: false
        };
    },
    computed: {
        height() {
            return this.$store.state.ledger.currentHeight;
        },
        canOrder() {
            if (this.isVip) {
                return true;
            }

            if (!this.rawBalance || !+this.rawBalance.availableExAmount) {
                return false;
            }

            const minAmount = BigNumber.toMin(vipStakingAmount, Vite_Token_Info.decimals);
            return BigNumber.compared(minAmount, this.rawBalance.availableExAmount) <= 0;
        },
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        rawBalance() {
            const list = this.$store.getters.exBalanceList;
            return list[Vite_Token_Info.tokenId];
        },
        exViteBalance() {
            return this.rawBalance ? this.rawBalance.available : 0;
        },
        accountAddr() {
            return this.$store.getters.activeAddr;
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        confirmTitle() {
            return this.isVip ? this.$t('tradeVip.vipConfirm.cancelVip') : this.$t('tradeVip.vipConfirm.openVip');
        },
        stakingText() {
            return this.isVip ? this.$t('tradeVip.vipConfirm.cancelStakingAmount') : this.$t('tradeVip.vipConfirm.openStakingAmount');
        },
        hint() {
            return this.isVip ? this.$t('tradeVip.vipConfirm.cancelHint') : this.$t('tradeVip.vipConfirm.openHint');
        }
    },
    methods: {
        show() {
            this.isShow = true;
        },
        close() {
            this.isShow = false;
        },
        changeVip() {
            const actionType = this.isVip ? 2 : 1;
            this.isLoading = true;

            statistics.event(router.currentRoute.name, `VIP-${ actionType === 2 ? 'cancel' : 'open' }`, this.accountAddr || '');
            initPwd({
                submit: () => {
                    sendTx({
                        methodName: 'callContract',
                        data: {
                            abi: StakeForVIPAbi,
                            toAddress: 'vite_0000000000000000000000000000000000000006e82b8ba657',
                            params: [actionType]
                        }
                    }).then(() => {
                        this.isLoading = false;
                        this.$toast(this.isVip ? this.$t('tradeVip.vipConfirm.cancelSuccess') : this.$t('tradeVip.vipConfirm.openSuccess'));
                        this.close && this.close();
                        this.$store.dispatch('startLoopVip', !this.isVip);
                    }).catch(err => {
                        console.warn(err);
                        this.isLoading = false;
                        this.$toast(this.isVip ? this.$t('tradeVip.vipConfirm.cancelFail') : this.$t('tradeVip.vipConfirm.openFail'));
                    });
                }
            });
        }
    }
};
</script>
