<template>
    <confirm v-show="isShow" :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="close"
             :leftBtnClick="_cancelSVip" :leftBtnTxt="confirmTitle"
             :singleBtn="true" :isLoading="isLoading">

        <div class="__row">
            <div class="__row_t">{{ $t('tradeVip.svipConfirm.cancelStakingAmount') }}</div>
            <div class="__input_row __unuse_input">{{ amount }} VITE</div>
        </div>

        <div class="__row">
            <div class="__row_t">{{ $t('tradeVip.svipConfirm.cancelAddress') }}</div>
            <div class="__input_row __unuse_input">{{ cancelItem.address }}</div>
        </div>

        <div class="__hint"><span>{{ $t('tradeVip.svipConfirm.cancelHint')  }}</span></div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import BigNumber from 'utils/bigNumber';
import confirm from 'components/confirm/confirm.vue';
import { initPwd } from 'pcComponents/password/index.js';
import { stakeForSuperVIP, cancelStakeById } from 'pcServices/tradeOperation';

const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { confirm },
    data() {
        return {
            cancelItem: {},
            isLoading: false,
            isShow: false
        };
    },
    computed: {
        amount() {
            return BigNumber.toBasic(this.cancelItem.stakeAmount || 0, Vite_Token_Info.decimals);
        },
        confirmTitle() {
            return this.$t('tradeVip.svipConfirm.cancelVip');
        },
        myAddress() {
            return this.$store.getters.activeAddr;
        }
    },
    methods: {
        show() {
            this.isShow = true;
        },
        close() {
            this.isShow = false;
        },
        _cancelSVip() {
            initPwd({
                submit: () => {
                    this.cancelSVip();
                }
            });
        },
        cancelSVip() {
            this.isLoading = true;

            const func = this.cancelItem.id
                ? cancelStakeById({ id: this.cancelItem.id })
                : stakeForSuperVIP({ actionType: 2 });

            func.then(() => {
                this.isLoading = false;
                this.$toast(this.$t('tradeVip.svipConfirm.cancelSuccess'));
                this.close();
            }).catch(err => {
                console.warn(err);
                this.$toast(this.$t('tradeVip.svipConfirm.cancelFail'));
            });
        }
    }
};
</script>
