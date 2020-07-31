export const commonConfig = {
    fullscreen: false,
    autosize: true,
    interval: '360',
    allow_symbol_change: true,
    container_id: 'tv_chart_container',
    library_path: '/charting_library/',
    drawings_access: {
        type: 'black',
        tools: [{ name: 'Trend Line' }]
    },
    // Main_series_scale_menu header_indicators
    disabled_features: [ 'left_toolbar', 'use_localstorage_for_settings', 'volume_force_overlay', 'header_compare', 'header_symbol_search', 'header_chart_type' ],
    enabled_features: ['move_logo_to_main_pane'],
    time_frames: [
        { text: '30m', resolution: '30', description: '30 Minutes' },
        { text: '1W', resolution: '1W', description: '1 Week' }
    ],
    favorites: {
        intervals: [ '1', '60' ],
        chartTypes: ['CANDLES']
    }
};

export const theme0Config = {
    custom_css_url: '/charting_library/charting_custom.css',
    overrides: {
        'mainSeriesProperties.style': 0,
        'symbolWatermarkProperties.color': '#944',
        'volumePaneSize': 'medium',
        'mainSeriesProperties.candleStyle.upColor': '#00D764',
        'mainSeriesProperties.candleStyle.downColor': '#E5494D',
        'mainSeriesProperties.candleStyle.borderUpColor': '#00D764',
        'mainSeriesProperties.candleStyle.borderDownColor': '#E5494D',
        'paneProperties.vertGridProperties.style': 0,
        'paneProperties.crossHairProperties.color': '#545F75',
        'scalesProperties.lineColor': '#bdc1d1',
        'scalesProperties.textColor': '#5e6875',
        'scalesProperties.fontSize': 10
    },
    studies_overrides: {
        'bollinger bands.median.color': '#33FF88',
        'bollinger bands.upper.linewidth': 7
    },
    loading_screen: { foregroundColor: '#007AFF' },
    toolbar_bg: '#f4f7f9'
};

export const theme1Config = {
    custom_css_url: '/charting_library/charting_custom_theme1.css',
    overrides: {
        'mainSeriesProperties.style': 0,
        'symbolWatermarkProperties.color': '#E5494D',
        'volumePaneSize': 'medium',
        'paneProperties.background': '#151C32',
        'mainSeriesProperties.candleStyle.upColor': '#00D764',
        'mainSeriesProperties.candleStyle.downColor': '#E5494D',
        'mainSeriesProperties.candleStyle.borderUpColor': '#00D764',
        'mainSeriesProperties.candleStyle.borderDownColor': '#E5494D',
        'paneProperties.vertGridProperties.style': 0,
        'paneProperties.crossHairProperties.color': '#1E2745',
        'scalesProperties.textColor': '#545F75',
        'scalesProperties.lineColor': '#01081F',
        'scalesProperties.fontSize': 10
    },
    studies_overrides: {
        'bollinger bands.median.color': '#00D764',
        'bollinger bands.upper.linewidth': 7
    },
    loading_screen: {
        backgroundColor: '#151C32',
        foregroundColor: '#007AFF'
    },
    toolbar_bg: '#151C32'
};
