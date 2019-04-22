import { klineHistory } from 'services/trade';
import { subTask } from 'utils/proto/subTask';

const timers = {};
const maxReqBarNum = 1500;

// 接口一次请求 1440 个柱（则请求时间间隔 = 时间间隔 * 1440）
// tradingView 每次传递 1441 个柱
// 当前支持的时间

// tradingView传入getBars     接口入参        时间间隔
//     1                      minute          60
//     1                      minute30        30 * 60
//     60                     hour            60 * 60
//     60                     hour6           360 * 60
//     60                     hour12          720 * 60
//     1D                     day             24 * 60 * 60
//     D                      week            7 * 24 * 60 * 60

const _timeList = {
    'minute': 60,
    'minute30': 30 * 60,
    'hour': 60 * 60,
    'hour6': 360 * 60,
    'hour12': 720 * 60,
    'day': 24 * 60 * 60,
    'week': 7 * 24 * 60 * 60
};

export default class dataFeeds {
    constructor(activeTxPair) {
        this.activeTxPair = activeTxPair;
        this.symbolName = `${ activeTxPair.ftokenShow }/${ activeTxPair.ttokenShow }`;
        this.lastResolution = null;
        this.list = {};
        this.lastBar = null;
    }

    onReady(callback) {
        return setTimeout(() => {
            callback({
                exchanges: [],
                symbols_types: [],
                supported_resolutions: [ '1', '30', '60', '360', '720', '1D', '1W' ],
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
                type: 'crypto',
                session: '24x7',
                timezone: 'UTC',
                ticker: symbolName,
                minmov: 1,
                pricescale: 100000000,
                has_intraday: true,
                intraday_multipliers: [ '1', '60' ],
                supported_resolution: [ '1', '30', '60', '360', '720', '1D', '1W' ],
                volume_precision: 8,
                data_status: 'streaming'
                // Name: this.symbolName,
                // description: this.symbolName,
                // type: 'bitcoin'
            });
        }, 0);
    }

    async getBars(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback) {
        // console.log('[getBars start]', resolution, from, to);

        const _resolution = formatResolution(resolution, from, to);
        this.lastResolution = _resolution;

        let result;
        try {
            result = await this.fetchKlineData(_resolution, from, to);
        } catch (err) {
            console.warn(err);
            onErrorCallback(err);
            return;
        }

        const { isError, errMsg, isHaveData, nextTime, list } = result;

        if (isError) {
            // console.log('[getBars end] error');
            onErrorCallback(errMsg);
            return;
        }

        if (!isHaveData) {
            // console.log('[getBars end] noData');
            onHistoryCallback([], {
                noData: true,
                nextTime
            });
            return;
        }

        const _list = fillKlineData(list, _resolution);

        // console.log('[getBars end]', new Date(_list[_list.length - 1].time), _list[_list.length - 1], list[list.length - 1], list[0]);

        this.lastBar = _list[_list.length - 1];
        onHistoryCallback(_list, { noData: false });
    }

    async fetchKlineData(resolution, from, to) {
        const historyReq = [];
        const reqTimeDiff = _timeList[resolution] * maxReqBarNum;
        const pushReq = (from, to) => {
            historyReq.push(klineHistory({
                from,
                to,
                resolution,
                ftoken: this.activeTxPair.ftoken,
                ttoken: this.activeTxPair.ttoken
            }));
        };

        let i;
        for (i = from; i < to; i += reqTimeDiff) {
            if (i === from) {
                continue;
            }
            pushReq(i - reqTimeDiff, i);
        }
        (i - reqTimeDiff < to) && pushReq(i - reqTimeDiff, to);

        // console.log('[kline req num]', historyReq.length);

        return Promise.all(historyReq).then(res => formatReqKlineData(res));
    }

