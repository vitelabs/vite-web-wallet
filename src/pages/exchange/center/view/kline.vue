<template>
    <div id="tv_chart_container" class="tradingview-widget-container"></div>
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

            // const widgetOptions = {
            //     symbol: this.symbol,
            //     datafeed: new datafeed(this.activeTxPair),
            //     interval: '1',
            //     container_id: 'tv_chart_container',
            //     library_path: '/charting_library/',
            //     locale: this.$i18n.locale,
            //     disabled_features: ['use_localstorage_for_settings'],
            //     enabled_features: ['study_templates'],
            //     fullscreen: false,
            //     autosize: true
            // };
            const widgetOptions = {
                fullscreen: false,
                autosize: true,
                interval: '1',
                toolbar_bg: '#f4f7f9',
                allow_symbol_change: true,
                container_id: 'tv_chart_container',
                datafeed: new datafeed(this.activeTxPair),
                library_path: './charting_library/',
                locale: this.$i18n.locale,
                drawings_access: { type: 'black', tools: [ { name: 'Trend Line' } ] },
                disabled_features: ['use_localstorage_for_settings', 'volume_force_overlay', 'header_compare', 'header_symbol_search', 'header_indicators', 'header_chart_type'],
                enabled_features: ['move_logo_to_main_pane'],
                overrides: {
                    'mainSeriesProperties.style': 0,
                    'symbolWatermarkProperties.color' : '#944',
                    'volumePaneSize': 'tiny'
                },
                studies_overrides: {
                    'bollinger bands.median.color': '#33FF88',
                    'bollinger bands.upper.linewidth': 7
                },
                debug: true,
                time_frames: [
                    { text: '1d', resolution: '1' },
                ],
                // charts_storage_url: 'http://saveload.tradingview.com',
                // client_id: 'tradingview.com',
                // user_id: 'public_user',
                favorites: {
                    intervals: ['1', '60'],
                    chartTypes: ['Area', 'Line']
                }
            };

            const tvWidget = new widget(widgetOptions);
            this.tvWidget = tvWidget;

            this.tvWidget.onChartReady(() => {
                this.init();
            });
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
            }, '1');
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


