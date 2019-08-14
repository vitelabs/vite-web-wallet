<template>
    <div id="tv_chart_container" class="tradingview-widget-container"></div>
</template>

<script>
import kline from './tradingView/kline';

export default {
    props: {
        toogleDepth: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.init();
    },
    destroyed() {
        this.tvKline && this.tvKline.remove();
    },
    computed: {
        symbol() {
            if (!this.activeTxPair) {
                return '';
            }
            return `${ this.activeTxPair.tradeTokenSymbol }/${ this.activeTxPair.quoteTokenSymbol }`;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        netStatus() {
            return this.$store.state.env.clientStatus;
        }
    },
    watch: {
        symbol: function () {
            this.init();
        },
        netStatus() {
            if (!this.netStatus) {
                return;
            }
            this.tvKline && this.tvKline.remove();
            this.tvKline = null;
            this.init();
        }
    },
    data() {
        return { tvKline: null };
    },
    methods: {
        init() {
            if (!this.symbol) {
                return;
            }

            if (this.tvKline) {
                this.tvKline.reset(this.activeTxPair);
                return;
            }

            this.tvKline = new kline({
                locale: this.$i18n.locale,
                activeTxPair: this.activeTxPair
            }, () => {
                this.createDepthBtn();
            });
        },
        createDepthBtn() {
            const button = this.tvKline.tvWidget.createButton({ align: 'right' })[0];
            button.textContent = this.$t('trade.depthView');
            button.setAttribute('style', 'cursor: pointer;');
            button.addEventListener('click', () => {
                this.toogleDepth();
            });

            const klineButton = this.tvKline.tvWidget.createButton({ align: 'right' })[0];
            klineButton.textContent = this.$t('trade.klineView');
            klineButton.parentNode.setAttribute('style', 'background: rgba(75, 116, 255, 0.1); cursor: pointer;');
        }
    }
};
</script>

<style lang="scss" scoped>
.tradingview-widget-container {
    width: 100%;
    height: 100%;
}
</style>
