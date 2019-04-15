<template>
    <div id="tv_chart_container" class="tradingview-widget-container"></div>
</template>

<script>
import { widget } from 'charting/charting_library.min';
import datafeed from './datafeeds.js';
import { clearTimeout, setTimeout } from 'timers';

let datafeedObj;
let initTimeout = null;

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
        this.timeoutInit();
    },
    destroyed() {
        this.clearInitTimeout();
    },
    computed: {
        symbol() {
            if (!this.activeTxPair) {
                return '';
            }

            return `${ this.activeTxPair.ftokenShow }/${ this.activeTxPair.ttokenShow }`;
        },
        activeTxPair() {
            return this.$store.state.exchangeActiveTxPair.activeTxPair;
        },
        lang() {
            return this.$store.state.env.lang;
        }
    },
    watch: {
        symbol: function () {
            this.timeoutInit();
        },
        lang: function () {
            this.timeoutInit();
        }
    },
    data() {
        return { tvWidget: null };
    },
    methods: {
        timeoutInit() {
            if (!this.symbol) {
                return;
            }
            this.clearInitTimeout();
            initTimeout = setTimeout(() => {
                this.init();
            }, 700);
        },
        clearInitTimeout() {
            initTimeout && clearTimeout(initTimeout);
            initTimeout = null;
        },
        init() {
            this.tvWidget && this.tvWidget.remove();
            datafeedObj && datafeedObj.unsubscribeBars();
            datafeedObj = new datafeed(this.activeTxPair);

            if (!this.symbol) {
                return;
            }

            const widgetOptions = {
                fullscreen: false,
                autosize: true,
                interval: '60',
                toolbar_bg: '#f4f7f9',
                allow_symbol_change: true,
                container_id: 'tv_chart_container',
                datafeed: datafeedObj,
                library_path: '/charting_library/',
                locale: this.$i18n.locale,
                drawings_access: {
                    type: 'black',
                    tools: [{ name: 'Trend Line' }]
                },
                custom_css_url: '/charting_library/charting_custom.css',
                // Main_series_scale_menu header_indicators
                disabled_features: [ 'left_toolbar', 'use_localstorage_for_settings', 'volume_force_overlay', 'header_compare', 'header_symbol_search', 'header_chart_type' ],
                enabled_features: ['move_logo_to_main_pane'],
                overrides: {
                    'mainSeriesProperties.style': 0,
                    'symbolWatermarkProperties.color': '#944',
                    'volumePaneSize': 'medium'
                },
                studies_overrides: {
                    'bollinger bands.median.color': '#33FF88',
                    'bollinger bands.upper.linewidth': 7
                },
                loading_screen: { foregroundColor: '#007AFF' },
                time_frames: [
                    { text: '30m', resolution: '30', description: '30 Minutes' },
                    { text: '1W', resolution: '1W', description: '1 Week' }
                ],
                // Debug: true,
                // Charts_storage_url: 'http://saveload.tradingview.com',
                // client_id: 'tradingview.com',
                // user_id: 'public_user',
                favorites: {
                    intervals: [ '1', '60' ],
                    chartTypes: ['CANDLES']
                }
            };

            const tvWidget = new widget(widgetOptions);
            this.tvWidget = tvWidget;

            this.tvWidget.onChartReady(() => {
                this.createDepthBtn();
                this.tvWidget.chart().setChartType(1);

                const studies = [];
                let id = this.tvWidget.chart().createStudy('Moving Average', false, false, [7], null, { 'Plot.color': 'rgb(116,149,187)' });
                studies.push(id);
                id = this.tvWidget.chart().createStudy('Moving Average', false, false, [30], null, { 'plot.color': 'rgb(118,32,99)' });
                studies.push(id);
                const state = 1;
                for (let i = 0; i < studies.length; i++) {
                    this.tvWidget.chart().getStudyById(studies[i]).setVisible(state);
                }
            });
        },
        createDepthBtn() {
            const button = this.tvWidget.createButton({ align: 'right' })[0];
            button.textContent = this.$t('trade.depthView');
            button.setAttribute('style', 'cursor: pointer;');
            button.addEventListener('click', () => {
                this.toogleDepth();
            });

            const klineButton = this.tvWidget.createButton({ align: 'right' })[0];
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


