import { klineMinute } from 'services/exchange';

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
        return setTimeout(() => {
            onSymbolResolvedCallback({
                name: this.symbolName,
                description: this.symbolName,
                type: 'bitcoin'
            });
        }, 0);
    }
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        console.log('getBars', symbolInfo, resolution, from, to, onErrorCallback, onHistoryCallback, firstDataRequest);
        // console.log(firstDataRequest);
        firstDataRequest && klineMinute({
            fdate: from, 
            tdate: to,
            ftoken: this.activeTxPair.ftoken, 
            ttoken: this.activeTxPair.ttoken
        }).then((data) => {
            let list = [];
            data && data.forEach(_d => {
                list.push({
                    time: _d.txUnit * 1000,
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



    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        console.log('subscribeBars');
        console.log(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
    }
    unsubscribeBars(subscriberUID) {
        console.log(subscriberUID);
    }
    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        console.log(resolution, resolutionBack, intervalBack);
        return undefined;
    }
    getMarks(symbolInfo, from, to, onDataCallback, resolution) {
        console.log('getMarks');
        console.log(symbolInfo, from, to, onDataCallback, resolution);
    }
    getTimescaleMarks(symbolInfo, from, to, onDataCallback, resolution) {
        console.log('getTimescaleMarks');
        console.log(symbolInfo, from, to, onDataCallback, resolution);
    }
    getServerTime() {
        // console.log(callback);
    }
}