    subscribeBars(symbolInfo, resolution, onRealtimeCallback, subscriberUID) {
        this.unsubscribeBars(subscriberUID);
        const reqResolution = this.lastResolution;

        timers[subscriberUID] = new subTask('kline', ({ args, data }) => {
            // console.log('subscribeBars', args, new Date(data.t * 1000), data);

            if (args.ttoken !== this.activeTxPair.ttoken
                || args.ftoken !== this.activeTxPair.ftoken
                || args.resolution !== this.lastResolution) {
                this.unsubscribeBars(subscriberUID);
                return;
            }

            if (!data) {
                return;
            }

            const lastTime = this.lastBar && this.lastBar.time
                ? this.lastBar.time / 1000
                : null;

            // 不能覆盖历史数据
            if (lastTime && lastTime > data.t) {
                return;
            }

            // 传递的是当前数据，不需要补齐
            const startTime = lastTime ? lastTime + _timeList[args.resolution] : data.t;

            if (startTime >= data.t) {
                this.lastBar = {
                    time: data.t * 1000,
                    close: data.c,
                    open: data.o,
                    high: data.h,
                    low: data.l,
                    volume: data.v
                };
                onRealtimeCallback(this.lastBar);
                return;
            }

            // 补齐数据
            const list = fillKlineData([ {
                time: startTime,
                close: this.lastBar.close,
                open: this.lastBar.close,
                high: this.lastBar.close,
                low: this.lastBar.close,
                volume: 0
            }, {
                time: data.t,
                close: data.c,
                open: data.o,
                high: data.h,
                low: data.l,
                volume: data.v
            } ], args.resolution);

            this.lastBar = list[list.length - 1];
            for (let i = 0 ; i < list.length; i++) {
                onRealtimeCallback(list[i]);
            }
        }, 2000);

        timers[subscriberUID].start(() => {
            return {
                ttoken: this.activeTxPair.ttoken,
                ftoken: this.activeTxPair.ftoken,
                resolution: reqResolution
            };
        });
    }

    unsubscribeBars(subscriberUID) {
        if (!subscriberUID) {
            for (const _s in timers) {
                timers[_s] && timers[_s].stop();
                timers[_s] = null;
            }
            return;
        }

        if (!timers[subscriberUID]) {
            return;
        }

        timers[subscriberUID].stop();
        timers[subscriberUID] = null;
    }

    calculateHistoryDepth() {
        // Resolution, resolutionBack, intervalBack
        return undefined;
    }

    getMarks() {
        // Console.log(symbolInfo, from, to, onDataCallback, resolution);
        return undefined;
    }

    getTimescaleMarks() {
        // Console.log(symbolInfo, from, to, onDataCallback, resolution);
        return undefined;
    }

    getServerTime() {
        return undefined;
    }
}


function formatResolution(resolution, from, to) {
    if (_timeList[resolution]) {
        return resolution;
    }

    const tradingViewMaxBars = 1441;

    if (resolution === 'D') {
        return 'week';
    }
    if (resolution === '1D') {
        return 'day';
    }

    const diff = to - from;

    if (resolution === '1') {
        return diff > _timeList.minute * tradingViewMaxBars ? 'minute30' : 'minute';
    }
    if (resolution !== '60') {
        return 'minute';
    }

    if (diff > _timeList.hour6 * tradingViewMaxBars) {
        return 'hour12';
    }
    if (diff > _timeList.hour * tradingViewMaxBars) {
        return 'hour6';
    }
    return 'hour';
}

function formatReqKlineData(res) {
    let isHaveData = false;
    let isError = false;
    let errMsg = '';
    let nextTime;
    const list = [];

    res.forEach(res_item => {
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
                volume: res_item.v[i]
            });
        });
    });

    return { isError, errMsg, isHaveData, nextTime, list };
}

function fillKlineData(list, resolution) {
    if (!list || !list.length) {
        return [];
    }

    if (list.length < 2) {
        list[0].time = list[0].time * 1000;
        return list;
    }

    const startTime = list[0].time;
    const endTime = list[list.length - 1].time;
    const timeDiff = _timeList[resolution];

    let index = 0;
    const _list = [];

    for (let time = startTime; time <= endTime; time += timeDiff) {
        // Current data
        if (list[index] && time === list[index].time) {
            list[index].time = time * 1000;
            _list.push(list[index]);
            index++;
            continue;
        }

        // Fill data by last data
        const lastItem = _list[_list.length - 1];
        _list.push({
            time: time * 1000,
            close: lastItem.close,
            open: lastItem.close,
            high: lastItem.close,
            low: lastItem.close,
            volume: 0
        });
    }

    return _list;
}
