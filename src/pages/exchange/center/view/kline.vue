<template>
    <div id="tv_chart_container" class="tradingview-widget-container">

    </div>
</template>

<script>
// import { widget } from './charting_library.min';
// import './datafeeds/udf/dist/polyfills.js';
// require('./datafeeds/udf/dist/bundle.js');

// console.log();
// console.log(xx);

export default {
    mounted() {
        // const widgetOptions = {
        //     symbol: this.symbol,
        //     // BEWARE: no trailing slash is expected in feed URL
        //     datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.datafeedUrl),
        //     interval: this.interval,
        //     container_id: this.containerId,
        //     library_path: this.libraryPath,

        //     // locale: getLanguageFromURL() || 'en',
        //     locale: 'en',
        //     disabled_features: ['use_localstorage_for_settings'],
        //     enabled_features: ['study_templates'],
        //     charts_storage_url: this.chartsStorageUrl,
        //     charts_storage_api_version: this.chartsStorageApiVersion,
        //     client_id: this.clientId,
        //     user_id: this.userId,
        //     fullscreen: this.fullscreen,
        //     autosize: this.autosize,
        //     studies_overrides: this.studiesOverrides,
        // };

        // const tvWidget = new widget(widgetOptions);
        // this.tvWidget = tvWidget;
        // console.log(widget);
    }
};
</script>

<style lang="scss" scoped>
.tradingview-widget-container {
    width: 100%;
    height: 100%;
}
</style>


