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
                <div v-show="!canOrder && !isVip" class="__err">{{ $t('tradeVip.vipConfirm.noBalance') }}</div>
                <div v-show="!canOrder && isVip" class="__err">{{ $t('walletQuota.list.unexpired') }}</div>
            </div>
            <div class="__input_row __unuse_input">10,000 VITE</div>
        </div>

        <div class="__hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import confirm from 'h5Components/confirm/confirm.vue';
import { getAgentVipPledgeInfo } from 'services/viteServer';
import date from 'utils/date';
import BigNumber from 'utils/bigNumber';
import statistics from 'utils/statistics';
import sendTx from 'h5Utils/sendTx';

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
                return this.stakingObj && this.stakingObj.expirationHeight <= this.height;
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
            return this.isVip ? this.$t('tradeVip.vipConfirm.cancelVip') : this.$t('tradeVip.vipConfirm.openVip');
        },
        stakingText() {
            return this.isVip ? this.$t('tradeVip.vipConfirm.cancelStakingAmount') : this.$t('tradeVip.vipConfirm.openStakingAmount');
        },
        hint() {
            return this.isVip ? this.$t('tradeVip.vipConfirm.cancelHint', { time: this.stakingObj.expirationTime ? date(this.stakingObj.expirationTime * 1000, 'zh') : '' }) : this.$t('tradeVip.vipConfirm.openHint');
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
            statistics.event(`H5${ this.$route.name }`, `VIP-${ this.isVip ? 'cancel' : 'open' }`, this.accountAddr || '');
            const func = this.isVip ? this.cancelVIP : this.openVIP;
            this.isLoading = true;

            func().then(() => {
                this.isLoading = false;
                // this.$toast(this.isVip ? this.$t('tradeVip.vipConfirm.cancelSuccess') : this.$t('tradeVip.vipConfirm.openSuccess'));
                this.close && this.close();
                this.$store.dispatch('startLoopVip', !this.isVip);
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                // this.$toast(this.isVip ? this.$t('tradeVip.vipConfirm.cancelFail') : this.$t('tradeVip.vipConfirm.openFail'));
            });
        },

        stakeForVIP({ actionType }) {
            return sendTx({
                methodName: 'dexStakeForVIP',
                data: { actionType }
            });
        },
        cancelStakeById({ id }) {
            return sendTx({
                methodName: 'dexCancelStakeById',
                data: { id }
            });
        },
        openVIP() {
            return this.stakeForVIP({ actionType: 1 });
        },
        cancelVIP() {
            return this.stakingObj.id
                ? this.cancelStakeById({ id: this.stakingObj.id })
                : this.stakeForVIP({ actionType: 2 });
        },

        fetchStakingObj() {
            if (!this.isVip) {
                return;
            }

            getAgentVipPledgeInfo(this.accountAddr).then(data => {
                this.stakingObj = data;
            }).catch(err => {
                console.warn(err);
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.__row_t .__err {
    float: none;
    font-size: 12px;
    padding-top: 3px;
}
</style>
