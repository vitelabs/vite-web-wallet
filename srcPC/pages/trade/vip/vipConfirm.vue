<template>
    <confirm v-show="isShow" :showMask="true" :title="confirmTitle"
             :closeIcon="true" :close="close"
             :leftBtnClick="_openVIP" :leftBtnTxt="confirmTitle"
             :singleBtn="true" :btnUnuse="!canOrder" :isLoading="isLoading">

        <div class="__row">
            <div class="__row_t">{{ $t('tokenCard.heads.availableExAmount') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img :src="viteTokenInfo ? viteTokenInfo.icon : ''" class="__icon" />VITE
                <span class="__right">{{ exViteBalance }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">{{ stakingText }}
                <span v-show="!canOrder" class="__err">{{ $t('tradeVip.vipConfirm.noBalance') }}</span>
            </div>
            <div class="__input_row __unuse_input">10,000 VITE</div>
        </div>

        <div class="__row">
            <div class="__row_t">{{ $t('tradeVip.vipConfirm.address') }}</div>
            <div class="__input_row __unuse_input">{{ accountAddr }}</div>
        </div>

        <div class="__hint"><span>{{ hint }}</span></div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import confirm from 'components/confirm/confirm.vue';
import BigNumber from 'utils/bigNumber';
import { initPwd } from 'pcComponents/password/index.js';
import { stakeForVIP } from 'pcServices/tradeOperation';

const Vite_Token_Info = constant.Vite_Token_Info;
const vipStakingAmount = 10000;

export default {
    components: { confirm },
    data() {
        return {
            isLoading: false,
            isShow: false
        };
    },
    computed: {
        canOrder() {
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
        confirmTitle() {
            return this.$t('tradeVip.vipConfirm.openVip');
        },
        stakingText() {
            return this.$t('tradeVip.vipConfirm.openStakingAmount');
        },
        hint() {
            return this.$t('tradeVip.vipConfirm.openHint');
        }
    },
    methods: {
        show() {
            this.isShow = true;
        },
        close() {
            this.isLoading = false;
            this.isShow = false;
        },
        _openVIP() {
            initPwd({
                submit: () => {
                    this.openVIP();
                }
            });
        },
        openVIP() {
            this.isLoading = true;
            stakeForVIP({ actionType: 1 }).then(() => {
                this.isLoading = false;
                this.$toast(this.$t('tradeVip.vipConfirm.openSuccess'));
                this.$store.dispatch('startLoopVip', true);
                this.close();
            }).catch(err => {
                console.warn(err);
                this.isLoading = false;
                this.$toast(this.$t('tradeVip.vipConfirm.openFail'));
            });
        }
    }
};
</script>
