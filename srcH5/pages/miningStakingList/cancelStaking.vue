<template>
    <confirm v-show="isShow" :showMask="true" :title="$t('tradeMining.withdrawTitle')"
             :closeIcon="true" :close="close"
             :leftBtnClick="cancelStaking" :leftBtnTxt="$t('tradeMining.withdrawBtn')"
             :singleBtn="true">

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
import { constant } from '@vite/vitejs';
import confirm from 'h5Components/confirm/confirm.vue';
import sendTx from 'h5Utils/sendTx';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { confirm },
    data() {
        return {
            isShow: false,
            stakingObj: null,
            cb: null
        };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.state.env.tokenMap[Vite_Token_Info.tokenId];
        },
        stakingAmount() {
            if (!this.stakingObj) {
                return 0;
            }
            return this.stakingObj.amount;
        }
    },
    methods: {
        show(stakingObj, cb) {
            this.isShow = true;
            this.stakingObj = stakingObj;
            this.cb = cb;
        },
        close() {
            this.isShow = false;
            this.stakingObj = null;
        },

        cancelStaking() {
            const func = this.stakingObj.rawData.id
                ? this.cancelStakeById
                : this.cancelV1;

            func().then(() => {
                this.cb && this.cb();
                this.close();
            }).catch(err => {
                console.warn(err);
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
            return sendTx({
                methodName: 'dexCancelStakeById',
                data: { id: this.stakingObj.rawData.id }
            });
        }
    }
};
</script>
