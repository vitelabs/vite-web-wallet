import { klineHistory } from 'services/exchange';

export default class dataFeeds {
    constructor(activeTxPair) {
        this.activeTxPair = activeTxPair;
        this.symbolName = activeTxPair.ftokenShow + '/' + activeTxPair.ttokenShow;
        this.lastResolution = null;
        this.list = {};
    }
    onReady(callback) {
        return setTimeout(() => {
            callback({
                exchanges: [],
                symbols_types: [],
                supported_resolutions: ['1', '30', '60', '360', '720', '1D', '1W'],
                supports_marks: true,
                supports_timescale_marks: true,
                supports_time: false
            });
        }, 0);
    }
    resolveSymbol(symbolName, onSymbolResolvedCallback) {
        // console.log('resolveSymbol', symbolName);
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
    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) {
        // firstDataRequest
        if (resolution === this.lastResolution) {
            return;
        }

        this.lastResolution = resolution;

        let day = 60 * 60 * 24;
        let historyReq = [];
        let i;
        for (i=from; i<to; i+=day) {
            if (i === from) {
                continue;
            }
            historyReq.push(klineHistory({
                from: i - day, to: i, 
                resolution,
                ftoken: this.activeTxPair.ftoken, 
                ttoken: this.activeTxPair.ttoken
            }));
        }
        (i-day < to) && historyReq.push(klineHistory({
            from: i-day, to, 
            resolution,
            ftoken: this.activeTxPair.ftoken, 
            ttoken: this.activeTxPair.ttoken
        }));
        
        let res;
        try {
            res = await Promise.all(historyReq);
        } catch(err) {
            console.warn(err);
            onErrorCallback(err);
            return;
        }

        let isHaveData = false;
        let isError = false;
        let errMsg = '';
        let nextTime;
        let list = [];

        res.forEach((res_item) => {
            isHaveData = isHaveData || res_item.s !== 'no_data';
            isError = isError || res_item.s === 'error';

            if (res_item.s === 'no_data' || isError) {
                nextTime = nextTime || res_item.nextTime;
                errMsg = res_item.errmsg;
                return;
            }

            res_item.t.forEach((_t, i) => {
                list.push({
                    time: _t,
                    close: res_item.c[i],
                    open: res_item.o[i],
                    high: res_item.h[i],
                    low: res_item.l[i],
                    volume: res_item.v[i],
                });
            });
        });

        if (isError) {
            onErrorCallback(errMsg);
            return;
        }

        if (!isHaveData) {
            onHistoryCallback([], {
                noData: true,
                nextTime
            });
            return;
        }

        let _list = [];
        let index = 0;
        let timeList = {
            '1': 1 * 60,
            '30': 30 * 60,
            '60': 60 * 60,
            '360': 360 * 60,
            '720': 720 * 60,
            '1D': 24 * 60 * 60,
            '1W': 7 * 24 * 60 * 60
        };

        for (let time=list[0].time; time<to; time+=timeList[resolution]) {
            if (list[index] && time === list[index].time) {
                _list.push(list[index]);
                index++;
                continue;
            }

            let lastItem = _list[_list.length - 1];
            _list.push({
                time: time * 1000,
                close: lastItem.close,
                open: lastItem.close,
                high: lastItem.close,
                low: lastItem.close,
                volume: 0,
            });
        }

        onHistoryCallback(_list, { noData: false });
    }



    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback) {
        console.log(symbolInfo, resolution, onRealtimeCallback, subscriberUID, onResetCacheNeededCallback);
        // return onRealtimeCallback(this.list[resolution]);
        return undefined;
    }
    unsubscribeBars(subscriberUID) {
        console.log(subscriberUID);
        return undefined;
    }
    calculateHistoryDepth(resolution, resolutionBack, intervalBack) {
        // klineHistory
        console.log(resolution, resolutionBack, intervalBack);
        return undefined;
    }
    getMarks(symbolInfo, from, to, onDataCallback, resolution) {
        console.log(symbolInfo, from, to, onDataCallback, resolution);
        return undefined;
    }
    getTimescaleMarks(symbolInfo, from, to, onDataCallback, resolution) {
        console.log(symbolInfo, from, to, onDataCallback, resolution);
        return undefined;
    }
    getServerTime() {
        // console.log(callback);
    }
}
