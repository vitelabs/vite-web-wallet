import { klineHour } from 'services/exchange';

export default class dataFeeds {
    constructor(activeTxPair) {
        this.activeTxPair = activeTxPair;
        this.symbolName = activeTxPair.ftokenShow + '/' + activeTxPair.ttokenShow;
        console.log(this.activeTxPair);
    }
    onReady(callback) {
        callback({
            exchanges: [],
            symbols_types: [],
            supported_resolutions: ['1', '15', '240', 'D', '6M'],
            supports_marks: true,
            supports_timescale_marks: true,
            supports_time: false
        });
    }
    searchSymbols(userInput, exchange, symbolType, onResultReadyCallback) {
        console.log(userInput, exchange, symbolType, onResultReadyCallback);
    }
    resolveSymbol(symbolName, onSymbolResolvedCallback, onResolveErrorCallback) {
        console.log(symbolName, onSymbolResolvedCallback, onResolveErrorCallback);
        onSymbolResolvedCallback({
            name: this.symbolName,
            description: this.symbolName
        });
    }
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        console.log('getBars');
        klineHour().then((data) => {
            onHistoryCallback(data);
        }).catch((err) => {
            onErrorCallback(err);
        });
        console.log(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest);
    }
    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        console.log('subscribeBars');
        console.log(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
    }
    unsubscribeBars(subscriberUID) {
        console.log(subscriberUID);
    }
    calculateHistoryDepth() {
        // console.log(resolution, resolutionBack, intervalBack)
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
