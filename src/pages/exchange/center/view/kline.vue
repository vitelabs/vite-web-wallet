<template>
    <div id="tv_chart_container" class="tradingview-widget-container">

    </div>
</template>

<script>
import { widget } from 'charting/charting_library.min';
import datafeed from './datafeeds/index.js';

export default {
    computed: {
        symbol() {
            if (!this.activeTxPair) {
                return '';
            }
            return this.activeTxPair.ftokenShow + '/' + this.activeTxPair.ttokenShow;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        }
    },
    watch: {
        symbol: function() {
            if (!this.symbol) {
                return;
            }

            const widgetOptions = {
                symbol: this.symbol,
                datafeed: new datafeed(this.activeTxPair),
                interval: 'M',
                container_id: 'tv_chart_container',
                library_path: '/charting_library/',
                locale: this.$i18n.locale,
                disabled_features: ['use_localstorage_for_settings'],
                enabled_features: ['study_templates'],
                fullscreen: false,
                autosize: true
            };

            const tvWidget = new widget(widgetOptions);
            this.tvWidget = tvWidget;

            this.tvWidget.onChartReady(() => {
                // console.log('???');
                this.init();
            });
        },
        activeTxPair: function() {
            // this.tvWidget.setSymbol({
            //     name: this.activeTxPair.ftokenShow + '/' + this.activeTxPair.ttokenShow
            // });
        }
    },
    data() {
        return {
            tvWidget: null
        };
    },
    methods: {
        init() {
            this.tvWidget.setSymbol({
                name: this.activeTxPair.ftokenShow + '/' + this.activeTxPair.ttokenShow
            });
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


