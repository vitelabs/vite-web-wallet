<template>
    <div id="tv_chart_container" class="tradingview-widget-container"></div>
</template>

<script>
import { widget } from 'charting/charting_library.min';
import datafeed from './datafeeds.js';

let changeLangEvent = null;

export default {
    props: {
        showView: {
            type: String,
            default: 'kline'
        },
        toogleDepth: {
            type: Function,
            default: () => {}
        }
    },
    mounted() {
        this.symbol && this.init();

        changeLangEvent = webViteEventEmitter.on('changeLang', () => {
            this.resetLang();
        });
    },
    destroyed() {
        changeLangEvent && webViteEventEmitter.off(changeLangEvent);
        changeLangEvent = null;
    },
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
            this.symbol && this.init();
        }
    },
    data() {
        return {
            tvWidget: null
        };
    },
    methods: {
        init() {
            this.tvWidget && this.tvWidget.remove();

            const widgetOptions = {
                fullscreen: false,
                autosize: true,
                interval: '1',
                toolbar_bg: '#f4f7f9',
                allow_symbol_change: true,
                container_id: 'tv_chart_container',
                datafeed: new datafeed(this.activeTxPair),
                library_path: 'charting_library/',
                locale: this.$i18n.locale,
                drawings_access: { type: 'black', tools: [ { name: 'Trend Line' } ] },
                // main_series_scale_menu header_indicators
                disabled_features: ['use_localstorage_for_settings', 'volume_force_overlay', 'header_compare', 'header_symbol_search', 'header_chart_type'],
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
                loading_screen: {
                    foregroundColor: '#007AFF'
                },
                // debug: true,
                time_frames: [
                    { text: '1d', resolution: '1' },
                ],
                // charts_storage_url: 'http://saveload.tradingview.com',
                // client_id: 'tradingview.com',
                // user_id: 'public_user',
                favorites: {
                    intervals: ['1', '60'],
                    chartTypes: ['CANDLES']
                }
            };

            const tvWidget = new widget(widgetOptions);
            this.tvWidget = tvWidget;

            this.tvWidget.onChartReady(() => {
                this.createDepthBtn();
                this.tvWidget.chart().setChartType(1);
            });
        },
        resetLang() {
            this.init();
        },
        createDepthBtn() {
            let button = this.tvWidget.createButton({ 
                align: 'right' 
            })[0];
            button.textContent = this.$t('exchange.depthView');
            button.addEventListener('click', () => {
                this.toogleDepth();
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


