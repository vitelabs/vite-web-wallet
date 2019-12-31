import { widget } from 'charting/charting_library.min';
import { commonConfig, theme0Config, theme1Config } from './config.ts';
import datafeedClass from './datafeeds.js';

class kline {
    constructor({ activeTxPair, locale, theme }, onReady) {
        this.tvWidget = null;
        this.isLoading = true;

        this.theme = theme;
        this.locale = locale;
        this.activeTxPair = activeTxPair;
        this.datafeed = new datafeedClass(this.activeTxPair);

        this.create(onReady);
    }

    get symbolName() {
        if (!this.activeTxPair) {
            return null;
        }
        return `${ this.activeTxPair.tradeTokenSymbol }/${ this.activeTxPair.quoteTokenSymbol }`;
    }

    reset(activeTxPair) {
        this.activeTxPair = activeTxPair;

        if (this.isLoading || !this.tvWidget || !this.datafeed) {
            return;
        }

        this.datafeed.init(this.activeTxPair);
        this.tvWidget.setSymbol(this.symbolName, commonConfig.interval);
    }

    create(onReady) {
        this.isLoading = true;

        this.remove();
        const historySymbol = this.symbolName;
        const themeConfig = +this.theme === 0 ? theme0Config : theme1Config;
        const theme = +this.theme === 0 ? 'Light' : 'Dark';

        this.tvWidget = new widget({
            datafeed: this.datafeed,
            locale: this.locale,
            theme,
            ...commonConfig,
            ...themeConfig
        });
        this.tvWidget.onChartReady(() => {
            this.isLoading = false;

            const _chart = this.tvWidget.chart();

            _chart.setChartType(1);

            const studies = [];
            let id = _chart.createStudy('Moving Average', false, false, [7], null, { 'Plot.color': 'rgb(116,149,187)' });
            studies.push(id);
            id = _chart.createStudy('Moving Average', false, false, [30], null, { 'plot.color': 'rgb(118,32,99)' });
            studies.push(id);
            const state = 1;
            for (let i = 0; i < studies.length; i++) {
                _chart.getStudyById(studies[i]).setVisible(state);
            }

            onReady && onReady();

            if (this.symbolName !== historySymbol) {
                this.reset(this.activeTxPair);
            }
        });
    }

    remove() {
        try {
            this.tvWidget && this.tvWidget.remove();
        } catch (e) {
            // Can't remove.
        }
        this.tvWidget = null;
    }
}

export default kline;
