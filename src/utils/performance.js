import statistics from 'utils/statistics';

function recordPerformance() {
    try {
        if (!window.performance) {
            return;
        }

        var fetchStart = window.performance.timing.fetchStart;  // any requests

        // DNS
        var DNSStart = window.performance.timing.domainLookupStart; // dns end
        var DNSEnd = window.performance.timing.domainLookupEnd; // dns end
        var DNSTimes = DNSEnd - DNSStart;
        statistics.event('performance', 'DNS', 'time', DNSTimes);

        // load
        var firstByteTime = window.performance.timing.responseStart;

        var whiteTimes = firstByteTime - fetchStart;
        statistics.event('performance', 'white', 'time', whiteTimes);

        var loadedTimes = new Date().getTime() - fetchStart;
        statistics.event('performance', 'loaded', 'time', loadedTimes);

    } catch(err) {
        console.warn(err);
    }
}

recordPerformance();
