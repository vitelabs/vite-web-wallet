<template>
    <confirm :showMask="true" :singleBtn="true" :closeIcon="true"
             :title="$t('tradeTxPairManage.changeFee', { symbol: txPair.symbol })"
             :leftBtnTxt="$t('btn.submit')"
             :leftBtnClick="trans" :close="close" >

        <div class="__row">
            <div class="__row_t">{{ $t('tradeTxPairManage.currentMaker') }}</div>
            <div class="__input_row __unuse_input __bold">
                {{ txPair.symbol }}
                <span class="__right">
                    {{ txPair.txPairDetail.makerFeeRate ? `${(txPair.txPairDetail.makerFeeRate * 100).toFixed(3)}%` : '0%' }}
                </span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t('tradeTxPairManage.confirmFee') }}
                <span class="__bold __right __blue">{{ maker ? `${maker}%` : '0%' }}</span>
            </div>

            <slider class="change-fee-slider" :min="minFee" :max="maxFee"
                    :default="txPair.txPairDetail.makerFeeRate"
                    v-on:drag="makerChanged">
                <div class="speed">
                    <span class="__left">{{ minFee }}</span>
                    <span class="__right">{{ `${maxFee}%` }}</span>
                </div>
            </slider>
        </div>

        <div class="__row">
            <div class="__row_t">{{ $t('tradeTxPairManage.currentTaker') }}</div>
            <div class="__input_row __unuse_input __bold">
                {{ txPair.symbol }}
                <span class="__right">
                    {{ txPair.txPairDetail.takerFeeRate ? `${(txPair.txPairDetail.takerFeeRate * 100).toFixed(3)}%` : '0%' }}
                </span>
            </div>
        </div>

        <div class="__row">
            <div class="__row_t">
                {{ $t('tradeTxPairManage.confirmFee') }}
                <span class="__bold __right __blue">{{ taker ? `${taker}%` : '0%' }}</span>
            </div>

            <slider class="change-fee-slider" :min="minFee" :max="maxFee"
                    :default="txPair.txPairDetail.takerFeeRate"
                    v-on:drag="takerChanged">
                <div class="speed">
                    <span class="__left">{{ minFee }}</span>
                    <span class="__right">{{ `${maxFee}%` }}</span>
                </div>
            </slider>
        </div>

    </confirm>
</template>

<script>
import confirm from 'components/confirm/confirm.vue';
import alertConfirm from 'components/confirm/index.js';
import slider from 'components/slider';

const minFee = 0;
const maxFee = 0.2;

export default {
    components: { confirm, slider },
    props: {
        close: {
            type: Function,
            default: () => {}
        },
        txPair: {
            type: Object,
            default: null
        },
        fetchConfig: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            maker: '',
            taker: '',
            minFee,
            maxFee
        };
    },
    computed: {
        viteTokenInfo() {
            return this.$store.getters.viteTokenInfo;
        }
    },
    methods: {
        makerChanged(percent) {
            this.maker = (percent / 100 * (maxFee - minFee)).toFixed(3);
        },
        takerChanged(percent) {
            this.taker = (percent / 100 * (maxFee - minFee)).toFixed(3);
        },

        trans() {
            let text = '';
            let operationCode = 0;

            if (this.maker && +this.maker !== +this.txPair.txPairDetail.makerFeeRate) {
                text += this.$t('tradeTxPairManage.changeFeeHint', {
                    symbol: this.txPair.symbol,
                    type: 'Maker',
                    fee: `${ this.maker }%`
                });
                operationCode += 4;
            }
            if (this.taker && +this.taker !== +this.txPair.txPairDetail.takerFeeRate) {
                text = text ? `${ text }; ` : text;
                text += this.$t('tradeTxPairManage.changeFeeHint', {
                    symbol: this.txPair.symbol,
                    type: 'Taker',
                    fee: `${ this.taker }%`
                });
                operationCode += 2;
            }

            if (!text) {
                this.close();
                return;
            }

            alertConfirm({
                size: 'small',
                title: this.$t('tradeTxPairManage.changeFee'),
                closeBtn: { show: true },
                leftBtn: { text: this.$t('btn.cancel') },
                rightBtn: {
                    text: this.$t('btn.submit'),
                    click: () => {
                        this.fetchConfig({
                            operationCode,
                            tradeToken: this.txPair.txPairDetail.tradeToken,
                            quoteToken: this.txPair.txPairDetail.quoteToken,
                            makerFeeRate: this.maker * 1000,
                            takerFeeRate: this.taker * 1000
                        }, {
                            success: this.$t('hint.operateSuccess'),
                            fail: this.$t('hint.operateFail')
                        });
                    }
                },
                content: this.$t('tradeTxPairManage.changeFeeSubmit', { changeFeeHint: text })
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~assets/scss/vars.scss";

.change-fee-slider {
    margin-bottom: 46px;
    margin-top: 3px;
}

.speed {
    width: 100%;
    font-size: 12px;
    @include font-family-normal();
    color: rgba(94, 104, 117, 1);
    line-height: 16px;
    padding-top: 20px;
}
.__blue {
    color: #007AFF;
}
.__left {
    float: left;
}
.__right {
    float: right;
}
</style>
