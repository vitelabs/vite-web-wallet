<template>
    <confirm v-show="isShow" :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="close"
             :leftBtnClick="cancelVIP" :leftBtnTxt="confirmTitle"
             :singleBtn="true" :isLoading="isLoading">

        <div class="__row">
            <div class="__row_t">{{ stakingText }}</div>
            <div class="__input_row __unuse_input">{{ cancelItem ? cancelItem.amount : 0 }} VITE</div>
        </div>

        <div class="__hint" v-if="isSVip"><span>{{ $t('tradeVip.vipConfirm.adviseToCancel') }}</span></div>
        <div class="__hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import confirm from 'pcComponents/confirm/confirm.vue';
import { initPwd } from 'pcComponents/password/index.js';
import { stakeForVIP, cancelStakeById } from 'pcServices/tradeOperation';

export default {
    components: { confirm },
    data() {
        return {
            isLoading: false,
            isShow: false,
            cancelItem: null
        };
    },
    computed: {
        accountAddr() {
            return this.$store.getters.activeAddr;
        },
        isSVip() {
            return this.$store.state.exchangeFee.isSVip;
        },
        confirmTitle() {
            return this.$t('tradeVip.vipConfirm.cancelVip');
        },
        stakingText() {
            return this.$t('tradeVip.vipConfirm.cancelStakingAmount');
        },
        hint() {
            return this.$t('tradeVip.vipConfirm.cancelHint');
        }
    },
    methods: {
        show(cancelItem) {
            this.cancelItem = cancelItem;
            this.isShow = true;
        },
        close() {
            this.isShow = false;
            this.cancelItem = null;
        },
        cancelVIP() {
            this.isLoading = true;
            initPwd({
                submit: () => {
                    const func = this.cancelItem.id
                        ? cancelStakeById({ id: this.cancelItem.id })
                        : stakeForVIP({ actionType: 2 });

                    func.then(() => {
                        this.isLoading = false;
                        this.$toast(this.$t('tradeVip.vipConfirm.cancelSuccess'));
                        this.$store.dispatch('startLoopVip', false);
                        this.close();
                    }).catch(err => {
                        console.warn(err);
                        this.isLoading = false;
                        this.$toast(this.$t('tradeVip.vipConfirm.cancelFail'));
                    });
                }
            });
        }
    }
};
</script>
