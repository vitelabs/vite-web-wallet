import { widget } from 'charting/charting_library.min';
import config from './config.ts';
import datafeedClass from './datafeeds.js';

class kline {
    constructor({ activeTxPair, locale }, onReady) {
        this.tvWidget = null;
        this.isLoading = true;

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
        this.tvWidget.setSymbol(this.symbolName, config.interval);
    }

    create(onReady) {
        this.isLoading = true;

        this.remove();

        config.datafeed = this.datafeed;
        config.locale = this.locale;

        const historySymbol = this.symbolName;

        this.tvWidget = new widget(config);
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
