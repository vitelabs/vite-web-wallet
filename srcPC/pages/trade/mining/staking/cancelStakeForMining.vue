<template>
    <confirm v-show="isShow"
             :showMask="true" :title="$t('tradeMining.withdrawTitle')"
             :closeIcon="true" :close="close"
             :rightBtnClick="_cancelStake" :rightBtnTxt="$t('tradeMining.withdrawBtn')"
             :leftBtnClick="close" :leftBtnTxt="$t('walletQuota.confirm.cancel.leftBtn')">

        <div class="__row">
            <div class="__row_t">{{ $t('tradeMining.stakingBalance') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ stakingAmount }}</span>
            </div>
        </div>

        <div class="__hint distance"><span>{{ $t('tradeMining.withdrawHint1') }}</span></div>
        <div class="__hint"><span>{{ $t('tradeMining.withdrawHint2') }}</span></div>
    </confirm>
</template>

<script>
import statistics from '@utils/statistics';
import router from '@pc/router';
import sendTx from '@pc/utils/sendTx';
import confirm from '@pc/components/confirm/confirm.vue';
import { initPwd } from '@pc/components/password/index.js';
import { cancelStakeById } from '@pc/services/tradeOperation';

export default {
    components: { confirm },
    data() {
        return {
            isShow: false,
            stakingObj: null
        };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        accountAddr() {
            return this.$store.getters.activeAddr;
        },
        stakingAmount() {
            if (!this.stakingObj) {
                return 0;
            }
            return this.stakingObj.amount;
        }
    },
    methods: {
        show(stakingObj) {
            this.stakingObj = stakingObj;
            this.isShow = true;
        },
        close() {
            this.stakingObj = null;
            this.isShow = false;
        },
        _cancelStake() {
            statistics.event(router.currentRoute.name, this.actionType === 1 ? 'addQuota-submit' : 'withdrawQuota-submit', this.accountAddr || '');
            initPwd({
                submit: () => {
                    const func = this.stakingObj.rawData.id
                        ? this.cancelStakeById
                        : this.cancelV1;
                    func().then(() => {
                        this.$toast(this.$t('hint.request', { name: this.$t('walletQuota.withdrawalStaking') }));
                        this.close();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(this.$t('walletQuota.canclePledgeFail'), err);
                    });
                }
            });
        },
        cancelV1() {
            return sendTx({
                methodName: 'dexStakeForMining',
                data: {
                    actionType: 2,
                    amount: this.stakingObj.rawData.stakeAmount
                }
            });
        },
        cancelStakeById() {
            return cancelStakeById({ id: this.stakingObj.rawData.id });
        }
    }
};
</script>
