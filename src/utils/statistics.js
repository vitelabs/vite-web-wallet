const statisticsNull = {
    pageView(...args) {
        process.env.NODE_ENV === 'dev' && console.log('[statistics pageView]', JSON.stringify(args));
    },
    event(...args) {
        process.env.NODE_ENV === 'dev' && console.log('[statistics event]', JSON.stringify(args));
    }
};

const statistics = {
    pageView(path) {
        _hmt.push([ '_trackPageview', path ]);
    },
    event(...args) {
        if (args.length < 2) {
            return;
        }
        _hmt.push(['_trackEvent'].concat(args));
    }
};

export default process.env.NODE_ENV === 'production' ? statistics : statisticsNull;
