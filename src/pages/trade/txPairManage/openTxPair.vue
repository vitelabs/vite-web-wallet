<template>
    <confirm class="middle" :btnUnuse="!isHaveBalance"
             :showMask="true" :singleBtn="true" :closeIcon="true"
             :title="$t('tradeTxPairManage.openTxPairConfirm.title', { symbol: txPair.symbol })"
             :leftBtnTxt="$t('tradeTxPairManage.openTxPairConfirm.btn')"
             :leftBtnClick="trans" :close="close" >

        <div class="__row">
            <div class="__row_t">{{ $t('dexBalance') }}</div>
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

        <div class="__hint"><span>{{ $t('tradeTxPairManage.openTxPairConfirm.hint') }}</span></div>
    </confirm>
</template>

<script>
import { constant } from '@vite/vitejs';
import loading from 'components/loading';
import confirm from 'components/confirm/confirm.vue';
import viteInput from 'components/viteInput';
import BigNumber from 'utils/bigNumber';
import sendTx from 'utils/sendTx';
import { initPwd } from 'components/password/index.js';

const spend = 10000;
const Vite_Token_Info = constant.Vite_Token_Info;

export default {
    components: { loading, confirm, viteInput },
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
            const list = this.$store.getters.exBalanceList;
            return list[Vite_Token_Info.tokenId];
        },
        exViteBalance() {
            return this.rawBalance ? this.rawBalance.availableExAmount : 0;
        },
        showExViteBalance() {
            return this.rawBalance ? this.rawBalance.available : 0;
        },
        isHaveBalance() {
            const amount = BigNumber.toMin(this.spend, Vite_Token_Info.decimals);
            return BigNumber.compared(this.exViteBalance, amount) >= 0;
        }
    },
    methods: {
        trans() {
            initPwd({
                submit: () => {
                    sendTx({
                        methodName: 'dexFundNewMarket',
                        data: {
                            tradeToken: this.txPair.txPairDetail.tradeToken,
                            quoteToken: this.txPair.txPairDetail.quoteToken
                        }
                    }).then(() => {
                        this.$toast(this.$t('tradeTxPairManage.openTxPairConfirm.reqSuccess'));
                        this.close();
                    }).catch(err => {
                        console.warn(err);
                        this.$toast(this.$t('tradeTxPairManage.openTxPairConfirm.reqError'), err);
                    });
                }
            });
        }
    }
};
</script>
