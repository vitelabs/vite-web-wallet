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

        <div class="__hint"><span>{{ $t('tradeMining.withdrawHint') }}</span></div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import statistics from 'utils/statistics';
import router from 'pcRouter';
import sendTx from 'pcUtils/sendTx';
import { initPwd } from 'pcComponents/password/index.js';
import { cancelStakeById } from 'pcServices/tradeOperation';
import { abiList } from 'services/apiServer';

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
