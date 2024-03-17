const statisticsNull = {
    pageView(...args) {
        import.meta.env.DEV && console.log('[statistics pageView]', JSON.stringify(args));
    },
    event(...args) {
        import.meta.env.DEV && console.log('[statistics event]', JSON.stringify(args));
    }
};

const statistics = {
    pageView(path) {
        // _hmt.push([ '_trackPageview', path ]);
    },
    event(...args) {
        if (args.length < 2) {
            return;
        }
        // _hmt.push(['_trackEvent'].concat(args));
    }
};

export default import.meta.env.PROD ? statistics : statisticsNull;
