import { klineMinute, klineHour } from 'services/exchange';

export default class dataFeeds {
    constructor(activeTxPair) {
        this.activeTxPair = activeTxPair;
        this.symbolName = activeTxPair.ftokenShow + '/' + activeTxPair.ttokenShow;
    }
    onReady(callback) {
        return setTimeout(() => {
            callback({
                exchanges: [],
                symbols_types: [],
                supported_resolutions: ['1', '60'],
                supports_marks: true,
                supports_timescale_marks: true,
                supports_time: false
            });
        }, 0);
    }
    resolveSymbol(symbolName, onSymbolResolvedCallback) {
        // console.log(symbolName);
        return setTimeout(() => {
            onSymbolResolvedCallback({
                name: this.symbolName,
                description: this.symbolName,
                type: 'crypto',
                session: '24x7',
                timezone: 'UTC',
                ticker: symbolName,
                // exchange: split_data[0],
                minmov: 1,
                pricescale: 100000000,
                has_intraday: true,
                intraday_multipliers: ['1', '60'],
                // supported_resolution:  supportedResolutions,
                volume_precision: 8,
                data_status: 'streaming'
                // name: this.symbolName,
                // description: this.symbolName,
                // type: 'bitcoin'
            });
        }, 0);
    }
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        console.log('getBars', symbolInfo, resolution, from, to, onErrorCallback, onHistoryCallback, firstDataRequest);

        if (!firstDataRequest) {
            return;
        }

        let func = +resolution === 1 ? klineMinute : klineHour;

        func({
            fdate: from, 
            tdate: to,
            ftoken: this.activeTxPair.ftoken, 
            ttoken: this.activeTxPair.ttoken
        }).then((data) => {
            let list = [];
            let timeDiff = +resolution === 1 ? 60 * 1000 : 60 * 60 * 1000;
            data && data.forEach(_d => {
                let time = _d.txUnit * timeDiff;
                console.log(new Date(time));
                list.push({
                    time,
                    close: _d.closePrice,
                    open: _d.openPrice,
                    high: _d.highPrice,
                    low: _d.lowPrice,
                    volume: _d.amount
                });
            });

            onHistoryCallback(list, {
                noData: !list || !list.length,
                nextTime: new Date().getTime()
            });
        }).catch((err) => {
            onErrorCallback(err);
        });
    }



    subscribeBars() {
        // console.log(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
        return undefined;
    }
    unsubscribeBars() {
        // console.log(subscriberUID);
        return undefined;
    }
    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        // klineHistory
        console.log(resolution, resolutionBack, intervalBack);
        return undefined;
    }
    getMarks() {
        // console.log(symbolInfo, from, to, onDataCallback, resolution);
        return undefined;
    }
    getTimescaleMarks() {
        // console.log(symbolInfo, from, to, onDataCallback, resolution);
        return undefined;
    }
    getServerTime() {
        // console.log(callback);
    }
}
