// import { klineMinute, klineHour } from 'services/exchange';

export default class dataFeeds {
    constructor(activeTxPair) {
        this.activeTxPair = activeTxPair;
        this.symbolName = activeTxPair.ftokenShow + '/' + activeTxPair.ttokenShow;
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
            description: this.symbolName,
            type: 'bitcoin'
        });
    }
    getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
        console.log('getBars', symbolInfo, resolution, from, to, onErrorCallback, onHistoryCallback, firstDataRequest);
        // console.log(firstDataRequest);
        // firstDataRequest && klineMinute({
        //     fdate: from, 
        //     tdate: to,
        //     ftoken: this.activeTxPair.ftoken, 
        //     ttoken: this.activeTxPair.ttoken
        // }).then((data) => {
        //     let list = [];
        //     data && data.forEach(_d => {
        //         list.push({
        //             time: _d.txUnit * 1000,
        //             close: _d.closePrice,
        //             open: _d.openPrice,
        //             high: _d.highPrice,
        //             low: _d.lowPrice,
        //             volume: _d.amount
        //         });
        //     });
        //     onHistoryCallback(list, {
        //         noData: !list || !list.length
        //     });
        // }).catch((err) => {
        //     onErrorCallback(err);
        // });
        console.log(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest);
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
