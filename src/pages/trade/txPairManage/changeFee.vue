<template>
    <confirm class="middle" :btnUnuse="!isHaveBalance"
             :showMask="true" :singleBtn="true" :closeIcon="true"
             :title="$t('tradeTxPairManage.openTxPairConfirm.title', { symbol: txPair.symbol })"
             :leftBtnTxt="$t('tradeTxPairManage.openTxPairConfirm.btn')"
             :leftBtnClick="trans" :close="close" >

        <div class="__row">
            <div class="__row_t">{{ $t('balance') }}</div>
            <div class="__input_row __unuse_input __bold">
                <img  :src="viteTokenInfo.icon" class="__icon" />
                {{ viteTokenInfo.tokenSymbol }} <span class="__right">{{ showExViteBalance }}</span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t('tradeTxPairManage.openTxPairConfirm.fee') }}
                <span v-show="!isHaveBalance" class="__err">{{ $t('hint.insufficientBalance') }}</span>
            </div>
            <div class="__input_row __unuse_input">{{ spend }} VITE</div>
        </div>
    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';

const spend = 10000;

export default {
    components: { confirm, viteInput },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        txPair: {
            type: Object,
            default: null
        }
    },
    data() {
        return { spend };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        },
        rawBalance() {
            if (!this.viteTokenInfo) {
                return null;
            }
            const list = this.$store.getters.exBalanceList;
            return list[this.viteTokenInfo.tokenId];
        },
        exViteBalance() {
            return this.rawBalance ? this.rawBalance.availableExAmount : 0;
        },
        showExViteBalance() {
            return this.rawBalance ? this.rawBalance.available : 0;
        },
        isHaveBalance() {
            if (!this.viteTokenInfo) {
                return false;
            }

            const amount = BigNumber.toMin(this.spend, this.viteTokenInfo.decimals);
            return BigNumber.compared(this.exViteBalance, amount) >= 0;
        }
    },
    methods: {
        trans() {

        }
    }
};
</script>
