let statisticsNull = {
    pageView(...args){
        process.env.NODE_ENV === 'dev' && console.log('[statistics pageView]', JSON.stringify(args));
    },
    event(...args){
        process.env.NODE_ENV === 'dev' && console.log('[statistics event]', JSON.stringify(args));
    }
};

let statistics = {
    pageView(path) {
        _hmt.push(['_trackPageview', path]);
    },
    event(...args) {
        if (args.length < 2) {
            return;
        }
        _hmt.push(['_trackEvent'].concat(args));
    }
};

window.onload = function () {
    if (!window.performance) {
        return;
    }
    try {
        var fetchStart = window.performance.timing.fetchStart;  // any requests

        // DNS
        var DNSStart = window.performance.timing.domainLookupStart; // dns end
        var DNSEnd = window.performance.timing.domainLookupEnd; // dns end
        var DNSTimes = DNSEnd - DNSStart;
        console.log('DNSTimes', DNSTimes);
        _hmt.push(['_trackEvent', 'performance', 'DNS', 'time', DNSTimes]);

        // load
        var firstByteTime = window.performance.timing.responseStart;

        var whiteTimes = firstByteTime - fetchStart;
        console.log('whiteTimes', whiteTimes);
        _hmt.push(['_trackEvent', 'performance', 'white', 'time', whiteTimes]);

        var loadedTimes = new Date().getTime() - fetchStart;
        console.log('loadedTimes', loadedTimes);
        _hmt.push(['_trackEvent', 'performance', 'loaded', 'time', loadedTimes]);
    } catch(err) {
        console.warn(err);
    }
};

export default process.env.NODE_ENV === 'production' ? statistics : statisticsNull;