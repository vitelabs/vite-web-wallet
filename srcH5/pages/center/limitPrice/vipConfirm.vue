<template>
    <confirm :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="close"
             :leftBtnClick="changeVip" :leftBtnTxt="confirmTitle"
             :singleBtn="true" :btnUnuse="!canOrder" :isLoading="isLoading">

        <div v-if="!isVip" class="__row">
            <div class="__row_t">{{ $t('tokenCard.heads.availableExAmount') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo.icon" class="__icon" />VITE
                <span class="__right">{{ exViteBalance }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">{{ stakingText }}
                <span v-show="!canOrder && !isVip" class="__err">{{ $t('trade.vipConfirm.noBalance') }}</span>
                <span v-show="!canOrder && isVip" class="__err">{{ $t('walletQuota.list.unexpired') }}</span>
            </div>
            <div class="__input_row __unuse_input">10,000 VITE</div>
        </div>

        <div class="__hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import confirm from 'h5Components/confirm/confirm.vue';
import BigNumber from 'utils/bigNumber';
// import sendTx from 'h5Utils/sendTx';
import $ViteJS from 'utils/viteClient';
import date from 'utils/date';
import statistics from 'utils/statistics';

const Vite_Token_Info = constant.Vite_Token_Info;
const vipStakingAmount = 10000;

export default {
    components: { confirm },
    props: {
        close: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.$store.dispatch('startLoopHeight');
        this.fetchStakingObj();
    },
    destroyed() {
        this.$store.dispatch('stopLoopHeight');
    },
    data() {
        return {
            stakingObj: {},
            isLoading: false
        };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.state.env.tokenMap[Vite_Token_Info.tokenId];
        },
        height() {
            return this.$store.state.env.currentHeight;
        },
        canOrder() {
            if (this.isVip) {
                return this.stakingObj && this.stakingObj.withdrawHeight <= this.height;
            }

            if (!this.rawBalance || !+this.rawBalance.availableExAmount) {
                return false;
            }

            const minAmount = BigNumber.toMin(vipStakingAmount, Vite_Token_Info.decimals);
            return BigNumber.compared(minAmount, this.rawBalance.availableExAmount) <= 0;
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

        isVip() {
            return this.$store.state.exchangeFee.isVip;
        },
        confirmTitle() {
            return this.isVip ? this.$t('trade.vipConfirm.cancelVip') : this.$t('trade.vipConfirm.openVip');
        },
        stakingText() {
            return this.isVip ? this.$t('trade.vipConfirm.cancelStakingAmount') : this.$t('trade.vipConfirm.openStakingAmount');
        },
        hint() {
            return this.isVip ? this.$t('trade.vipConfirm.cancelHint', { time: this.stakingObj.withdrawTime ? date(this.stakingObj.withdrawTime * 1000, 'zh') : '' }) : this.$t('trade.vipConfirm.openHint');
        }
    },
    watch: {
        address() {
            this.fetchStakingObj();
        },
        isVip() {
            this.fetchStakingObj();
        }
    },
    methods: {
        changeVip() {
            const actionType = this.isVip ? 2 : 1;
            this.isLoading = true;

            statistics.event(this.$route.name, `VIP-${ actionType === 2 ? 'cancel' : 'open' }`, this.accountAddr || '');

            // sendTx({
            //     methodName: 'dexFundPledgeForVip',
            //     data: {
            //         amount: '0',
            //         actionType
            //     },
            //     vbExtends: {
            //         'type': 'dexFundPledgeForVip',
            //         'amount': '10,000 VITE'
            //     }
            // }).then(() => {
            //     this.isLoading = false;
            //     this.$toast(this.isVip ? this.$t('trade.vipConfirm.cancelSuccess') : this.$t('trade.vipConfirm.openSuccess'));
            //     this.close && this.close();
            //     this.$store.dispatch('startLoopVip', !this.isVip);
            // }).catch(err => {
            //     console.warn(err);
            //     this.isLoading = false;
            //     this.$toast(this.isVip ? this.$t('trade.vipConfirm.cancelFail') : this.$t('trade.vipConfirm.openFail'));
            // });
        },

        fetchStakingObj() {
            if (!this.isVip) {
                return;
            }

            $ViteJS.request('pledge_getAgentPledgeInfo', {
                pledgeAddr: this.accountAddr,
                agentAddr: constant.DexFund_Addr,
                beneficialAddr: constant.DexFund_Addr,
                bid: 2
            }).then(data => {
                this.stakingObj = data;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>
