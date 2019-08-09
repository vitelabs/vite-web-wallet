import statistics from 'utils/statistics';

function recordPerformance() {
    try {
        if (!window.performance) {
            return;
        }

        // Any requests
        const fetchStart = window.performance.timing.fetchStart;

        // DNS

        // Dns start
        const DNSStart = window.performance.timing.domainLookupStart;
        // Dns end
        const DNSEnd = window.performance.timing.domainLookupEnd;
        const DNSTimes = DNSEnd - DNSStart;
        statistics.event('performance', 'DNS', 'time', DNSTimes);

        // Load
        const firstByteTime = window.performance.timing.responseStart;

        const whiteTimes = firstByteTime - fetchStart;
        statistics.event('performance', 'white', 'time', whiteTimes);

        const loadedTimes = new Date().getTime() - fetchStart;
        statistics.event('performance', 'loaded', 'time', loadedTimes);
    } catch (err) {
        console.warn(err);
    }
}

recordPerformance();
